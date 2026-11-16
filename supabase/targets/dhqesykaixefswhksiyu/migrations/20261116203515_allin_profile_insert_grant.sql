-- После общего REVOKE явно разрешаем создание только своего профиля.
grant insert(id, full_name, phone, avatar_path) on allin.profiles to authenticated;
