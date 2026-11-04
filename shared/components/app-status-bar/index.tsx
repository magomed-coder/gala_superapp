import { StatusBar } from "react-native";
import { useThemeMode } from "@/shared/theme";

export function AppStatusBar() {
  const { mode: themeMode } = useThemeMode();

  const barStyle =
    themeMode === "light"
      ? "dark-content"
      : themeMode === "dark"
        ? "light-content"
        : "default";

  return <StatusBar barStyle={barStyle} animated />;
}
