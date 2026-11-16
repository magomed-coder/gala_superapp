const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");
const cache = new Map();

/** Загружает доменные TypeScript-модули и локальные изображения без React Native. */
function load(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);

  const filename = path.resolve(__dirname, "..", relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loaded = new Module(filename, module);
  loaded.filename = filename;
  loaded.require = (request) => {
    if (!request.startsWith("@/")) return require(request);

    const relative = request.slice(2);
    const resolved = path.resolve(__dirname, "..", relative);
    if (/\.(png|webp)$/.test(request)) {
      assert.ok(fs.existsSync(resolved));
      return request;
    }
    if (request.endsWith(".json")) return require(resolved);
    return load(`${relative}.ts`);
  };
  loaded._compile(compiled, filename);
  cache.set(relativePath, loaded.exports);
  return loaded.exports;
}

const { catalogListings } = load("features/services/api/catalog.data.ts");
const { catalogSellers, findCatalogSeller, getSellerListings } = load(
  "features/services/api/sellers.api.ts",
);

test("Каждое предложение связано с существующим профилем, который сохраняет имя и локацию", () => {
  assert.equal(
    new Set(catalogSellers.map((seller) => seller.id)).size,
    catalogSellers.length,
  );

  for (const listing of catalogListings) {
    const seller = findCatalogSeller(listing.sellerId);
    assert.ok(seller, `Нет продавца для ${listing.id}`);
    assert.equal(seller.name, listing.seller);
    assert.equal(seller.location, listing.location);
    assert.ok(getSellerListings(seller.id).includes(listing));
  }
});

test("Одинаковые имена местных продавцов не смешивают ассортимент разных магазинов", () => {
  const electronics = catalogListings.find(
    (listing) => listing.id === "electronics-phones-accessories-2",
  );
  const clothing = catalogListings.find(
    (listing) => listing.id === "clothing-tailoring-mens-clothing-2",
  );
  assert.equal(electronics.seller, clothing.seller);
  assert.notEqual(electronics.sellerId, clothing.sellerId);

  const listings = getSellerListings(electronics.sellerId);
  assert.ok(listings.length > 0);
  assert.ok(
    listings.every((listing) => listing.sellerId === electronics.sellerId),
  );
  assert.ok(!listings.includes(clothing));
});

test("Магазин и специалист одного раздела имеют отдельные профили и предложения", () => {
  const store = findCatalogSeller("electronics-store");
  const specialist = findCatalogSeller("electronics-specialist");
  assert.equal(store.kind, "store");
  assert.equal(specialist.kind, "specialist");
  assert.ok(
    getSellerListings(store.id).every((listing) => listing.kind === "product"),
  );
  assert.ok(
    getSellerListings(specialist.id).every(
      (listing) => listing.kind === "service",
    ),
  );
});

test("Неизвестный ID не показывает чужой магазин, команда сохраняет свои предложения из разных разделов", () => {
  assert.equal(findCatalogSeller("missing-seller"), undefined);
  assert.equal(findCatalogSeller(undefined), undefined);
  assert.deepEqual(getSellerListings("missing-seller"), []);

  const listings = getSellerListings("allin-team");
  assert.ok(listings.length > 1);
  assert.ok(new Set(listings.map((listing) => listing.categoryId)).size > 1);
  assert.ok(listings.every((listing) => listing.seller === "Команда ALLIN"));
});
