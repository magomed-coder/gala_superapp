import { ScrollAwareTabBar } from "@/shared/components/scroll-aware-tab-bar";
import { ScrollChromeProvider } from "@/shared/lib/navigation/scroll-chrome";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const unstable_settings = { anchor: "services" };

/** Четыре основные задачи: найти, сохранить, проверить заказы и открыть профиль. */
export default function TabLayout() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollChromeProvider>
      <Tabs
        tabBar={(props) => (
          <ScrollAwareTabBar
            {...props}
            collapseOnPaths={["/services", "/orders"]}
          />
        )}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: theme.colors.tabBar.active,
          tabBarInactiveTintColor: theme.colors.tabBar.inactive,
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar.background,
            borderTopColor: theme.colors.border.subtle,
            // Вкладки уже имеют внутренние отступы; safe area добавляется только снизу.
            paddingTop: 0,
            paddingBottom: insets.bottom,
            height: 56 + insets.bottom,
          },
          tabBarLabelStyle: {
            fontSize: theme.typography.fontSize.sm,
            lineHeight: theme.typography.lineHeight.sm,
            fontFamily: theme.typography.fontFamily.regular,
          },
        }}
      >
        {/* Контур и размер иконок постоянны; активная вкладка меняет только цвет иконки и подписи. */}
        <Tabs.Screen
          name="services"
          options={{
            title: "Каталог",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="grid-outline"
                size={theme.components.tabBar.icon}
                color={
                  focused
                    ? theme.colors.tabBar.active
                    : theme.colors.tabBar.inactive
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Закладки",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="bookmark-outline"
                size={theme.components.tabBar.icon}
                color={
                  focused
                    ? theme.colors.tabBar.active
                    : theme.colors.tabBar.inactive
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Заказы",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="clipboard-outline"
                size={theme.components.tabBar.icon}
                color={
                  focused
                    ? theme.colors.tabBar.active
                    : theme.colors.tabBar.inactive
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-outline"
                size={theme.components.tabBar.icon}
                color={
                  focused
                    ? theme.colors.tabBar.active
                    : theme.colors.tabBar.inactive
                }
              />
            ),
          }}
        />
      </Tabs>
    </ScrollChromeProvider>
  );
}
