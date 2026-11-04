const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");

// Проверяем действующий store без запуска React Native и без подмены его логики.
const filename = path.resolve(
  __dirname,
  "../features/profile/store/use-profile-store.ts",
);
const loaded = new Module(filename, module);
loaded.paths = module.paths;
loaded._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  filename,
);
const { useProfileStore } = loaded.exports;

/** Возвращает заполненный адрес для пользовательских сценариев выбора и удаления. */
function address(id) {
  return {
    id,
    type: "home",
    city: "Грозный",
    street: "Тестовая улица, 1",
    isDefault: false,
  };
}

test("Первый адрес становится основным, последующие сохраняют выбор пользователя", () => {
  useProfileStore.setState({ addresses: [] });
  const store = useProfileStore.getState();
  store.addAddress(address("one"));
  store.addAddress(address("two"));
  assert.deepEqual(
    useProfileStore.getState().addresses.map((item) => item.isDefault),
    [true, false],
  );
  store.setDefaultAddress("two");
  store.addAddress(address("three"));
  assert.deepEqual(
    useProfileStore.getState().addresses.map((item) => item.isDefault),
    [false, true, false],
  );
  store.setDefaultAddress("missing");
  assert.equal(
    useProfileStore.getState().addresses.find((item) => item.isDefault).id,
    "two",
  );
});

test("Удаление основного адреса выбирает оставшийся, удаление последнего даёт пустой список", () => {
  useProfileStore.setState({ addresses: [] });
  const store = useProfileStore.getState();
  store.addAddress(address("one"));
  store.addAddress(address("two"));
  store.removeAddress("one");
  assert.deepEqual(useProfileStore.getState().addresses, [
    { ...address("two"), isDefault: true },
  ]);
  store.removeAddress("two");
  assert.deepEqual(useProfileStore.getState().addresses, []);
});

test("Добавление явно основного адреса не оставляет два основных адреса", () => {
  useProfileStore.setState({ addresses: [] });
  const store = useProfileStore.getState();
  store.addAddress(address("one"));
  store.addAddress({ ...address("two"), isDefault: true });
  assert.deepEqual(
    useProfileStore.getState().addresses.map((item) => item.isDefault),
    [false, true],
  );
});
