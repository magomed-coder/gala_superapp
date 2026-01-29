import { Button, Card, Divider, Text } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileStore } from "../../../shared/stores";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useProfileStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  // Пример данных профиля (в реальном приложении извлекаются из хранилища)
  const [profileData, setProfileData] = useState({
    firstName: "Иван",
    lastName: "Петров",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    avatar: null as string | null,
    joinDate: "15.01.2023",
    membership: "Премиум",
    level: "Gold",
    points: 1250,
    ordersCount: 24,
    addresses: 3,
  });
  // надо будет вставить балы

  const handleLogout = () => {
    // Логика выхода
    setLogoutModalVisible(false);
    Alert.alert("Вы вышли из аккаунта");
    router.replace("/(auth)/login");
  };

  const handleAvatarChange = () => {
    // Логика изменения аватара
    Alert.alert("Изменить фото", "Выберите источник фото", [
      { text: "Камера", onPress: () => console.log("Camera") },
      { text: "Галерея", onPress: () => console.log("Gallery") },
      { text: "Отмена", style: "cancel" },
    ]);
  };

  // Серый/черный с прозрачностью для иконок
  const iconColor = "rgba(0,0,0,0.5)";
  const menuItems = [
    {
      title: "Редактировать профиль",
      icon: <Ionicons name="create-outline" size={22} color={iconColor} />,
      route: "/(tabs)/profile/edit",
    },
    {
      title: "Мои адреса",
      icon: <Ionicons name="location-outline" size={22} color={iconColor} />,
      route: "/(tabs)/profile/addresses",
    },
    {
      title: "Мои заказы",
      icon: <Ionicons name="cube-outline" size={22} color={iconColor} />,
      route: "/(tabs)/profile/orders",
    },
    {
      title: "Избранное",
      icon: <Ionicons name="heart-outline" size={22} color={iconColor} />,
      route: "/(tabs)/profile/favorites",
    },
    {
      title: "Корзина",
      icon: <Ionicons name="bag-outline" size={22} color={iconColor} />,
      route: "/(tabs)/cart",
    },
    {
      title: "Платежные методы",
      icon: <Ionicons name="card-outline" size={22} color={iconColor} />,
      route: "/(tabs)/profile/payments",
    },
    {
      title: "Уведомления",
      icon: (
        <Ionicons name="notifications-outline" size={22} color={iconColor} />
      ),
      route: "/(tabs)/profile/notifications",
    },
    {
      title: "Безопасность",
      icon: (
        <Ionicons name="shield-checkmark-outline" size={22} color={iconColor} />
      ),
      route: "/(tabs)/profile/security",
    },
    {
      title: "Настройки профиля",
      icon: (
        <Ionicons name="person-circle-outline" size={22} color={iconColor} />
      ),
      route: "/(tabs)/profile/settings",
    },
    {
      title: "Служба поддержки",
      icon: (
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={22}
          color={iconColor}
        />
      ),
      route: "/(tabs)/profile/support",
    },
    {
      title: "О приложении",
      icon: (
        <Ionicons
          name="information-circle-outline"
          size={22}
          color={iconColor}
        />
      ),
      route: "/(tabs)/profile/about",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="r700.24">Профиль</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleAvatarChange}>
              <View style={styles.avatarContainer}>
                {profileData.avatar ? (
                  <Image
                    source={{ uri: profileData.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text variant="r700.32.40" color="#FFF">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </Text>
                  </View>
                )}
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={16} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.profileInfo}>
              <Text variant="r700.20">
                {profileData.firstName} {profileData.lastName}
              </Text>
              <Text
                variant="r400.14"
                style={[styles.memberSince, { color: "#666666" }]}
              >
                Участник с {profileData.joinDate}
              </Text>

              {/* Баллы внутри карточки профиля */}
              <View style={styles.badgesContainer}>
                <View style={[styles.badge, { backgroundColor: "#EFF6FF" }]}>
                  <Text
                    variant="r700.12"
                    style={{
                      color: "#3B82F6",
                    }}
                  >
                    {profileData.membership}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: "#F0F9FF" }]}>
                  <Text
                    variant="r700.12"
                    style={{
                      color: "#0EA5E9",
                    }}
                  >
                    {profileData.level}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={20} color="#666666" />
              <Text variant="r400.14" style={styles.contactText}>
                {profileData.email}
              </Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color="#666666" />
              <Text variant="r400.14" style={styles.contactText}>
                {profileData.phone}
              </Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuItemLeft}>
                  {item.icon}
                  <Text variant="r500.16">{item.title}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  <Ionicons name="chevron-forward" size={20} color="#999999" />
                </View>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        {/* Logout Button */}
        <Button
          title="Выйти из аккаунта"
          variant="danger"
          onPress={() => setLogoutModalVisible(true)}
          style={styles.logoutButton}
          iconLeft={<Ionicons name="log-out" size={20} color="#EF4444" />}
        />

        {/* Version Info */}
        <Text
          variant="r400.12"
          style={[styles.versionText, { color: "#999999" }]}
        >
          Версия 1.0.0 • 2024
        </Text>
      </ScrollView>

      {/* Logout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Card style={styles.modalContent}>
            <Text variant="r700.24">Выйти из аккаунта?</Text>
            <Text
              variant="r400.16"
              style={[styles.modalText, { color: "#666666" }]}
            >
              Вы уверены, что хотите выйти? Вам нужно будет снова войти в
              аккаунт.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                title="Отмена"
                // variant="outline"
                onPress={() => setLogoutModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                title="Выйти"
                variant="danger"
                onPress={handleLogout}
                style={styles.modalButton}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  profileCard: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 0,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileInfo: {
    flex: 1,
  },
  memberSince: {
    marginTop: 4,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  divider: {
    marginVertical: 16,
  },
  contactInfo: {
    gap: 12,
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactText: {
    flex: 1,
    color: "#374151",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statLabel: {
    textAlign: "center",
  },
  menuCard: {
    marginBottom: 20,
    padding: 0,
    overflow: "hidden",
    borderWidth: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuIcon: {
    fontSize: 20,
    width: 24,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  badgeCount: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    padding: 24,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  modalText: {
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  statsRedesignedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,

    backgroundColor: "#FFF",
    borderRadius: 16,
  },
  statRedesignedCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 2,
  },
  statRedesignedIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statRedesignedInfo: {
    flex: 1,
    justifyContent: "center",
  },
});
