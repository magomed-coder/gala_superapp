import { IconButton } from "@/shared/components/icon-button";
import {
  clampSwiperIndex,
  getPinchTranslation,
} from "@/shared/components/swiper/utils";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, type ImageProps } from "expo-image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageResizeMode,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  useNativeGesture,
  usePinchGesture,
  type NativeGesture,
} from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SwiperSource = ImageProps["source"];

export type SwiperProps = {
  data: readonly SwiperSource[];
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  imageResizeMode?: ImageResizeMode;
  modalEnabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Галерея на всю ширину окна с квадратной областью и contain по умолчанию; style может менять размеры. */
export function Swiper(props: SwiperProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[{ width, aspectRatio: 1 }, props.style]}>
      {/* Новый набор изображений начинает отдельный просмотр; обычный ререндер не сбрасывает позицию. */}
      <SwiperGallery
        key={JSON.stringify([props.data, props.initialIndex ?? 0])}
        {...props}
      />
    </View>
  );
}

/** Владеет общим индексом превью и модального просмотра, не создавая состояния в экране товара. */
function SwiperGallery({
  data,
  initialIndex = 0,
  imageResizeMode = "contain",
  modalEnabled = true,
  accessibilityLabel = "Фотография",
  onIndexChange,
}: SwiperProps) {
  const theme = useAppTheme();
  const [index, setIndex] = useState(() =>
    clampSwiperIndex(initialIndex, data.length),
  );
  const indexRef = useRef(index);
  const [modalVisible, setModalVisible] = useState(false);
  const inlineRef = useRef<FlatList<SwiperSource>>(null);
  const fullscreenRef = useRef<FlatList<SwiperSource>>(null);

  /** Фиксирует только смену страницы, чтобы жест и программная прокрутка не дублировали callback. */
  const selectIndex = useCallback(
    (nextIndex: number) => {
      const next = clampSwiperIndex(nextIndex, data.length);
      if (next === indexRef.current) return;

      indexRef.current = next;
      setIndex(next);
      onIndexChange?.(next);
    },
    [data.length, onIndexChange],
  );

  /** Возвращает превью к фотографии, выбранной в полном просмотре. */
  const closeModal = useCallback(() => {
    inlineRef.current?.scrollToIndex({
      index: indexRef.current,
      animated: false,
    });
    setModalVisible(false);
  }, []);

  /** Стрелки и действия диктора меняют страницу без промежуточных индексов и гонок быстрых нажатий. */
  const movePage = useCallback(
    (step: number, fullscreen: boolean) => {
      const next = clampSwiperIndex(indexRef.current + step, data.length);
      const list = fullscreen ? fullscreenRef : inlineRef;
      list.current?.scrollToIndex({ index: next, animated: false });
      selectIndex(next);
    },
    [data.length, selectIndex],
  );

  if (data.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background.secondary,
        }}
      >
        {/* Пустой набор сохраняет квадратную область и не предлагает открыть пустую модаль. */}
        <Text style={{ color: theme.colors.text.secondary }}>
          Нет изображений
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}
    >
      {/* Пейджер виртуализирован; высота не зависит от загрузки фото или появления индикаторов. */}
      <ImagePager
        data={data}
        index={index}
        listRef={inlineRef}
        imageResizeMode={imageResizeMode}
        label={accessibilityLabel}
        onIndexChange={(next) => {
          if (!modalVisible) selectIndex(next);
        }}
        onOpen={modalEnabled ? () => setModalVisible(true) : undefined}
        onMove={(step) => movePage(step, false)}
      />
      {/* Слоты точек постоянного размера: активная отметка не сдвигает соседние. */}
      {data.length > 1 && data.length <= 7 ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: theme.spacing.sm,
            alignSelf: "center",
            flexDirection: "row",
            gap: theme.spacing.xxs,
          }}
        >
          {data.map((_, dotIndex) => (
            <View
              key={dotIndex}
              style={{
                width: theme.spacing.xs,
                height: theme.spacing.xs,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.text.primary,
                opacity: dotIndex === index ? 1 : theme.opacity.disabled,
              }}
            />
          ))}
        </View>
      ) : null}
      {/* Запас под максимальное число цифр сохраняет ширину счётчика; точки находятся ниже отдельно. */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom:
            data.length > 1 && data.length <= 7
              ? theme.spacing.xl
              : theme.spacing.sm,
          right: theme.spacing.md,
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.xs,
          borderRadius: theme.radius.full,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          backgroundColor: theme.colors.background.primary,
        }}
      >
        <Text
          style={{
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.sm,
            fontVariant: ["tabular-nums"],
            minWidth:
              (String(data.length).length * 2 + 3) *
              theme.typography.fontSize.sm,
            textAlign: "center",
          }}
        >
          {index + 1} / {data.length}
        </Text>
        {modalEnabled ? (
          <Ionicons
            name="expand-outline"
            size={theme.components.icon.xs}
            color={theme.colors.text.primary}
          />
        ) : null}
      </View>

      {/* Просмотр монтируется только при открытии; закрытая галерея не загружает второй набор фото. */}
      {modalVisible && modalEnabled ? (
        <FullscreenViewer
          data={data}
          index={index}
          label={accessibilityLabel}
          listRef={fullscreenRef}
          onIndexChange={selectIndex}
          onMove={(step) => movePage(step, true)}
          onClose={closeModal}
        />
      ) : null}
    </View>
  );
}

type ImagePagerProps = {
  data: readonly SwiperSource[];
  index: number;
  listRef: RefObject<FlatList<SwiperSource> | null>;
  label: string;
  imageResizeMode?: ImageResizeMode;
  fullscreen?: boolean;
  onIndexChange: (index: number) => void;
  onOpen?: () => void;
  onMove: (step: number) => void;
};

/** Измеряет фактический viewport; при повороте перемонтирует список на текущей странице с новым шагом. */
function ImagePager({
  data,
  index,
  listRef,
  label,
  imageResizeMode = "contain",
  fullscreen = false,
  onIndexChange,
  onOpen,
  onMove,
}: ImagePagerProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nativeGesture = useNativeGesture({});

  /** События конца прокрутки учитывают также медленное отпускание без инерции. */
  const finishScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    if (layoutMeasurement.width <= 0) return;
    onIndexChange(
      clampSwiperIndex(
        Math.round(contentOffset.x / layoutMeasurement.width),
        data.length,
      ),
    );
  };

  return (
    <View
      style={{ flex: 1 }}
      onLayout={({ nativeEvent: { layout } }) => {
        setSize((previous) =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        );
      }}
    >
      {/* Размер известен до создания списка, поэтому initialScrollIndex и getItemLayout используют один шаг. */}
      {size.width > 0 && size.height > 0 ? (
        <GestureDetector gesture={nativeGesture}>
          <FlatList
            key={`${size.width}:${size.height}`}
            ref={listRef}
            data={data}
            extraData={index}
            horizontal
            pagingEnabled
            directionalLockEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={data.length > 1}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            initialScrollIndex={index}
            initialNumToRender={1}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews={false}
            keyExtractor={(_, itemIndex) => String(itemIndex)}
            getItemLayout={(_, itemIndex) => ({
              length: size.width,
              offset: size.width * itemIndex,
              index: itemIndex,
            })}
            onMomentumScrollEnd={finishScroll}
            onScrollEndDrag={(event) => {
              const offset = event.nativeEvent.contentOffset.x;
              if (
                Math.abs(
                  offset - Math.round(offset / size.width) * size.width,
                ) < 1
              )
                finishScroll(event);
            }}
            renderItem={({ item, index: itemIndex }) => (
              <View
                style={{
                  width: size.width,
                  height: size.height,
                  overflow: "hidden",
                }}
                accessibilityElementsHidden={itemIndex !== index}
                importantForAccessibility={
                  itemIndex === index ? "auto" : "no-hide-descendants"
                }
              >
                {fullscreen ? (
                  <ZoomableImage
                    source={item}
                    width={size.width}
                    height={size.height}
                    active={itemIndex === index}
                    nativeGesture={nativeGesture}
                    label={`${label}, ${itemIndex + 1} из ${data.length}`}
                    onMove={onMove}
                  />
                ) : (
                  <SwiperImage
                    source={item}
                    resizeMode={imageResizeMode}
                    label={`${label}, ${itemIndex + 1} из ${data.length}`}
                    onPress={
                      onOpen
                        ? () => {
                            onIndexChange(itemIndex);
                            onOpen();
                          }
                        : undefined
                    }
                    onMove={onMove}
                  />
                )}
              </View>
            )}
          />
        </GestureDetector>
      ) : null}
    </View>
  );
}

/** Поддерживает URL и require-ресурсы, показывает загрузку и повтор в той же области изображения. */
function SwiperImage({
  source,
  resizeMode = "contain",
  label,
  onPress,
  onMove,
}: {
  source: SwiperSource;
  resizeMode?: ImageResizeMode;
  label: string;
  onPress?: () => void;
  onMove: (step: number) => void;
}) {
  const theme = useAppTheme();
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    source ? "loading" : "error",
  );
  const [attempt, setAttempt] = useState(0);
  const failed = status === "error";
  const contentFit =
    resizeMode === "stretch"
      ? "fill"
      : resizeMode === "center"
        ? "scale-down"
        : resizeMode === "repeat"
          ? "contain"
          : resizeMode;

  /** Ошибка превращает нажатие на фото в повтор загрузки; успешное фото открывает просмотр. */
  const handlePress = () => {
    if (failed) {
      setStatus(source ? "loading" : "error");
      setAttempt((previous) => previous + 1);
    } else {
      onPress?.();
    }
  };

  return (
    <Pressable
      accessibilityRole={failed || onPress ? "button" : "image"}
      accessibilityLabel={
        failed ? `${label}. Не удалось загрузить. Повторить` : label
      }
      accessibilityHint={
        onPress && !failed ? "Открывает изображение целиком" : undefined
      }
      accessibilityState={{ busy: status === "loading" }}
      aria-busy={status === "loading"}
      accessibilityActions={[
        { name: "nextImage", label: "Следующее изображение" },
        { name: "previousImage", label: "Предыдущее изображение" },
      ]}
      onAccessibilityAction={({ nativeEvent }) => {
        if (nativeEvent.actionName === "nextImage") onMove(1);
        if (nativeEvent.actionName === "previousImage") onMove(-1);
      }}
      onPress={handlePress}
      style={({ pressed }) => ({
        flex: 1,
        opacity: pressed && (failed || onPress) ? theme.opacity.pressed : 1,
      })}
    >
      {/* Абсолютные слои загрузки и ошибки не меняют размеры фото. */}
      {source ? (
        <Image
          key={attempt}
          source={source}
          accessible={false}
          contentFit={contentFit}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {status === "loading" ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ActivityIndicator color={theme.colors.text.secondary} />
        </View>
      ) : null}
      {failed ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              alignItems: "center",
              justifyContent: "center",
              padding: theme.spacing.md,
              gap: theme.spacing.xs,
              backgroundColor: theme.colors.background.primary,
            },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={theme.components.icon.xl}
            color={theme.colors.text.tertiary}
          />
          <Text
            style={{
              color: theme.colors.text.secondary,
              textAlign: "center",
              fontSize: theme.typography.fontSize.md,
            }}
          >
            Не удалось загрузить изображение
          </Text>
          <Text
            style={{
              color: theme.colors.text.link,
              textAlign: "center",
              fontSize: theme.typography.fontSize.md,
            }}
          >
            Нажмите, чтобы повторить
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** Увеличивает фото относительно точки между пальцами, блокируя перелистывание до конца pinch. */
function ZoomableImage({
  source,
  width,
  height,
  active,
  nativeGesture,
  label,
  onMove,
}: {
  source: SwiperSource;
  width: number;
  height: number;
  active: boolean;
  nativeGesture: NativeGesture;
  label: string;
  onMove: (step: number) => void;
}) {
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const pinch = usePinchGesture({
    enabled: active,
    block: nativeGesture,
    onActivate: (event) => {
      startX.set(event.focalX);
      startY.set(event.focalY);
      scale.set(1);
      translateX.set(0);
      translateY.set(0);
    },
    onUpdate: (event) => {
      const nextScale = Math.min(4, Math.max(1, event.scale));
      scale.set(nextScale);
      translateX.set(
        getPinchTranslation(startX.get(), event.focalX, width, nextScale),
      );
      translateY.set(
        getPinchTranslation(startY.get(), event.focalY, height, nextScale),
      );
    },
    onFinalize: () => {
      const config = {
        duration: 400,
        dampingRatio: 1,
        overshootClamping: true,
        reduceMotion: ReduceMotion.System,
      };
      scale.set(withSpring(1, config));
      translateX.set(withSpring(0, config));
      translateY.set(withSpring(0, config));
    },
  });
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.get() },
      { translateY: translateY.get() },
      { scale: scale.get() },
    ],
  }));

  return (
    <GestureDetector gesture={pinch}>
      <View style={{ flex: 1 }}>
        {/* Детектор не масштабируется вместе с фото: координаты пальцев остаются стабильными. */}
        <Animated.View style={[{ flex: 1 }, imageStyle]}>
          <SwiperImage source={source} label={label} onMove={onMove} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

type FullscreenViewerProps = Pick<
  ImagePagerProps,
  "data" | "index" | "label" | "listRef" | "onIndexChange" | "onMove"
> & { onClose: () => void };

/** Полноэкранный просмотр учитывает все safe area, системный возврат, Escape и крупный текст счётчика. */
function FullscreenViewer({
  data,
  index,
  label,
  listRef,
  onIndexChange,
  onMove,
  onClose,
}: FullscreenViewerProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (process.env.EXPO_OS !== "web") return;

    /** Клавиатура закрывает просмотр или переключает фото без изменения истории маршрутов. */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        onMove(event.key === "ArrowRight" ? 1 : -1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onMove]);

  return (
    <Modal
      visible
      onRequestClose={onClose}
      animationType={reducedMotion ? "none" : "fade"}
      statusBarTranslucent
      navigationBarTranslucent
      supportedOrientations={["portrait", "landscape"]}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: theme.colors.background.primary,
          }}
        >
          {/* Шапка вне области фото: крестик доступен при любом масштабе. */}
          <View
            style={{
              alignItems: "flex-end",
              paddingHorizontal: theme.spacing.xs,
            }}
          >
            <IconButton
              icon="close"
              label="Закрыть изображение"
              onPress={onClose}
            />
          </View>
          <ImagePager
            data={data}
            index={index}
            label={label}
            listRef={listRef}
            fullscreen
            onIndexChange={onIndexChange}
            onMove={onMove}
          />
          {/* Обе стрелки всегда занимают 48 pt; крайние состояния только отключают нужную кнопку. */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
            }}
          >
            <IconButton
              icon="chevron-back"
              label="Предыдущее изображение"
              disabled={index === 0}
              onPress={() => onMove(-1)}
            />
            <Text
              accessibilityLiveRegion="polite"
              style={{
                flex: 1,
                textAlign: "center",
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.md,
                fontVariant: ["tabular-nums"],
              }}
            >
              {index + 1} / {data.length}
            </Text>
            <IconButton
              icon="chevron-forward"
              label="Следующее изображение"
              disabled={index === data.length - 1}
              onPress={() => onMove(1)}
            />
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

export default Swiper;
