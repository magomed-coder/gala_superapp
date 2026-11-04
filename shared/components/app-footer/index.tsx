import { AllinLogo } from "@/shared/components/allin-logo";
import { useAppTheme } from "@/shared/theme";
import { View, type StyleProp, type ViewStyle } from "react-native";

/** Компактный логотип; дополнительные отступы задаёт конкретный экран через style. */
export function AppFooter({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <AllinLogo
        cropped
        width={44}
        style={{ tintColor: theme.colors.text.tertiary }}
      />
    </View>
  );
}
