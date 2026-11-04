import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  type ImageResizeMode,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme, type ThemeTokens } from "@/shared/theme";

const CAROUSEL_SIDE_INSET = 6;
const CAROUSEL_ITEM_GAP = 10;
const CAROUSEL_ITEM_WIDTH_RATIO = 0.7;

export type BusinessImageSwiperProps = {
  imageUrls: string[];
  style?: StyleProp<ViewStyle>;
  initialIndex?: number;
  imageResizeMode?: ImageResizeMode;
  onIndexChange?: (index: number) => void;
};

export function BusinessImageSwiper({
  imageUrls,
  style,
  initialIndex = 0,
  imageResizeMode = "contain",
  onIndexChange,
}: BusinessImageSwiperProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeIndex, setActiveIndex] = useState(() => {
    return Math.max(
      0,
      Math.min(initialIndex, Math.max(0, imageUrls.length - 1)),
    );
  });
  const [carouselWidth, setCarouselWidth] = useState(0);

  if (imageUrls.length === 0) {
    return null;
  }

  const imageWidth = Math.round(carouselWidth * CAROUSEL_ITEM_WIDTH_RATIO);
  const imageHeight = imageWidth > 0 ? (imageWidth * 3) / 4 : 180;
  const isSingleImage = imageUrls.length === 1;
  const slideWidth = isSingleImage
    ? Math.max(0, carouselWidth - 2 * CAROUSEL_SIDE_INSET)
    : imageWidth;
  const snapToInterval = imageWidth + CAROUSEL_ITEM_GAP || 1;

  const handleCarouselLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);

    if (nextWidth > 0 && nextWidth !== carouselWidth) {
      setCarouselWidth(nextWidth);
    }
  };

  const handleCarouselScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (!carouselWidth) {
      return;
    }

    const rawIndex = event.nativeEvent.contentOffset.x / snapToInterval;
    const nextIndex = Math.round(rawIndex);
    const boundedIndex = Math.max(0, Math.min(nextIndex, imageUrls.length - 1));

    if (boundedIndex !== activeIndex) {
      setActiveIndex(boundedIndex);
      onIndexChange?.(boundedIndex);
    }
  };

  return (
    <View style={[styles.carouselBlock, style]} onLayout={handleCarouselLayout}>
      <FlatList
        horizontal
        data={imageUrls}
        keyExtractor={(imageUrl, index) => `${imageUrl}-${index}`}
        scrollEnabled={imageUrls.length > 1}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={snapToInterval}
        snapToAlignment="start"
        decelerationRate="fast"
        bounces={false}
        nestedScrollEnabled
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() =>
          isSingleImage ? null : <View style={styles.carouselSeparator} />
        }
        onScroll={handleCarouselScroll}
        scrollEventThrottle={16}
        initialScrollIndex={Math.max(
          0,
          Math.min(initialIndex, Math.max(0, imageUrls.length - 1)),
        )}
        getItemLayout={(_, index) => ({
          length: snapToInterval,
          offset: snapToInterval * index,
          index,
        })}
        renderItem={({ item: imageUrl }) => (
          <View
            style={[
              styles.imageSlide,
              {
                width: slideWidth,
                height: imageHeight,
              },
            ]}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode={imageResizeMode}
            />
          </View>
        )}
      />

      {imageUrls.length > 1 ? (
        <View style={styles.paginationContainer}>
          {imageUrls.map((_, index) => (
            <View
              key={`business-swiper-dot-${index}`}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    carouselBlock: {
      width: "100%",
      position: "relative",
      overflow: "hidden",
    },
    carouselContent: {
      paddingHorizontal: CAROUSEL_SIDE_INSET,
    },
    carouselSeparator: {
      width: CAROUSEL_ITEM_GAP,
    },
    imageSlide: {
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.radius.xs,
    },
    paginationContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 8,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
    },
    paginationDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      opacity: 0.45,
      backgroundColor: theme.colors.text.primary,
    },
    paginationDotActive: {
      width: 16,
      opacity: 1,
    },
  });

export default BusinessImageSwiper;
