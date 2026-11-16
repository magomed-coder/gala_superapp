const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const babel = require("@babel/core");
const ts = require("typescript");
const { createClient } = require("@supabase/supabase-js");

const root = path.resolve(__dirname, "..");
const originalURL = globalThis.URL;
const originalSearchParams = globalThis.URLSearchParams;
const configKeys = ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_KEY"];

/** Загружает прикладной TypeScript и реальные URL-реализации; подменяет только нативные модули и хранилище. */
function createLoader(platform = "android") {
  const cache = new Map();
  const storage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  };
  function load(filename) {
    filename = require.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    if (filename.endsWith(".json")) return require(filename);
    const loaded = new Module(filename, module);
    loaded.paths = Module._nodeModulePaths(path.dirname(filename));
    cache.set(filename, loaded);
    const nativeRequire = loaded.require.bind(loaded);
    loaded.require = (id) => {
      if (id === "react-native")
        return { Platform: { OS: platform, Version: 35 }, NativeModules: {} };
      if (id === "./NativeBlobModule") return null;
      if (id === "@/shared/lib/storage/supabase-auth-storage")
        return { supabaseAuthStorage: storage };
      if (id === "@/features/auth/api/supabase-auth.api") return {};
      if (id.startsWith("@/"))
        return load(path.join(root, id.slice(2) + ".ts"));
      if (id.startsWith("react-native-url-polyfill") || id.startsWith(".")) {
        return load(require.resolve(id, { paths: [path.dirname(filename)] }));
      }
      return nativeRequire(id);
    };
    const source = fs.readFileSync(filename, "utf8");
    const code = filename.endsWith(".ts")
      ? ts.transpileModule(source, {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText
      : babel.transformSync(source, {
          configFile: false,
          babelrc: false,
          plugins: [
            "@babel/plugin-transform-flow-strip-types",
            "@babel/plugin-transform-modules-commonjs",
          ],
        }).code;
    loaded._compile(code, filename);
    return loaded.exports;
  }
  return load;
}

/** Изолирует настройки и глобальные URL между проверками, не используя реальные ключи и сетевые запросы. */
async function withConfiguration(values, run) {
  const saved = Object.fromEntries(
    configKeys.map((key) => [key, process.env[key]]),
  );
  for (const key of configKeys) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    await run();
  } finally {
    for (const key of configKeys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    globalThis.URL = originalURL;
    globalThis.URLSearchParams = originalSearchParams;
  }
}

for (const missing of configKeys) {
  test(`Нет ${missing}: импорт маршрутов безопасен, восстановление сессии завершается управляемой ошибкой`, () =>
    withConfiguration(
      {
        EXPO_PUBLIC_SUPABASE_URL:
          missing === configKeys[0] ? " " : "https://startup-check.supabase.co",
        EXPO_PUBLIC_SUPABASE_KEY:
          missing === configKeys[1] ? " " : "sb_publishable_startup_test",
      },
      async () => {
        const load = createLoader();
        const client = load(path.join(root, "shared/api/supabase/supabase.ts"));
        assert.equal(client.isSupabaseConfigured(), false);
        assert.throws(() => client.getSupabaseClient(), new RegExp(missing));
        const { useAuthStore } = load(
          path.join(root, "features/auth/store/use-auth-store.ts"),
        );
        await assert.doesNotReject(useAuthStore.getState().initialize());
        assert.equal(useAuthStore.getState().isInitializing, false);
        assert.equal(useAuthStore.getState().initializationError, true);
        assert.equal(useAuthStore.getState().user, null);
      },
    ));
}

test("Native URL: SDK воспроизводит ошибку protocol без полифилла и создаёт единственный клиент с ним", () =>
  withConfiguration(
    {
      EXPO_PUBLIC_SUPABASE_URL: "https://startup-check.supabase.co",
      EXPO_PUBLIC_SUPABASE_KEY: "sb_publishable_startup_test",
    },
    async () => {
      const load = createLoader();
      const native = load(
        require.resolve("react-native/Libraries/Blob/URL.js"),
      );
      globalThis.URL = native.URL;
      globalThis.URLSearchParams = native.URLSearchParams;
      assert.throws(
        () =>
          createClient(
            process.env.EXPO_PUBLIC_SUPABASE_URL,
            process.env.EXPO_PUBLIC_SUPABASE_KEY,
            { auth: { persistSession: false, autoRefreshToken: false } },
          ),
        /protocol/,
      );
      const { getSupabaseClient } = load(
        path.join(root, "shared/api/supabase/supabase.ts"),
      );
      const client = getSupabaseClient();
      assert.equal(client, getSupabaseClient());
      assert.equal(client.realtimeUrl.protocol, "wss:");
      assert.equal((await client.auth.getSession()).data.session, null);
      const { useAuthStore } = load(
        path.join(root, "features/auth/store/use-auth-store.ts"),
      );
      await useAuthStore.getState().initialize();
      assert.equal(useAuthStore.getState().initializationError, false);
      assert.equal(useAuthStore.getState().isInitializing, false);
    },
  ));

test("Web: загрузка клиента сохраняет браузерную URL-реализацию", () =>
  withConfiguration(
    {
      EXPO_PUBLIC_SUPABASE_URL: "https://startup-check.supabase.co",
      EXPO_PUBLIC_SUPABASE_KEY: "sb_publishable_startup_test",
    },
    async () => {
      const load = createLoader("web");
      const { getSupabaseClient } = load(
        path.join(root, "shared/api/supabase/supabase.ts"),
      );
      assert.equal(globalThis.URL, originalURL);
      assert.equal(
        (await getSupabaseClient().auth.getSession()).data.session,
        null,
      );
    },
  ));
