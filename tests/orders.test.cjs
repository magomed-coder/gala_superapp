const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");

// Загружаем демоданные без React Native; изображения не участвуют в проверке заказов.
const filename = path.resolve(__dirname, "../shared/mocks/mock-data.ts");
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const loaded = new Module(filename, module);
loaded.require = (request) =>
  /\.(png|jpg|jpeg)$/.test(request) ? request : require(request);
loaded._compile(compiled, filename);
const { orders, fetchMockData } = loaded.exports;

test("Каждый заказ имеет уникальный ID; исходные ord4 и ord5 сохранены", () => {
  assert.equal(orders.length, 8);
  assert.equal(new Set(orders.map((order) => order.id)).size, orders.length);
  assert.equal(
    orders.find((order) => order.id === "ord4").providerName,
    "Отель Престиж",
  );
  assert.equal(
    orders.find((order) => order.id === "ord5").status,
    "in_progress",
  );
});

test("Повторная загрузка не добавляет дубликаты; дополнительные заказы доступны деталям", async () => {
  const [first, refreshed] = await Promise.all([
    fetchMockData("orders"),
    fetchMockData("orders"),
  ]);
  assert.deepEqual(first, orders);
  assert.deepEqual(refreshed, first);
  for (const id of ["ord6", "ord7", "ord8"]) {
    assert.equal(refreshed.filter((order) => order.id === id).length, 1);
  }
});
