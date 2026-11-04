import { useEffect, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/shared/theme";

type AvatarProps = {
  uri?: string;
  name?: string;
  size?: number;
  borderRadius?: number;
  source?: ImageSourcePropType;
  fallbackSource?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  initialsStyle?: StyleProp<TextStyle>;
};

function getInitials(name?: string) {
  if (!name?.trim()) {
    return "?";
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials.slice(0, 2) || "?";
}

export function Avatar({
  uri,
  name,
  size = 48,
  borderRadius,
  source,
  fallbackSource,
  style,
  imageStyle,
  initialsStyle,
}: AvatarProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri, source, fallbackSource]);

  const containerSize = {
    width: size,
    height: size,
    borderRadius: borderRadius ?? size / 2,
  };

  const textSize = Math.max(Math.round(size * 0.38), 12);
  const resolvedSource = source ?? (uri ? { uri } : undefined);

  if (resolvedSource && !hasError) {
    return (
      <View
        style={[
          styles.container,
          {
            borderColor: theme.colors.border.default,
          },
          containerSize,
          style,
        ]}
      >
        <Image
          source={resolvedSource}
          style={[styles.image, containerSize, imageStyle]}
          onError={() => setHasError(true)}
        />
      </View>
    );
  }

  if (hasError && fallbackSource) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background.secondary,
            borderColor: theme.colors.border.default,
          },
          containerSize,
          style,
        ]}
      >
        <Image
          source={fallbackSource}
          style={[styles.image, containerSize, imageStyle]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.placeholder,
        {
          backgroundColor: theme.colors.brand.primary,
        },
        containerSize,
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            color: theme.colors.brand.onPrimary,
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: textSize,
          },
          initialsStyle,
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    container: {
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholder: {
      alignItems: "center",
      justifyContent: "center",
    },
    initials: {
      textAlign: "center",
    },
  });
