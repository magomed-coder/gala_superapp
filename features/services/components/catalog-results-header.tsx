import { useAppTheme } from "@/shared/theme";
import { Text, View } from "react-native";

/** Обозначает раздел и число предложений без рекламных блоков над выдачей. */
export function CatalogResultsHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ gap: theme.spacing.xxs }}>
      {/* Счётчик занимает отдельную строку: смена разрядности не сдвигает заголовок. */}
      <Text
        accessibilityRole="header"
        style={{
          color: theme.colors.text.primary,
          fontSize: theme.typography.fontSize.h3,
          lineHeight: theme.typography.lineHeight.h3,
          fontFamily: theme.typography.fontFamily.bold,
        }}
      >
        {title}
      </Text>
      <Text
        accessibilityLiveRegion="polite"
        style={{
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
          fontVariant: ["tabular-nums"],
        }}
      >
        {`Предложений: ${count.toLocaleString("ru-RU")}`}
      </Text>
    </View>
  );
}
