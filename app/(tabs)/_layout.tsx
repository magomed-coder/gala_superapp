import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // console.log("Segments:", segments);

  const hideTabBar =
    segments[segments.length - 1] === "search" ||
    segments[segments.length - 1] === "transport";

  const commonTabBarStyle = [
    styles.tabBar,
    { paddingBottom: 8 + insets.bottom, height: 70 + insets.bottom },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#BCBBC1",
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="main"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="home-search-outline"
              color={color}
            />
          ),
          tabBarStyle: hideTabBar
            ? [{ display: "none" }, ...commonTabBarStyle]
            : commonTabBarStyle,
        }}
      />

      <Tabs.Screen
        name="transport"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              size={28}
              name="truck-fast-outline"
              color={color}
            />
          ),
          tabBarStyle: hideTabBar
            ? [{ display: "none" }, ...commonTabBarStyle]
            : commonTabBarStyle,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons size={30} name="apps" color={color} />
          ),
          tabBarStyle: commonTabBarStyle,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Ionicons size={26} name="list" color={color} />
          ),
          tabBarStyle: commonTabBarStyle,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather size={26} name="user" color={color} />
          ),
          tabBarStyle: commonTabBarStyle,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: "transparent",
    backgroundColor: "rgba(248, 249, 250, 0.96)",
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});
