import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { AllinLogo } from "@/shared/components/allin-logo";

interface AllinSplashScreenProps {
  onReady: () => void;
}

export function AllinSplashScreen({ onReady }: AllinSplashScreenProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container} accessibilityViewIsModal>
      <StatusBar style="dark" />
      <AllinLogo width={Math.min(width - 48, 240)} onLoadEnd={onReady} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    zIndex: 9999,
  },
});
