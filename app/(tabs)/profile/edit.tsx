import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Input, Text } from "../../../shared/components/ui";

export default function EditProfileScreen() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
  });

  const handleSave = () => {
    // Save logic here
    router.back();
  };

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
          <Text size="xl" weight="bold" style={{ marginTop: 8 }}>
            Редактировать профиль
          </Text>
        </View>

        {/* Form */}
        <Card style={styles.formCard}>
          <Input
            placeholder="Имя"
            value={profileData.firstName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, firstName: text })
            }
            style={styles.input}
          />
          <Input
            placeholder="Фамилия"
            value={profileData.lastName}
            onChangeText={(text) =>
              setProfileData({ ...profileData, lastName: text })
            }
            style={styles.input}
          />
          <Input
            placeholder="Email"
            value={profileData.email}
            onChangeText={(text) =>
              setProfileData({ ...profileData, email: text })
            }
            style={styles.input}
          />
          <Input
            placeholder="Телефон"
            value={profileData.phone}
            onChangeText={(text) =>
              setProfileData({ ...profileData, phone: text })
            }
            style={styles.input}
          />
        </Card>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            label="Сохранить изменения"
            variant="primary"
            onPress={handleSave}
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
  formCard: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  input: {
    marginBottom: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
