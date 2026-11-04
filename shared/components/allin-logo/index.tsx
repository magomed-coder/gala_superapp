import { Image, type ImageProps, type ImageStyle, type StyleProp } from "react-native";

const WORDMARK = require("@/assets/brand/allin-wordmark.png");
const CROPPED_WORDMARK = require("@/assets/brand/allin-wordmark-cropped.png");

interface AllinLogoProps {
  width?: number;
  style?: StyleProp<ImageStyle>;
  cropped?: boolean;
  onLoadEnd?: ImageProps["onLoadEnd"];
}

export function AllinLogo({ width = 144, style, cropped = false, onLoadEnd }: AllinLogoProps) {
  const aspectRatio = cropped ? 1532 / 428 : 3;

  return (
    <Image
      source={cropped ? CROPPED_WORDMARK : WORDMARK}
      accessibilityLabel="allin"
      accessibilityRole="image"
      resizeMode="contain"
      onLoadEnd={onLoadEnd}
      style={[{ width, height: width / aspectRatio }, style]}
    />
  );
}
