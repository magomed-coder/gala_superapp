import "react-native-url-polyfill/auto";

import {
  createClient,
  processLock,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { supabaseAuthStorage } from "@/shared/lib/storage/supabase-auth-storage";
import type { Database } from "@/shared/api/supabase/database.types";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || "";
const SUPABASE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_KEY?.trim() || "";
let client: SupabaseClient<Database> | undefined;

/** Проверяет наличие публичных настроек, не создавая клиент при загрузке маршрутов. */
export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_PUBLISHABLE_KEY;
}

/** Возвращает единственный клиент; ошибку конфигурации обрабатывает сценарий, а не загрузчик Expo Router. */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!SUPABASE_URL) {
    throw new Error(
      "Не задана EXPO_PUBLIC_SUPABASE_URL. Перезапустите Expo после настройки .env.local.",
    );
  }
  if (!SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Не задана EXPO_PUBLIC_SUPABASE_KEY. Перезапустите Expo после настройки .env.local.",
    );
  }

  client ??= createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: supabaseAuthStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  });
  return client;
}
