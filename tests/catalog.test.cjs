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
const { catalogCategories, catalogListings, findCatalogCategory } = load(
  "features/services/api/catalog.data.ts",
);
const { getCategoryPreview } = load(
  "features/services/utils/category-preview.ts",
);
const { formatListingPrice } = load(
  "features/services/utils/listing-presentation.ts",
);
const sources = require("../assets/imgs/catalog/sources.json");

test("В смешанном разделе товары и услуги сохраняют свою цену и тип продавца", () => {
  const product = catalogListings.find(
    (item) => item.id === "electronics-phones-accessories-2",
  );
  const service = catalogListings.find(
    (item) => item.id === "electronics-phone-repair-2",
  );
  assert.equal(product.categoryId, service.categoryId);
  assert.equal(product.kind, "product");
  assert.equal(service.kind, "service");
  assert.equal(product.seller, "Местный продавец");
  assert.equal(service.seller, "Местный специалист");
  assert.equal(
    formatListingPrice(product),
    `${product.price.toLocaleString("ru-RU")} ₽`,
  );
  assert.equal(
    formatListingPrice(service),
    `от ${service.price.toLocaleString("ru-RU")} ₽`,
  );
  for (const listing of catalogListings) {
    assert.ok(["product", "service"].includes(listing.kind));
  }
});

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
  const matches = filterCatalog(catalogListings, {
    query: "  ПРИЕМ   врачей  ",
  });
  assert.equal(matches.length, 2);
  assert.ok(matches.every((item) => item.subcategoryId === "doctors"));
  assert.deepEqual(
    filterCatalog(catalogListings, { query: "несуществующий запрос" }),
    [],
  );
});

test("13 разделов сохраняют все 169 подкатегорий с изображениями и аудиторией", () => {
  assert.equal(catalogCategories.length, 13);
  assert.equal(
    catalogCategories.flatMap((category) => category.children).length,
    169,
  );
  for (const group of sources.categories) {
    const category = findCatalogCategory(group.categoryId);
    assert.ok(category?.image);
    const nestedGroup = category.groups.find(
      (item) => item.id === group.categoryId,
    );
    assert.deepEqual(
      nestedGroup.children.map((item) => [item.id, item.name, item.audience]),
      group.images.map((item) => [
        item.subcategoryId,
        item.name,
        item.audience ?? undefined,
      ]),
    );
    for (const child of category.children) assert.ok(child.image);
  }
  const auto = catalogCategories.find((category) => category.id === "auto");
  assert.ok(auto.children.slice(5).some((child) => child.id === "tuning"));
  assert.equal(
    filterCatalog(catalogListings, {
      categoryId: "auto",
      subcategoryId: "tuning",
    }).length,
    2,
  );
});

test("Объединения соответствуют согласованным разделам без повторов подкатегорий", () => {
  const merged = {
    "Дом и ремонт": ["home-repair", "furniture-interior", "cleaning-household"],
    "Красота и здоровье": ["beauty-care", "health"],
    "Семья и обучение": ["children-family", "education"],
    "Праздники и подарки": ["weddings-events", "flowers-gifts"],
    "Спорт и отдых": ["sports", "travel-leisure"],
  };
  for (const [name, groupIds] of Object.entries(merged)) {
    const category = catalogCategories.find((item) => item.name === name);
    assert.deepEqual(
      category.groups.map((group) => group.id),
      groupIds,
    );
  }
  assert.deepEqual(
    catalogCategories
      .flatMap((category) => category.groups.map((group) => group.id))
      .sort(),
    sources.categories.map((category) => category.categoryId).sort(),
  );
  for (const category of catalogCategories) {
    assert.equal(
      new Set(category.children.map((child) => child.id)).size,
      category.children.length,
    );
    assert.deepEqual(
      category.children,
      category.groups.flatMap((group) => group.children),
    );
  }
  assert.equal(findCatalogCategory("garden-farming").name, "Сад и животные");
  assert.equal(findCatalogCategory("missing"), undefined);
  assert.equal(findCatalogCategory(undefined), undefined);
});

test("Старые ссылки и избранное сохраняют предложения, цены и изображения", () => {
  assert.equal(catalogListings.length, 338);
  sources.categories.forEach((source, categoryIndex) => {
    const category = findCatalogCategory(source.categoryId);
    source.images.forEach((child, childIndex) => {
      const matches = filterCatalog(catalogListings, {
        categoryId: category.id,
        subcategoryId: child.subcategoryId,
      });
      assert.equal(matches.length, 2);
      matches.forEach((listing, variant) => {
        assert.equal(
          listing.id,
          `${source.categoryId}-${child.subcategoryId}-${variant + 1}`,
        );
        assert.equal(
          listing.price,
          500 + categoryIndex * 250 + childIndex * 350 + variant * 600,
        );
        assert.equal(listing.image, `@/assets/imgs/catalog/${child.file}`);
      });
    });
  });
});

test("Фильтр объединённого раздела включает все его группы и исключает соседние", () => {
  const category = findCatalogCategory("home-repair");
  const matches = filterCatalog(catalogListings, { categoryId: category.id });
  assert.equal(matches.length, category.children.length * 2);
  for (const id of ["plumbing", "custom-kitchens", "home-cleaning"]) {
    assert.ok(matches.some((listing) => listing.subcategoryId === id));
  }
  assert.ok(!matches.some((listing) => listing.subcategoryId === "doctors"));
});

test("Пять плиток главной представляют каждую группу; галерея содержит те же 13 разделов", () => {
  for (const category of catalogCategories) {
    const preview = getCategoryPreview(category);
    assert.equal(preview.length, Math.min(5, category.children.length));
    assert.equal(
      new Set(preview.map((child) => child.id)).size,
      preview.length,
    );
    for (const group of category.groups) {
      assert.ok(
        preview.some((child) =>
          group.children.some((item) => item.id === child.id),
        ),
      );
    }
  }
  const { categoryIllustrations } = load(
    "features/services/utils/category-illustrations.ts",
  );
  assert.deepEqual(
    categoryIllustrations.map((item) => [item.id, item.name, item.image]),
    catalogCategories.map((item) => [item.id, item.name, item.image]),
  );
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
