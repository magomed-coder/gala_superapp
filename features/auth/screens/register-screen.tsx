import { AuthField } from "@/features/auth/components/auth-field";
import { AuthPage } from "@/features/auth/components/auth-page";
import { useRegistrationDraft } from "@/features/auth/store/registration-draft.store";
import { useRouter } from "expo-router";
import { useState } from "react";

/** Первый шаг регистрации собирает имя и необязательную фамилию, сохраняя их при возврате. */
export default function RegisterScreen() {
  const router = useRouter();
  const firstName = useRegistrationDraft((state) => state.firstName);
  const lastName = useRegistrationDraft((state) => state.lastName);
  const setName = useRegistrationDraft((state) => state.setName);
  const [submitted, setSubmitted] = useState(false);

  /** Проверяет обязательное имя и открывает отдельную страницу электронной почты. */
  const continueRegistration = () => {
    setSubmitted(true);
    if (!firstName.trim()) return;
    router.push("/(auth)/register-email");
  };

  return (
    <AuthPage
      title="Регистрация"
      description="Давайте познакомимся. Как вас зовут?"
      actionLabel="Продолжить"
      onAction={continueRegistration}
      footer="Уже есть аккаунт?"
      linkLabel="Войти"
      href="/(auth)/login"
      step={1}
    >
      {/* Имя обязательно; фамилию можно добавить сейчас или позже в профиле. */}
      <AuthField
        label="Имя"
        placeholder="Имя"
        value={firstName}
        onChangeText={(value) => setName(value, lastName)}
        autoComplete="given-name"
        textContentType="givenName"
        autoCapitalize="words"
        message="Введите ваше имя"
        invalid={submitted && !firstName.trim()}
      />
      <AuthField
        label="Фамилия"
        placeholder="Фамилия · необязательно"
        value={lastName}
        onChangeText={(value) => setName(firstName, value)}
        autoComplete="family-name"
        textContentType="familyName"
        autoCapitalize="words"
        returnKeyType="next"
        onSubmitEditing={continueRegistration}
        message="Фамилию можно добавить позже"
      />
    </AuthPage>
  );
}
