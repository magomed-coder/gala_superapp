import { Dimensions, Platform } from "react-native";
// import ReactNativeBlobUtil from "react-native-blob-util";
// export const DIRS = ReactNativeBlobUtil.fs.dirs;

export const IS_IOS = Platform.OS === "ios";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("screen");

export const SMALL_VIEWPORT = SCREEN_WIDTH <= 360;

export const MAX_HEIGHT_BOTTOM_SHEET = SCREEN_HEIGHT * 0.85;

export const TIMEOUT_ON_API_REQUEST: number = 300000;

export const PADDING_HORIZONTAL = 16;

export const SAFETY_ZONE: number = 16;

export const SAFETY_ZONE_ON_BOTH_SLIDES: number = SAFETY_ZONE * 2;

export const SAFETY_SCREEN: number = SCREEN_WIDTH - SAFETY_ZONE_ON_BOTH_SLIDES;

export function keyExtractor<T extends any>(data: T, index: number): string {
  return String(index);
}
