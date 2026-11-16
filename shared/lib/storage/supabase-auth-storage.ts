import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/** Хранит сессию в Keychain/Keystore на устройстве и в localStorage браузера; SSR не обращается к window. */
export const supabaseAuthStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web")
      return typeof window === "undefined"
        ? null
        : window.localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined")
        window.localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
