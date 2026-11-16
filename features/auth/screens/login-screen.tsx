import { AuthField } from "@/features/auth/components/auth-field";
import { authErrorMessage } from "@/features/auth/api/supabase-auth.api";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useRegistrationDraft } from "@/features/auth/store/registration-draft.store";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

/** Входит в аккаунт после серверной проверки email и пароля; ошибка сохраняет введённые поля. */
export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const normalizedEmail = email.trim().toLowerCase();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const passwordValid = password.length >= 6;

  useEffect(() => {
    // Переход ко входу завершает незаконченный сценарий регистрации.
    useRegistrationDraft.getState().reset();
  }, []);

  /** Отправляет пароль только в Supabase Auth и предотвращает параллельные запросы входа. */
  const handleLogin = async () => {
    setSubmitted(true);
    if (!emailValid || !passwordValid) return;

    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      await login({ email: normalizedEmail, password });
      setPassword("");
      router.dismissTo("/(tabs)/profile");
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  return (
    <AuthPage
      title="С возвращением!"
      description="Войдите в свой аккаунт, чтобы продолжить."
      actionLabel="Войти"
      onAction={handleLogin}
      loading={loading}
      error={error}
      footer="Ещё нет аккаунта?"
      linkLabel="Зарегистрироваться"
      href="/(auth)/register"
    >
      {/* Пустые поля без тестовых данных; автозаполнение использует назначение каждого поля. */}
      <AuthField
        label="Электронная почта"
        placeholder="Электронная почта"
        value={email}
        editable={!loading}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        message="Введите корректную электронную почту"
        invalid={submitted && !emailValid}
      />
      <AuthField
        label="Пароль"
        placeholder="Пароль"
        value={password}
        editable={!loading}
        onChangeText={setPassword}
        password
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
        message="Введите пароль не короче 6 символов"
        invalid={submitted && !passwordValid}
      />
    </AuthPage>
  );
}
