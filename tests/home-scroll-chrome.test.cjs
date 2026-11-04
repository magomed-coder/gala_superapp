const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");

const filename = path.resolve(
  __dirname,
  "../features/home/utils/scroll-chrome-progress.ts",
);
const loaded = new Module(filename, module);
loaded._compile(
  ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  filename,
);
const { getScrollChromeProgress: scroll } = loaded.exports;

test("Панели скрываются вниз и сразу возвращаются при развороте в середине списка", () => {
  assert.equal(scroll(136, 100, 3000, 0, 72).progress, 0.5);
  assert.equal(scroll(600, 136, 3000, 0.5, 72).progress, 1);
  assert.equal(scroll(582, 600, 3000, 1, 72).progress, 0.75);
  assert.equal(scroll(510, 582, 3000, 0.75, 72).progress, 0);
});

test("Отскок нижнего края не возвращает скрытые панели", () => {
  let state = { offset: 990, progress: 1 };
  for (const offset of [1000, 1030, 1060, 1030, 1000]) {
    state = scroll(offset, state.offset, 1000, state.progress, 72);
    assert.equal(state.progress, 1);
  }
  assert.ok(scroll(980, state.offset, 1000, state.progress, 72).progress < 1);
});

test("В начале и при верхнем отскоке панели полностью видимы", () => {
  let state = { offset: 50, progress: 0.5 };
  for (const offset of [0, -20, -60, -15, 0]) {
    state = scroll(offset, state.offset, 1000, state.progress, 72);
    assert.deepEqual(state, { offset: 0, progress: 0 });
  }
});

test("Короткий список и ещё не измеренная панель не скрывают навигацию", () => {
  assert.equal(scroll(100, 0, 0, 1, 72).progress, 0);
  assert.equal(scroll(100, 0, 1000, 1, 0).progress, 0);
});

test("Большой шрифт меняет расстояние скрытия, но не направление и границы", () => {
  assert.equal(scroll(160, 100, 1000, 0, 120).progress, 0.5);
  assert.equal(scroll(900, 100, 1000, 0, 120).progress, 1);
  assert.equal(scroll(100, 900, 1000, 1, 120).progress, 0);
});
