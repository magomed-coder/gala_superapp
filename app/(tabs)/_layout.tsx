import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#9AA9C0",
        tabBarInactiveTintColor: "#BCBBC1",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
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
