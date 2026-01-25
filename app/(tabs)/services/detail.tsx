import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchMockData,
  Provider,
  ServiceCategory,
} from "../../../mocks/mockData";
import {
  Button,
  Card,
  Divider,
  StarRating,
  Text,
} from "../../../shared/components/ui";

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { providerId } = useLocalSearchParams();
  const [provider, setProvider] = useState<
    (Provider & { categoryName: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      const data = await fetchMockData("serviceCategories");
      const allProviders = (data as ServiceCategory[]).flatMap((cat) =>
        cat.providers.map((p) => ({ ...p, categoryName: cat.name })),
      );
      const found =
        allProviders.find((p) => p.id === providerId) || allProviders[0];
      setProvider(found);
      setLoading(false);
    };
    loadProvider();
  }, [providerId]);

  const handleContact = (method: "whatsapp" | "telegram" | "phone") => {
    if (!provider) return;
    let url = "";

    if (method === "whatsapp" && provider.whatsappPhone) {
      const message = `Здравствуйте, ${provider.name}! Мне нужна ваша услуга.`;
      url = `https://wa.me/${provider.whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    } else if (method === "telegram" && provider.telegramUsername) {
      url = `https://t.me/${provider.telegramUsername.replace("@", "")}`;
    } else if (method === "phone") {
      url = `tel:${provider.phoneNumber}`;
    }

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert("Ошибка", "Не удалось открыть способ контакта");
      });
    }
  };

  if (loading || !provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text size="lg" color="#FF6B6B">
              ← Назад
            </Text>
          </TouchableOpacity>
        </View>

        {/* Provider Card */}
        <Card style={styles.providerCard}>
          <View style={styles.providerHeader}>
            <View style={{ flex: 1 }}>
              <Text size="xl" weight="bold">
                {provider.name}
              </Text>
              <Text size="sm" color="#666666" style={{ marginTop: 4 }}>
                {provider.categoryName}
              </Text>
            </View>
            <StarRating
              rating={provider.rating}
              count={provider.reviewCount}
              size="small"
            />
          </View>

          <Text size="sm" color="#999999" style={styles.specialization}>
            {provider.specialization}
          </Text>

          <Text size="sm" style={styles.description}>
            {provider.description}
          </Text>

          <View style={{ marginVertical: 12 }}>
            <Divider />
          </View>

          <View style={styles.priceContainer}>
            <Text size="base" color="#666666">
              Стоимость услуги
            </Text>
            <Text size="lg" weight="bold" color="#FF6B6B">
              {provider.price}₽/час
            </Text>
          </View>
        </Card>

        {/* Experience */}
        <Card style={styles.infoCard}>
          <Text size="base" weight="semibold">
            Опыт работы
          </Text>
          <Text size="sm" color="#666666" style={{ marginTop: 8 }}>
            5+ лет опыта в области {provider.specialization}
          </Text>
        </Card>

        {/* Contact Methods */}
        <Card style={styles.contactCard}>
          <Text size="base" weight="semibold" style={styles.contactTitle}>
            Способы связи
          </Text>

          <View style={styles.contactButtonsContainer}>
            {provider.whatsappPhone && (
              <Button
                label="WhatsApp"
                variant="primary"
                onPress={() => handleContact("whatsapp")}
                style={{ ...styles.contactButton, backgroundColor: "#25D366" }}
              />
            )}
            {provider.telegramUsername && (
              <Button
                label="Telegram"
                variant="primary"
                onPress={() => handleContact("telegram")}
                style={{ ...styles.contactButton, backgroundColor: "#0088cc" }}
              />
            )}
            <Button
              label="Позвонить"
              variant="primary"
              onPress={() => handleContact("phone")}
              style={{ ...styles.contactButton, backgroundColor: "#666666" }}
            />
          </View>
        </Card>

        {/* Booking Button */}
        <View style={styles.bookingContainer}>
          <Button
            label="Забронировать"
            variant="primary"
            onPress={() => Alert.alert("Успешно", "Услуга забронирована!")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  providerCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  providerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  specialization: {
    fontStyle: "italic",
    marginVertical: 8,
  },
  description: {
    color: "#666666",
    lineHeight: 20,
    marginVertical: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  contactCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  contactTitle: {
    marginBottom: 12,
  },
  contactButtonsContainer: {
    gap: 8,
  },
  contactButton: {
    width: "100%",
  },
  bookingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
