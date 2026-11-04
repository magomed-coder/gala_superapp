import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import {
  ProfileFormFields,
  ProfilePage,
} from "@/features/profile/components/profile-page";
import { SettingsSection } from "@/shared/components/settings-section";
import { Button } from "@/shared/components/themed-button";
import { Input } from "@/shared/components/themed-input";
import { useAppTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";

/** Сбрасывает черновик при смене аккаунта, в том числе после входа с гостевой страницы. */
export default function EditProfileScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  return <EditProfileContent key={userId ?? "guest"} />;
}

/** Редактирует данные существующей демо-сессии без подстановки вымышленного аккаунта. */
function EditProfileContent() {
  const theme = useAppTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [submitted, setSubmitted] = useState(false);
  const valid =
    !!name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    (!phone.trim() || /^\+?[\d\s()-]{7,25}$/.test(phone.trim()));
  const changed =
    name.trim() !== user?.name ||
    email.trim() !== user?.email ||
    phone.trim() !== (user?.phone ?? "");

  /** Проверяет черновик и обновляет единственный store текущего аккаунта. */
  const save = () => {
    setSubmitted(true);
    if (!valid || !user) return;
    updateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    router.back();
  };

  if (!user) {
    return (
      <ProfilePage>
        <ProfileEmptyState
          icon="person-outline"
          title="Войдите в аккаунт"
          description="После входа здесь можно изменить личные данные."
          action={
            <Button
              label="Войти"
              onPress={() => router.push("/(auth)/login")}
            />
          }
        />
      </ProfilePage>
    );
  }

  return (
    <ProfilePage form>
      {/* Поля заполняются только данными текущего аккаунта. */}
      <SettingsSection
        title="Основная информация"
        footer="Изменения действуют в текущем сеансе."
      >
        <ProfileFormFields>
          <Input
            label="Имя и фамилия"
            accessibilityLabel="Имя и фамилия"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            textContentType="name"
          />
          <Input
            label="Электронная почта"
            accessibilityLabel="Электронная почта"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          <Input
            label="Телефон · необязательно"
            accessibilityLabel="Телефон"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
        </ProfileFormFields>
      </SettingsSection>

      {/* Место под сообщение всегда занято: ошибка не двигает кнопку сохранения. */}
      <Text
        accessibilityLiveRegion="polite"
        accessible={submitted && !valid}
        accessibilityElementsHidden={!submitted || valid}
        importantForAccessibility={
          submitted && !valid ? "auto" : "no-hide-descendants"
        }
        style={{
          color: theme.colors.status.error,
          opacity: submitted && !valid ? 1 : 0,
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        }}
      >
        Проверьте имя, электронную почту и номер телефона.
      </Text>
      <Button
        label="Сохранить изменения"
        disabled={!changed}
        onPress={save}
        style={{ minHeight: theme.components.button.height }}
      />
    </ProfilePage>
  );
}
