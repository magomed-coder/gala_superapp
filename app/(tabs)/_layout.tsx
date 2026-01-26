import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { paddingBottom: 8 + insets.bottom }],
        tabBarActiveTintColor: "#9AA9C0",
        tabBarInactiveTintColor: "#BCBBC1",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="home" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Поиск",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="search" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: "Услуги",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="briefcase" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Заказы",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="list" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: "#E8E8EA",
    backgroundColor: "#FDF7F3",
    paddingBottom: 8,
    paddingTop: 12,
    height: 100,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
