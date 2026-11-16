import { AuthField } from "@/features/auth/components/auth-field";
import { authErrorMessage } from "@/features/auth/api/supabase-auth.api";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useRegistrationDraft } from "@/features/auth/store/registration-draft.store";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";

/** Завершает три шага регистрации; пароли существуют только в локальном состоянии этой страницы. */
export default function RegisterPasswordScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const firstName = useRegistrationDraft((state) => state.firstName);
  const lastName = useRegistrationDraft((state) => state.lastName);
  const email = useRegistrationDraft((state) => state.email);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const passwordValid = password.length >= 6;
  const confirmationValid = !!confirmation && password === confirmation;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /** Создаёт серверный аккаунт и получает сессию без подтверждения email; пароль остаётся в форме до успеха. */
  const createAccount = async () => {
    setSubmitted(true);
    if (
      !firstName.trim() ||
      !emailValid ||
      !passwordValid ||
      !confirmationValid
    )
      return;
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setError("");
    try {
      await register({
        name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
        email,
        password,
      });
      setPassword("");
      setConfirmation("");
      router.dismissTo("/(tabs)/profile");
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  if (!firstName.trim()) return <Redirect href="/(auth)/register" />;
  if (!emailValid) return <Redirect href="/(auth)/register-email" />;

  return (
    <AuthPage
      title="Создайте пароль"
      description="Не менее 6 символов. Запомните его для входа."
      actionLabel="Создать аккаунт"
      onAction={createAccount}
      loading={loading}
      error={error}
      footer="Уже есть аккаунт?"
      linkLabel="Войти"
      href="/(auth)/login"
      step={3}
    >
      {/* Обе строки позволяют независимо показать пароль; ошибка не меняет положение действия. */}
      <AuthField
        label="Пароль"
        placeholder="Пароль"
        value={password}
        editable={!loading}
        onChangeText={setPassword}
        password
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        message="Пароль должен содержать не менее 6 символов"
        invalid={submitted && !passwordValid}
      />
      <AuthField
        label="Повторите пароль"
        placeholder="Повторите пароль"
        value={confirmation}
        editable={!loading}
        onChangeText={setConfirmation}
        password
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={createAccount}
        message="Пароли должны совпадать"
        invalid={submitted && !confirmationValid}
      />
    </AuthPage>
  );
}
