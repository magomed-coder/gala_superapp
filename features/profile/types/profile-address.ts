/** Адрес локального профиля: только введённые пользователем данные, без вымышленных координат. */
export type ProfileAddress = {
  id: string;
  type: "home" | "work" | "other";
  city: string;
  street: string;
  isDefault: boolean;
};
