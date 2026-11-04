import { Redirect } from "expo-router";

/** Старая ссылка на полный каталог теперь открывает главную вкладку. */
export default function CategoriesRedirect() {
  return <Redirect href="/(tabs)/services" />;
}
