const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");

// Загружаем чистую TypeScript-логику без запуска React Native и Metro.
function load(relativePath) {
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
    if (request.startsWith("@/")) {
      const relative = request.slice(2);
      const resolved = path.resolve(__dirname, "..", relative);
      if (/\.(png|webp)$/.test(request)) {
        assert.ok(fs.existsSync(resolved), `Нет изображения: ${relative}`);
        return request;
      }
      if (request.endsWith(".json")) return require(resolved);
      return load(`${relative}.ts`);
    }
    return require(request);
  };
  loaded._compile(compiled, filename);
  return loaded.exports;
}

const { filterCatalog } = load("features/services/utils/filter-catalog.ts");
const { catalogCategories, catalogListings } = load(
  "features/services/api/catalog.data.ts",
);

test("Все предложения имеют уникальный маршрут и существующую подкатегорию", () => {
  assert.equal(
    new Set(catalogListings.map((item) => item.id)).size,
    catalogListings.length,
  );
  assert.equal(
    new Set(catalogCategories.map((item) => item.id)).size,
    catalogCategories.length,
  );
  assert.ok(!catalogCategories.some((item) => item.id === "delivery-moving"));
  assert.ok(!catalogCategories.some((item) => item.id === "transport-trips"));
  for (const listing of catalogListings) {
    const parent = catalogCategories.find(
      (item) => item.id === listing.categoryId,
    );
    assert.ok(
      parent?.children.some((item) => item.id === listing.subcategoryId),
    );
  }
});

test("Поиск учитывает все слова, регистр и ё/е", () => {
  const matches = filterCatalog(catalogListings, { query: "  ПРИЕМ   врачей  " });
  assert.equal(matches.length, 2);
  assert.ok(matches.every((item) => item.subcategoryId === "doctors"));
  assert.deepEqual(
    filterCatalog(catalogListings, { query: "несуществующий запрос" }),
    [],
  );
});

test("Согласованные 19 разделов и 169 подкатегорий доступны с основными изображениями", () => {
  const sources = require("../assets/imgs/catalog/sources.json");
  assert.equal(catalogCategories.length, 19);
  assert.equal(catalogCategories.flatMap((category) => category.children).length, 169);
  for (const group of sources.categories) {
    const category = catalogCategories.find((item) => item.id === group.categoryId);
    assert.ok(category?.image);
    assert.deepEqual(
      category.children.map((item) => [item.id, item.name, item.audience]),
      group.images.map((item) => [item.subcategoryId, item.name, item.audience ?? undefined]),
    );
    for (const child of category.children) assert.ok(child.image);
  }
  const auto = catalogCategories.find((category) => category.id === "auto");
  assert.ok(auto.children.slice(5).some((child) => child.id === "tuning"));
  assert.equal(filterCatalog(catalogListings, { categoryId: "auto", subcategoryId: "tuning" }).length, 2);
});

test("Категория, подкатегория и цена применяются одновременно", () => {
  const listing = catalogListings[0];
  const matches = filterCatalog(catalogListings, {
    categoryId: listing.categoryId,
    subcategoryId: listing.subcategoryId,
    maxPrice: listing.price,
  });
  assert.deepEqual(
    matches.map((item) => item.id),
    [listing.id],
  );
  assert.deepEqual(filterCatalog(catalogListings, { maxPrice: 0 }), []);
  assert.deepEqual(
    filterCatalog(catalogListings, { categoryId: "missing" }),
    [],
  );
});

test("Сортировка не меняет порядок исходных данных; сброс возвращает все предложения", () => {
  const before = catalogListings.map((item) => item.id);
  for (const sort of ["price-asc", "price-desc"]) {
    const sorted = filterCatalog(catalogListings, { sort });
    assert.ok(
      sorted.every(
        (item, index) =>
          index === 0 ||
          (sort === "price-asc"
            ? sorted[index - 1].price <= item.price
            : sorted[index - 1].price >= item.price),
      ),
    );
  }
  assert.deepEqual(
    catalogListings.map((item) => item.id),
    before,
  );
  assert.deepEqual(filterCatalog(catalogListings, {}), catalogListings);
});
