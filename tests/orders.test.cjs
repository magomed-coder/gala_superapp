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

const presentationFile = path.resolve(
  __dirname,
  "../features/orders/utils/order-presentation.ts",
);
const presentation = new Module(presentationFile, module);
presentation._compile(
  ts.transpileModule(fs.readFileSync(presentationFile, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  presentationFile,
);
const { filterOrders, getOrderStatus, formatOrderDate, formatOrderAmount } =
  presentation.exports;

test("Активный фильтр объединяет ожидающие и выполняемые заказы всех типов", () => {
  const before = orders.map((order) => order.id);
  assert.deepEqual(
    filterOrders(orders, "active").map((order) => order.id),
    ["ord5", "ord3", "ord2", "ord6", "ord8"],
  );
  assert.equal(filterOrders(orders, "completed").length, 3);
  assert.equal(filterOrders(orders, "cancelled").length, 0);
  assert.deepEqual(
    orders.map((order) => order.id),
    before,
  );
  assert.deepEqual(filterOrders([], "all"), []);
});

test("Все заказы показывают активные первыми, отменённый заказ попадает только в свой фильтр", () => {
  const cancelled = {
    ...orders[0],
    id: "cancelled",
    status: "cancelled",
    createdAt: "2026-11-04T12:00:00Z",
  };
  const source = [...orders, cancelled];
  assert.equal(filterOrders(source, "all")[0].id, "ord5");
  assert.equal(filterOrders(source, "all")[5].id, "cancelled");
  assert.deepEqual(filterOrders(source, "cancelled"), [cancelled]);
  assert.ok(!filterOrders(source, "active").includes(cancelled));
});

test("Статусы различают услугу, доставку и бронирование, отмена не выглядит выполнением", () => {
  const base = { ...orders[0], status: "in_progress" };
  assert.equal(getOrderStatus({ ...base, type: "service" }).label, "В работе");
  assert.equal(getOrderStatus({ ...base, type: "delivery" }).label, "В пути");
  assert.equal(
    getOrderStatus({ ...base, type: "booking" }).label,
    "Бронь подтверждена",
  );
  assert.equal(
    getOrderStatus({ ...base, status: "cancelled" }).label,
    "Отменён",
  );
  assert.equal(formatOrderDate("invalid"), "Дата не указана");
  assert.match(formatOrderAmount(1234.5), /1\s234,5 ₽/);
});

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
