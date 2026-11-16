const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");

// Геометрия жестов проверяется без запуска native-модулей и UI-потока.
const filename = path.resolve(
  __dirname,
  "../shared/components/swiper/utils.ts",
);
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const loaded = new Module(filename, module);
loaded._compile(compiled, filename);
const { clampSwiperIndex, getPinchTranslation } = loaded.exports;

test("Пустая галерея, неверный initialIndex и выход за края дают безопасный индекс", () => {
  assert.equal(clampSwiperIndex(4, 0), 0);
  assert.equal(clampSwiperIndex(-1, 3), 0);
  assert.equal(clampSwiperIndex(10, 3), 2);
  assert.equal(clampSwiperIndex(1.7, 3), 1);
  assert.equal(clampSwiperIndex(1, 3), 1);

  for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.equal(clampSwiperIndex(invalid, 3), 0);
  }
});

test("Pinch сохраняет выбранную точку изображения под пальцами в обеих ориентациях", () => {
  for (const size of [320, 390, 844]) {
    for (const scale of [1.5, 2, 4]) {
      for (const focal of [size / 4, size / 2, (size * 3) / 4]) {
        const translation = getPinchTranslation(focal, focal, size, scale);
        const transformedPoint =
          size / 2 + (focal - size / 2) * scale + translation;
        assert.ok(Math.abs(transformedPoint - focal) < 0.001);
      }
    }
  }
});

test("Движение двух пальцев переносит увеличенное фото без скачка якоря", () => {
  const translation = getPinchTranslation(100, 120, 400, 2);
  const transformedPoint = 200 + (100 - 200) * 2 + translation;
  assert.equal(transformedPoint, 120);
});

test("Pinch не выводит границы увеличенной области в viewport и не смещает исходный масштаб", () => {
  assert.equal(getPinchTranslation(100, 1000, 400, 2), 200);
  assert.equal(getPinchTranslation(300, -1000, 400, 2), -200);
  assert.equal(getPinchTranslation(100, 120, 400, 1), 0);
});
