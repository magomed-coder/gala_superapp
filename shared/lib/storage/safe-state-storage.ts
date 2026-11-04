import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";

const memoryFallback = new Map<string, string>();

export const safeStateStorage: StateStorage = {
  getItem: async (name) => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value != null) return value;
    } catch {
      // Fall back to in-memory storage when native module is unavailable.
    }

    return memoryFallback.get(name) ?? null;
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
      return;
    } catch {
      memoryFallback.set(name, value);
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // noop
    }
    memoryFallback.delete(name);
  },
};
