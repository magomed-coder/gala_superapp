const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");
const cache = new Map();
const storage = new Map();
let failWrite = false;

/** Загружает правила и API черновика без нативной среды; хранилище моделирует ошибки записи. */
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
    if (request === "@react-native-async-storage/async-storage") {
      return {
        __esModule: true,
        default: {
          getItem: async (key) => storage.get(key) ?? null,
          setItem: async (key, value) => {
            if (failWrite) throw new Error("Disk unavailable");
            storage.set(key, value);
          },
        },
      };
    }
    if (!request.startsWith("@/")) return require(request);
    const relative = request.slice(2);
    if (/\.(png|webp)$/.test(relative)) return relative;
    if (relative.endsWith(".json"))
      return require(path.resolve(__dirname, "..", relative));
    return load(`${relative}.ts`);
  };
  loaded._compile(compiled, filename);
  cache.set(relativePath, loaded.exports);
  return loaded.exports;
}

const { getPurchaseCapabilities, validateListingDraft, parseListingPrice } =
  load("features/services/utils/listing-purchase.ts");
const { saveListingDraft, loadListingDraft } = load(
  "features/services/api/listing-draft.api.ts",
);
const { formatListingPrice } = load(
  "features/services/utils/listing-presentation.ts",
);
const { catalogListings } = load("features/services/api/catalog.data.ts");
const { calculatePurchaseTotal, clampPurchaseQuantity } = load(
  "features/services/utils/listing-purchase.ts",
);

test("Количество не падает ниже единицы, итог считает копейки и отвергает некорректную цену", () => {
  assert.equal(clampPurchaseQuantity(0), 1);
  assert.equal(clampPurchaseQuantity(-10), 1);
  assert.equal(clampPurchaseQuantity(1000), 999);
  assert.equal(clampPurchaseQuantity(2.7), 2);
  assert.equal(clampPurchaseQuantity(NaN), 1);
  assert.equal(calculatePurchaseTotal(1500.5, 3), 4501.5);
  assert.equal(calculatePurchaseTotal(0.1, 3), 0.3);
  assert.equal(calculatePurchaseTotal(19.99, 999), 19970.01);
  assert.equal(calculatePurchaseTotal(null, 2), null);
  assert.equal(calculatePurchaseTotal(-1, 2), null);
  assert.equal(calculatePurchaseTotal(Infinity, 2), null);
  assert.equal(calculatePurchaseTotal(Number.MAX_SAFE_INTEGER, 999), null);
});
const draft = {
  title: "Стол",
  kind: "product",
  description: "Стол 120 × 80 см, самовывоз",
  priceText: "1500,50",
  purchaseMode: "both",
};

test("Три режима задают ровно разрешённые действия; отсутствие выбора не включает покупку", () => {
  assert.deepEqual(getPurchaseCapabilities("purchase"), {
    canBuy: true,
    canDiscuss: false,
  });
  assert.deepEqual(getPurchaseCapabilities("negotiation"), {
    canBuy: false,
    canDiscuss: true,
  });
  assert.deepEqual(getPurchaseCapabilities("both"), {
    canBuy: true,
    canDiscuss: true,
  });
  assert.deepEqual(getPurchaseCapabilities(null), {
    canBuy: false,
    canDiscuss: false,
  });
});

test("Поставщик обязан явно выбрать режим для товара и услуги; покупка требует фиксированную цену", () => {
  for (const kind of ["product", "service"]) {
    assert.ok(validateListingDraft({ ...draft, kind, purchaseMode: null }));
    assert.ok(
      validateListingDraft({ ...draft, kind, purchaseMode: "unknown" }),
    );
    for (const purchaseMode of ["purchase", "both"]) {
      assert.equal(
        validateListingDraft({ ...draft, kind, purchaseMode }),
        null,
      );
      assert.ok(
        validateListingDraft({ ...draft, kind, purchaseMode, priceText: "" }),
      );
      assert.ok(
        validateListingDraft({ ...draft, kind, purchaseMode, priceText: "0" }),
      );
    }
    assert.equal(
      validateListingDraft({
        ...draft,
        kind,
        purchaseMode: "negotiation",
        priceText: "",
      }),
      null,
    );
  }
});

test("Цена принимает рубли и копейки, отвергает некорректные значения", () => {
  assert.equal(parseListingPrice("1 500,50"), 1500.5);
  assert.equal(parseListingPrice("0.01"), 0.01);
  for (const value of [
    "",
    " ",
    "0",
    "-5",
    "NaN",
    "Infinity",
    "1e3",
    "3.456",
    "1,2,3",
    "9007199254740991",
  ]) {
    assert.equal(parseListingPrice(value), null, value);
  }
});

test("Демо-предложения покрывают все режимы; цена покупки фиксированная даже у услуги", () => {
  assert.deepEqual(
    new Set(catalogListings.map((item) => item.purchaseMode)),
    new Set(["purchase", "negotiation", "both"]),
  );
  for (const item of catalogListings) {
    assert.equal(
      validateListingDraft({
        title: item.title,
        kind: item.kind,
        description: item.description,
        priceText: String(item.price),
        purchaseMode: item.purchaseMode,
      }),
      null,
    );
  }
  assert.equal(
    formatListingPrice({ kind: "service", price: 500, purchaseMode: "both" }),
    "500 ₽",
  );
  assert.equal(
    formatListingPrice({
      kind: "product",
      price: 500,
      purchaseMode: "negotiation",
    }),
    "от 500 ₽",
  );
});

test("Черновик сохраняет режим, разделяет аккаунты, не перезаписывается при ошибке", async () => {
  assert.equal(await loadListingDraft("seller-a"), null);
  await saveListingDraft("seller-a", draft);
  assert.deepEqual(await loadListingDraft("seller-a"), draft);
  assert.equal(await loadListingDraft("seller-b"), null);
  assert.equal(await loadListingDraft(null), null);
  await assert.rejects(
    saveListingDraft("seller-a", { ...draft, purchaseMode: null }),
  );
  failWrite = true;
  await assert.rejects(
    saveListingDraft("seller-a", { ...draft, title: "Другой стол" }),
  );
  failWrite = false;
  assert.deepEqual(await loadListingDraft("seller-a"), draft);
  storage.set("listing-draft:v1:user:corrupt", '{"purchaseMode":"automatic"}');
  await assert.rejects(loadListingDraft("corrupt"));
});
