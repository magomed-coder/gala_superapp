import { safeStateStorage } from "@/shared/lib/storage/safe-state-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeMode } from "@/shared/theme/types";

export type ThemePreference = ThemeMode | "system";

type ThemeModeState = {
  mode: ThemePreference;
  setMode: (mode: ThemePreference) => void;
};

export const useThemeModeStore = create<ThemeModeState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "app-theme-preference",
      storage: createJSONStorage(() => safeStateStorage),
    },
  ),
);
