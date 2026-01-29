import { Button, Card, Input, Text } from "@/components/ui";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email || !email.includes("@")) {
      newErrors.email = "Введите корректный email";
      isValid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = "Пароль должен быть минимум 6 символов";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Симуляция API запроса
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Сохранение данных через Zustand
      login({
        id: "1",
        email,
        name: email.split("@")[0],
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "customer",
      });

      // Переход на главный экран
      router.replace("/(tabs)/main");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выполнить вход. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        id: "1",
        email: "demo@example.com",
        name: "Demo User",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "customer",
      });
      router.replace("/(tabs)/main");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выполнить вход.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <Text size="3xl" weight="bold">
              SuperApp
            </Text>
            <Text size="lg" color="#666666" style={styles.subtitle}>
              Вход в аккаунт
            </Text>
          </View>

          {/* Форма */}
          <Card style={styles.form}>
            <Text size="lg" weight="semibold" style={styles.formTitle}>
              Введите ваши данные
            </Text>

            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
              style={styles.input}
            />
            {errors.email ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.email}
              </Text>
            ) : null}

            <Input
              placeholder="Пароль"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              style={styles.input}
            />
            {errors.password ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.password}
              </Text>
            ) : null}

            {/* Забыли пароль */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text size="sm" color="#3B82F6">
                Забыли пароль?
              </Text>
            </TouchableOpacity>

            {/* Кнопка входа */}
            <Button
              title={loading ? "Загрузка..." : "Войти"}
              onPress={handleLogin}
              disabled={loading}
              style={styles.button}
            />

            {/* Или демо вход */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text size="sm" color="#999999">
                ИЛИ
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={loading}
            >
              <Text size="sm" weight="semibold" color="#3B82F6">
                Войти как демо пользователь
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Регистрация */}
          <View style={styles.footer}>
            <Text size="sm" color="#666666">
              Нет аккаунта?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text size="sm" weight="semibold" color="#3B82F6">
                Зарегистрируйтесь
              </Text>
            </TouchableOpacity>
          </View>

          {/* Подсказка для демо */}
          <Card style={styles.demoCard}>
            <Text size="sm" weight="semibold" color="#F59E0B">
              💡 Подсказка для тестирования
            </Text>
            <Text size="xs" color="#666666" style={styles.demoText}>
              Email: demo@example.com
            </Text>
            <Text size="xs" color="#666666">
              Пароль: password123
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
    paddingVertical: 20,
  },
  formTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 4,
  },
  error: {
    marginBottom: 12,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    marginBottom: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  demoButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 6,
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  demoCard: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  demoText: {
    marginVertical: 4,
  },
});
