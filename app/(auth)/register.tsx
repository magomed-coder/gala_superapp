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

export default function RegisterScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Введите имя";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Введите фамилию";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный формат email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    }

    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      login({
        id: "1",
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "customer",
      });

      router.replace("/(tabs)/main");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать аккаунт. Попробуйте снова.");
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text size="lg" color="#3B82F6">
              ← Назад
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text size="3xl" weight="bold">
              Регистрация
            </Text>
            <Text size="lg" color="#666666" style={styles.subtitle}>
              Создайте свой аккаунт
            </Text>
          </View>

          {/* Форма */}
          <Card style={styles.form}>
            <Input
              placeholder="Имя"
              value={formData.firstName}
              onChangeText={(value) => updateField("firstName", value)}
              editable={!loading}
              style={styles.input}
            />
            {errors.firstName ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.firstName}
              </Text>
            ) : null}

            <Input
              placeholder="Фамилия"
              value={formData.lastName}
              onChangeText={(value) => updateField("lastName", value)}
              editable={!loading}
              style={styles.input}
            />
            {errors.lastName ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.lastName}
              </Text>
            ) : null}

            <Input
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => updateField("email", value)}
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
              placeholder="Телефон"
              value={formData.phone}
              onChangeText={(value) => updateField("phone", value)}
              keyboardType="phone-pad"
              editable={!loading}
              style={styles.input}
            />
            {errors.phone ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.phone}
              </Text>
            ) : null}

            <Input
              placeholder="Пароль"
              value={formData.password}
              onChangeText={(value) => updateField("password", value)}
              secureTextEntry
              editable={!loading}
              style={styles.input}
            />
            {errors.password ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.password}
              </Text>
            ) : null}

            <Input
              placeholder="Подтвердить пароль"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              secureTextEntry
              editable={!loading}
              style={styles.input}
            />
            {errors.confirmPassword ? (
              <Text size="sm" color="#EF4444" style={styles.error}>
                {errors.confirmPassword}
              </Text>
            ) : null}

            <Button
              title={loading ? "Загрузка..." : "Создать аккаунт"}
              onPress={handleRegister}
              disabled={loading}
              style={styles.button}
            />
          </Card>

          {/* Вход */}
          <View style={styles.footer}>
            <Text size="sm" color="#666666">
              Уже есть аккаунт?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text size="sm" weight="semibold" color="#3B82F6">
                Войти
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    marginBottom: 24,
    paddingVertical: 20,
  },
  input: {
    marginBottom: 4,
  },
  error: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
