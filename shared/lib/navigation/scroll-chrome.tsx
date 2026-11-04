import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AccessibilityInfo } from "react-native";
import {
  useReducedMotion,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";

type ScrollChrome = {
  hiddenProgress: SharedValue<number>;
  keepVisible: boolean;
};

const ScrollChromeContext = createContext<ScrollChrome | null>(null);

/** Хранит прогресс панелей на время жизни навигатора, без состояния предметных областей. */
export function ScrollChromeProvider({ children }: { children: ReactNode }) {
  const hiddenProgress = useSharedValue(0);
  const reducedMotion = useReducedMotion();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const keepVisible = reducedMotion || screenReaderEnabled;

  useEffect(() => {
    // В react-native-web этот API всегда возвращает true и не определяет наличие диктора.
    if (process.env.EXPO_OS === "web") return;

    let active = true;
    void AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (active) setScreenReaderEnabled(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setScreenReaderEnabled,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (keepVisible) hiddenProgress.set(0);
  }, [hiddenProgress, keepVisible]);

  const value = useMemo(
    () => ({ hiddenProgress, keepVisible }),
    [hiddenProgress, keepVisible],
  );

  return (
    <ScrollChromeContext.Provider value={value}>
      {children}
    </ScrollChromeContext.Provider>
  );
}

/** Предоставляет единый прогресс верхней панели и навбара внутри навигатора вкладок. */
export function useScrollChrome() {
  const context = use(ScrollChromeContext);
  if (!context) {
    throw new Error("useScrollChrome requires ScrollChromeProvider");
  }
  return context;
}
