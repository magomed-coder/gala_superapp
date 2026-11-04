import { useColorScheme, type ColorSchemeName } from "react-native";
import { darkTheme } from "@/shared/theme/dark";
import { lightTheme } from "@/shared/theme/light";
import { useThemeModeStore, type ThemePreference } from "@/shared/store/theme-mode.store";
import type { ThemeMode, ThemeTokens } from "@/shared/theme/types";

export * from "@/shared/theme/tokens";
export * from "@/shared/theme/types";
export { darkTheme, lightTheme };
export type { ThemePreference };

export const themes: Record<ThemeMode, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
};

/**
 * Возвращает объект токенов темы по указанному режиму.
 * @param mode Явный режим темы: light или dark.
 * @returns Набор токенов темы для переданного режима.
 */
export const getThemeByMode = (mode: ThemeMode): ThemeTokens => themes[mode];

/**
 * Определяет итоговый режим темы с учетом системной схемы.
 * @param preference Выбор пользователя: light, dark или system.
 * @param systemScheme Системная цветовая схема устройства.
 * @returns Финальный режим темы, который должен применяться в UI.
 */
export const resolveThemeMode = (
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null,
): ThemeMode => {
  if (preference === "system") {
    return systemScheme === "dark" ? "dark" : "light";
  }

  return preference;
};

/**
 * Возвращает текущее значение режима темы и функцию его изменения.
 * @returns Объект с mode и setMode из theme store.
 */
export const useThemeMode = () => {
  const mode = useThemeModeStore((state) => state.mode);
  const setMode = useThemeModeStore((state) => state.setMode);

  return { mode, setMode };
};

/**
 * Вычисляет актуальную тему приложения на основе user preference и system scheme.
 * @returns Активные токены темы приложения.
 */
export const useAppTheme = (): ThemeTokens => {
  const colorScheme = useColorScheme();
  const themePreference = useThemeModeStore((state) => state.mode);
  const mode = resolveThemeMode(themePreference, colorScheme);
  return getThemeByMode(mode);
};

/**
 * Создает themed-стили через фабрику и возвращает их вместе с текущей темой.
 * @param factory Функция, строящая стили на основе ThemeTokens.
 * @returns Объект с текущей темой и сгенерированными стилями.
 */
export const useThemedStyles = <T>(factory: (theme: ThemeTokens) => T) => {
  const theme = useAppTheme();
  return {
    theme,
    styles: factory(theme),
  };
};
