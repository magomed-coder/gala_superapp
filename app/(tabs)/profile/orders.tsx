import { Redirect } from "expo-router";

/** Старый адрес профиля открывает единственный актуальный список заказов. */
export default function ProfileOrdersRoute() {
  return <Redirect href="/(tabs)/orders" />;
}
