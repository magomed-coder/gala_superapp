import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
// ширина экрана устройства
const ITEM_WIDTH = width * 1.0;
// ширина одного айтема = 80% от ширины экрана
const ITEM_SPACING = (width - ITEM_WIDTH) / 2;
// отступы по бокам, чтобы айтемы центрировались

// Тип одного элемента данных (слайд)
// export interface DataItem {
//   image: ImageSourcePropType | string; // картинка (локальный require или URL)
//   title: string; // заголовок
// }

interface AnimatedSwiperProps {
  data: string[]; // массив элементов приходит через пропсы
}

export function AnimatedSwiper({ data }: AnimatedSwiperProps) {
  // SharedValue хранит текущее значение прокрутки по оси X
  const scrollX = useSharedValue(0);

  // обработчик скролла FlatList
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      // обновляем scrollX при каждом скролле
    },
  });

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ alignItems: "center" }}>
        {/* Горизонтальный FlatList с эффектом перелистывания */}
        <Animated.FlatList
          data={data}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
          snapToInterval={ITEM_WIDTH} // "прилипание" к айтему
          decelerationRate="fast" // быстрое замедление
          onScroll={scrollHandler} // обновляем scrollX
          scrollEventThrottle={16} // частота обновления ~60fps
          renderItem={({ item, index }) => (
            <AnimatedItem item={item} index={index} scrollX={scrollX} />
          )}
        />
        {/* Индикаторы (точки) под слайдером */}
        <Dots data={data} scrollX={scrollX} />
      </View>
    </View>
  );
}

interface AnimatedItemProps {
  item: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
}

// Один элемент слайдера
function AnimatedItem({ item, index, scrollX }: AnimatedItemProps) {
  // Анимация масштаба (увеличиваем центральный элемент)
  const animatedStyle = useAnimatedStyle(() => {
    // диапазон, когда айтем видим слева, по центру и справа
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    // масштаб: слева/справа меньше (0.95), по центру — 1
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.99, 1, 0.99],
      "clamp",
    );

    return { transform: [{ scale }] };
  });

  // поддержка require() и URL для картинок
  const source = typeof item === "string" ? { uri: item } : item;

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <View style={styles.innerItem}>
        {/* Картинка */}
        <Image source={source} style={styles.image} resizeMode="cover" />

        {/* Градиент внизу для читаемости текста */}
        {/* <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientOverlay}
        >
          <Text style={styles.title}>{item.title}</Text>
        </LinearGradient> */}
      </View>
    </Animated.View>
  );
}

interface DotsProps {
  data: string[];
  scrollX: Animated.SharedValue<number>;
}

// Компонент для отрисовки всех точек
function Dots({ data, scrollX }: DotsProps) {
  return (
    <View style={styles.dotsContainer}>
      {data.map((_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} />
      ))}
    </View>
  );
}

interface DotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
}

// Одна точка индикатора
function Dot({ index, scrollX }: DotProps) {
  // Анимация ширины точки (увеличивается для активного слайда)
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      [
        (index - 1) * ITEM_WIDTH, // предыдущий
        index * ITEM_WIDTH, // текущий
        (index + 1) * ITEM_WIDTH, // следующий
      ],
      [6, 18, 6], // ширина: маленькая → большая → маленькая
      "clamp",
    );
    return { width };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  item: {
    width: ITEM_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  innerItem: {
    width: "100%",
    height: "100%",
    backgroundColor: "whitesmoke",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    position: "absolute",
    textAlignVertical: "center",
    textAlign: "center",
    bottom: 0,
    fontSize: 22,
    fontWeight: "bold",
    color: "whitesmoke",
    zIndex: 1,
    width: "100%",
    paddingVertical: 30,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    height: 6,
    backgroundColor: "black",
    borderRadius: 4,
    marginHorizontal: 2,
  },
});
