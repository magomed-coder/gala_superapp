import { AuthField } from "@/features/auth/components/auth-field";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useRegistrationDraft } from "@/features/auth/store/registration-draft.store";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";

/** Второй шаг запрашивает почту; прямая ссылка без имени возвращает к началу регистрации. */
export default function RegisterEmailScreen() {
  const router = useRouter();
  const firstName = useRegistrationDraft((state) => state.firstName);
  const email = useRegistrationDraft((state) => state.email);
  const setEmail = useRegistrationDraft((state) => state.setEmail);
  const [submitted, setSubmitted] = useState(false);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /** Проверяет почту, нормализует её и открывает создание пароля. */
  const continueRegistration = () => {
    setSubmitted(true);
    if (!valid) return;
    setEmail(email.trim().toLowerCase());
    router.push("/(auth)/register-password");
  };

  if (!firstName.trim()) return <Redirect href="/(auth)/register" />;

  return (
    <AuthPage
      title="Ваша почта"
      description="Укажите электронную почту для аккаунта."
      actionLabel="Продолжить"
      onAction={continueRegistration}
      footer="Уже есть аккаунт?"
      linkLabel="Войти"
      href="/(auth)/login"
      step={2}
    >
      {/* Поле проверяется до перехода, введённая почта сохраняется при возврате к имени. */}
      <AuthField
        label="Электронная почта"
        placeholder="Электронная почта"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={continueRegistration}
        message="Введите корректную электронную почту"
        invalid={submitted && !valid}
      />
    </AuthPage>
  );
}
