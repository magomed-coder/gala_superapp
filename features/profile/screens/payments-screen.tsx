import { ProfilePage } from "@/features/profile/components/profile-page";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";

/** Показывает доступность оплаты без формы сбора платёжных данных. */
export default function PaymentsScreen() {
  return (
    <ProfilePage>
      {/* Привязка карт пока недоступна; экран не имитирует платёжный сервис. */}
      <ProfileEmptyState
        icon="card-outline"
        title="Пока нет способов оплаты"
        description="Добавление банковских карт пока недоступно. Здесь появятся ваши сохранённые способы оплаты."
      />
      <ProfileMenuGroup
        items={[
          {
            label: "Вопросы об оплате",
            icon: "help-circle-outline",
            route: "/(tabs)/profile/support",
          },
        ]}
      />
    </ProfilePage>
  );
}
