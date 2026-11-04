import { Button } from "@/shared/components/themed-button";
import { useAppTheme, type ThemeTokens } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type ScreenHeaderProps = {
  title?: string;
  withBackButton?: boolean;
  headerRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  title,
  withBackButton = false,
  headerRight,
  style,
}: ScreenHeaderProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.headerRow, style]}>
      <View style={styles.headerLeft}>
        {withBackButton ? (
          <Button
            onPress={() => router.back()}
            variant="ghost"
            style={styles.backButton}
            leftIcon={
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.text.primary}
              />
            }
          />
        ) : null}

        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      {headerRight ? (
        <View style={styles.headerRight}>{headerRight}</View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexShrink: 1,
    },
    headerRight: {
      flexShrink: 0,
    },
    backButton: {
      ...theme.components.headerButton,
    },
    title: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.bodyLg,
      lineHeight: theme.typography.lineHeight.bodyLg,
      color: theme.colors.text.primary,
    },
  });
