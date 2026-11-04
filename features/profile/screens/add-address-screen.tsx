import {
  ProfileFormFields,
  ProfilePage,
} from "@/features/profile/components/profile-page";
import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { SettingsRow } from "@/shared/components/settings-row";
import { SettingsSection } from "@/shared/components/settings-section";
import { Button } from "@/shared/components/themed-button";
import { Input } from "@/shared/components/themed-input";
import { useAppTheme } from "@/shared/theme";
import type { ProfileAddress } from "@/features/profile/types/profile-address";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { View } from "react-native";

/** Отдельная форма добавляет адрес в локальный список профиля и возвращает к нему. */
export default function AddAddressScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const addAddress = useProfileStore((state) => state.addAddress);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [type, setType] = useState<ProfileAddress["type"]>("home");
  const saved = useRef(false);
  const valid = !!city.trim() && !!street.trim();

  /** Добавляет только заполненный адрес; повторное нажатие не создаёт дубликат. */
  const save = () => {
    if (!valid || saved.current) return;
    saved.current = true;
    addAddress({
      id: Date.now().toString(),
      type,
      city: city.trim(),
      street: street.trim(),
      isDefault: false,
    });
    router.dismissTo("/(tabs)/profile/addresses");
  };

  return (
    <ProfilePage form>
      {/* Основные поля адреса доступны над клавиатурой. */}
      <SettingsSection title="Куда доставить или приехать?">
        <ProfileFormFields>
          <Input
            label="Город или населённый пункт"
            accessibilityLabel="Город или населённый пункт"
            placeholder="Например, Грозный"
            value={city}
            onChangeText={setCity}
            textContentType="addressCity"
          />
          <Input
            label="Улица, дом, квартира"
            multiline
            textAlignVertical="top"
            inputStyle={{ minHeight: theme.spacing.xxxl + theme.spacing.lg }}
            accessibilityLabel="Улица, дом, квартира"
            placeholder="Укажите полный адрес"
            value={street}
            onChangeText={setStreet}
            autoComplete="street-address"
          />
        </ProfileFormFields>
      </SettingsSection>
      {/* Все варианты сохраняют место под отметку при выборе. */}
      <SettingsSection
        title="Тип адреса"
        footer="Первый адрес станет основным. После перезапуска приложения список очистится."
      >
        {(
          [
            { value: "home", title: "Дом", icon: "home-outline" },
            { value: "work", title: "Работа", icon: "briefcase-outline" },
            { value: "other", title: "Другой", icon: "location-outline" },
          ] as const
        ).map((item, index) => (
          <SettingsRow
            key={item.value}
            title={item.title}
            icon={item.icon}
            selected={type === item.value}
            onPress={() => setType(item.value)}
            divider={index < 2}
            trailing={
              <View style={{ width: theme.components.icon.md }}>
                <Ionicons
                  name="checkmark"
                  size={theme.components.icon.sm}
                  color={theme.colors.brand.primary}
                  style={{ opacity: type === item.value ? 1 : 0 }}
                />
              </View>
            }
          />
        ))}
      </SettingsSection>
      <Button
        label="Сохранить адрес"
        disabled={!valid}
        onPress={save}
        style={{ minHeight: theme.components.button.height }}
      />
    </ProfilePage>
  );
}
