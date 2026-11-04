import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="edit" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
