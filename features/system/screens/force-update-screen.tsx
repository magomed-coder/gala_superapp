// app/force-update.tsx
import { IS_IOS } from "@/shared/constants/config.constants";
import { useAppVersionStore } from "@/features/system/store/version.store";

import { Text } from "@/shared/components/text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  BounceIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function ForceUpdateScreen() {
  const insets = useSafeAreaInsets();
  const { versionInfo, getUpdateUrl } = useAppVersionStore();
  const url = getUpdateUrl();

  const openStore = () => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert("Ошибка", "Не удалось открыть магазин приложений", [
          { text: "Понятно", style: "cancel" },
        ]);
      });
    } else {
      Alert.alert(
        "Ссылка недоступна",
        "Пожалуйста, обновите приложение через магазин приложений вручную",
        [{ text: "ОК", style: "default" }],
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Верхний декоративный элемент — теперь мягкий серо-голубой */}
      <Animated.View
        entering={FadeInUp.delay(200).springify()}
        style={styles.topDecoration}
      >
        <LinearGradient
          colors={["#e0e7ff", "#c7d2fe"]}
          style={styles.gradientCircle}
        />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Иконка обновления — спокойный индиго */}
          <Animated.View
            entering={BounceIn.delay(400)}
            style={styles.iconContainer}
          >
            <LinearGradient
              colors={["#6366f1", "#4f46e5"]}
              style={styles.iconGradient}
            >
              <Ionicons name="cloud-download-outline" size={64} color="white" />
            </LinearGradient>

            {/* Убрал лишние декоративные кружки — оставил чисто */}
          </Animated.View>

          {/* Заголовок */}
          <Animated.Text entering={FadeInDown.delay(600)} style={styles.title}>
            Требуется обновление
          </Animated.Text>

          {/* Бейдж версии */}
          <Animated.View
            entering={FadeInDown.delay(700)}
            style={styles.versionContainer}
          >
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>
                Версия {versionInfo?.latest_version || "новая"}
              </Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
          </Animated.View>

          {/* Карточка с информацией */}
          <Animated.View
            entering={FadeInDown.delay(800)}
            style={styles.infoCard}
          >
            <View style={styles.infoHeader}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#64748b"
              />
              <Text style={styles.infoTitle}>Что нового в обновлении</Text>
            </View>

            <View style={styles.infoItems}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#64748b"
                  />
                </View>
                <Text style={styles.infoItemText}>
                  Улучшена безопасность и стабильность
                </Text>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="flash-outline" size={20} color="#64748b" />
                </View>
                <Text style={styles.infoItemText}>
                  Оптимизирована производительность
                </Text>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="bug-outline" size={20} color="#64748b" />
                </View>
                <Text style={styles.infoItemText}>
                  Исправлены известные ошибки
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Основное сообщение */}
          <Animated.View
            entering={FadeInDown.delay(900)}
            style={styles.messageContainer}
          >
            <Text style={styles.mainMessage}>
              Ваша версия приложения устарела
            </Text>
            <Text style={styles.subMessage}>
              Для продолжения работы установите актуальную версию
            </Text>
          </Animated.View>

          {/* Кнопка обновления */}
          <Animated.View
            entering={FadeInDown.delay(1000)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity onPress={openStore} activeOpacity={0.8}>
              <LinearGradient
                colors={["#6366f1", "#4f46e5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons
                  name="download-outline"
                  size={24}
                  color="white"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.buttonText}>Обновить приложение</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.storeHint}>
              <Ionicons
                name={IS_IOS ? "logo-apple" : "logo-google-playstore"}
                size={16}
                color="#94a3b8"
              />
              <Text style={styles.storeHintText}>
                Откроется {IS_IOS ? "App Store" : "Google Play"}
              </Text>
            </View>
          </Animated.View>

          {/* Футер */}
          <Animated.Text
            entering={FadeInDown.delay(1100)}
            style={styles.footer}
          >
            Приложение перезапустится автоматически после установки
          </Animated.Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  contentWrapper: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  topDecoration: {
    position: "absolute",
    top: -width * 0.15,
    right: -width * 0.1,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width,
    opacity: 0.6,
    overflow: "hidden",
  },
  gradientCircle: {
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#1e293b",
  },
  versionContainer: {
    marginBottom: 32,
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 12,
  },
  versionText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
  },
  newBadge: {
    backgroundColor: "#2AA63E",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
  },
  infoCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
  infoItems: {
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  infoItemText: {
    fontSize: 15,
    color: "#475569",
    flex: 1,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainMessage: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#334155",
    marginBottom: 8,
    lineHeight: 26,
  },
  subMessage: {
    fontSize: 15,
    textAlign: "center",
    color: "#64748b",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 40,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  storeHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  storeHintText: {
    fontSize: 14,
    color: "#94a3b8",
  },
  footer: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },

  bottomGradient: {
    width: "100%",
    height: "100%",
  },
});
