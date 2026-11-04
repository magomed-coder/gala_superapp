import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageResizeMode,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/shared/theme";

const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 18;

export type SwiperProps = {
  data: string[];
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  imageResizeMode?: ImageResizeMode;
  modalEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Swiper({
  data,
  onIndexChange,
  initialIndex = 0,
  imageResizeMode = "contain",
  modalEnabled = true,
  style,
}: SwiperProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(insets.top, insets.bottom),
    [insets.bottom, insets.top],
  );
  const { width, height } = useWindowDimensions();
  const itemWidth = width;
  const modalContentHeight = Math.max(0, height - insets.top - insets.bottom);

  const safeInitialIndex = Math.max(
    0,
    Math.min(initialIndex, Math.max(0, data.length - 1)),
  );

  const scrollX = useSharedValue(safeInitialIndex * itemWidth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(safeInitialIndex);
  const modalScrollRef = useRef<FlatList<string>>(null);

  const handleSelectImage = useCallback(
    (index: number) => {
      setCurrentImageIndex(index);

      if (modalEnabled) {
        setIsModalVisible(true);
      }
    },
    [modalEnabled],
  );

  const handleNextImage = useCallback(() => {
    if (currentImageIndex >= data.length - 1) {
      return;
    }

    const nextIndex = currentImageIndex + 1;
    setCurrentImageIndex(nextIndex);
    modalScrollRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  }, [currentImageIndex, data.length]);

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex <= 0) {
      return;
    }

    const prevIndex = currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    modalScrollRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  }, [currentImageIndex]);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / itemWidth);

      if (onIndexChange) {
        runOnJS(onIndexChange)(index);
      }
    },
  });

  if (data.length === 0) {
    return <View style={[styles.emptyState, style]} />;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.swiperContainer}>
        <Animated.FlatList
          data={data}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={itemWidth}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          initialScrollIndex={safeInitialIndex}
          getItemLayout={(_, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <AnimatedItem
              item={item}
              index={index}
              itemWidth={itemWidth}
              scrollX={scrollX}
              imageResizeMode={imageResizeMode}
              cardBackground={theme.colors.background.secondary}
              onPress={() => handleSelectImage(index)}
            />
          )}
        />

        {data.length > 1 ? (
          <Dots
            count={data.length}
            itemWidth={itemWidth}
            scrollX={scrollX}
            color={theme.colors.text.primary}
          />
        ) : null}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <GestureHandlerRootView style={styles.modalGestureRoot}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Ionicons name="close" size={32} color="#FFF" />
            </Pressable>

            <FlatList
              ref={modalScrollRef}
              data={data}
              keyExtractor={(item, index) => `${item}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              initialScrollIndex={currentImageIndex}
              getItemLayout={(_, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setCurrentImageIndex(index);
              }}
              renderItem={({ item, index }) => (
                <ZoomableFullscreenImage
                  item={item}
                  width={width}
                  height={modalContentHeight}
                  isActive={currentImageIndex === index && isModalVisible}
                />
              )}
            />

            {currentImageIndex > 0 ? (
              <Pressable
                style={[styles.navButton, styles.prevButton]}
                onPress={handlePrevImage}
              >
                <Ionicons name="chevron-back" size={30} color="#FFF" />
              </Pressable>
            ) : null}

            {currentImageIndex < data.length - 1 ? (
              <Pressable
                style={[styles.navButton, styles.nextButton]}
                onPress={handleNextImage}
              >
                <Ionicons name="chevron-forward" size={30} color="#FFF" />
              </Pressable>
            ) : null}

            <View style={styles.imageCounter}>
              <Ionicons name="image" size={16} color="#FFF" />
              <Text style={styles.counterText}>
                {currentImageIndex + 1} / {data.length}
              </Text>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

type ZoomableFullscreenImageProps = {
  item: string;
  width: number;
  height: number;
  isActive: boolean;
};

function ZoomableFullscreenImage({
  item,
  width,
  height,
  isActive,
}: ZoomableFullscreenImageProps) {
  const styles = useMemo(() => createStyles(), []);
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  useEffect(() => {
    if (!isActive) {
      scale.value = 1;
      focalX.value = 0;
      focalY.value = 0;
    }
  }, [focalX, focalY, isActive, scale]);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onUpdate((event) => {
          scale.value = event.scale;
          focalX.value = event.focalX;
          focalY.value = event.focalY;
        })
        .onEnd(() => {
          scale.value = withTiming(1);
          focalX.value = withTiming(0);
          focalY.value = withTiming(0);
        }),
    [focalX, focalY, scale],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: focalX.value },
      { translateY: focalY.value },
      { translateX: -width / 2 },
      { translateY: -height / 2 },
      { scale: scale.value },
      { translateX: -focalX.value },
      { translateY: -focalY.value },
      { translateX: width / 2 },
      { translateY: height / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View
        style={[styles.fullscreenImageContainer, { width, height }]}
      >
        <Animated.Image
          source={{ uri: item }}
          style={[styles.fullscreenImage, { width }, animatedStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

type AnimatedItemProps = {
  item: string;
  index: number;
  itemWidth: number;
  scrollX: SharedValue<number>;
  imageResizeMode: ImageResizeMode;
  cardBackground: string;
  onPress: () => void;
};

function AnimatedItem({
  item,
  index,
  itemWidth,
  scrollX,
  imageResizeMode,
  cardBackground,
  onPress,
}: AnimatedItemProps) {
  const styles = useMemo(() => createStyles(), []);

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.99, 1, 0.99],
      "clamp",
    );

    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.item, { width: itemWidth }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        style={[styles.innerItem, { backgroundColor: cardBackground }]}
      >
        <Image
          source={{ uri: item }}
          style={styles.image}
          resizeMode={imageResizeMode}
        />
      </Pressable>
    </Animated.View>
  );
}

type DotsProps = {
  count: number;
  itemWidth: number;
  scrollX: SharedValue<number>;
  color: string;
};

function Dots({ count, itemWidth, scrollX, color }: DotsProps) {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          key={index}
          index={index}
          itemWidth={itemWidth}
          scrollX={scrollX}
          color={color}
        />
      ))}
    </View>
  );
}

type DotProps = {
  index: number;
  itemWidth: number;
  scrollX: SharedValue<number>;
  color: string;
};

function Dot({ index, itemWidth, scrollX, color }: DotProps) {
  const styles = useMemo(() => createStyles(), []);

  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [(index - 1) * itemWidth, index * itemWidth, (index + 1) * itemWidth],
      [DOT_SIZE, ACTIVE_DOT_WIDTH, DOT_SIZE],
      "clamp",
    );

    return { width };
  });

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color }, animatedStyle]}
    />
  );
}

const createStyles = (topInset = 0, bottomInset = 0) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    emptyState: {
      width: "100%",
      minHeight: 1,
    },
    swiperContainer: {
      alignItems: "center",
    },
    item: {
      justifyContent: "center",
      alignItems: "center",
    },
    innerItem: {
      width: "100%",
      height: "100%",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 8,
      left: 0,
      right: 0,
    },
    dot: {
      height: DOT_SIZE,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      paddingTop: topInset,
      paddingBottom: bottomInset,
      justifyContent: "center",
      alignItems: "center",
    },
    modalGestureRoot: {
      flex: 1,
    },
    fullscreenImage: {
      height: "100%",
    },
    fullscreenImageContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: {
      position: "absolute",
      top: topInset + 12,
      right: 20,
      zIndex: 10,
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 22,
    },
    navButton: {
      position: "absolute",
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: 22,
      zIndex: 5,
    },
    prevButton: {
      left: 20,
      paddingRight: 2,
    },
    nextButton: {
      right: 20,
      paddingLeft: 2,
    },
    imageCounter: {
      position: "absolute",
      bottom: bottomInset + 12,
      width: 120,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      paddingVertical: 10,
      paddingHorizontal: 16,
      paddingRight: 20,
      borderRadius: 20,
      alignSelf: "center",
    },
    counterText: {
      color: "#FFF",
      fontSize: 14,
      fontWeight: "600",
    },
  });

export default Swiper;
