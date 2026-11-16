import { getSupabaseClient } from "@/shared/api/supabase/supabase";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { User } from "@/shared/types";

/** Преобразует SDK-сессию в отображаемый профиль; metadata не даёт прав продавца или администратора. */
export function toAppUser(user: AuthUser): User {
  return {
    id: user.id,
    email: user.email ?? "",
    name:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : "",
    role: "customer",
  };
}

/** Регистрирует аккаунт через Supabase; с отключённым Confirm email сервер сразу выдаёт сессию. */
export async function registerWithEmail(input: {
  email: string;
  password: string;
  name: string;
}) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    options: { data: { full_name: input.name.trim() } },
  });
  if (error) throw error;
  if (!data.session)
    throw new Error(
      "Аккаунт создан, но сервер ожидает подтверждение почты. Проверьте настройку Confirm email в Supabase.",
    );
  return data.session;
}

/** Проверяет email и пароль на сервере; не создаёт локальную демонстрационную сессию. */
export async function signInWithEmail(input: {
  email: string;
  password: string;
}) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
  if (error) throw error;
  return data.session;
}

/** Читает только собственный профиль; email берётся из Auth, а не из пользовательских метаданных. */
export async function fetchAccountProfile(authUser: AuthUser): Promise<User> {
  const { data, error } = await getSupabaseClient()
    .from("profiles")
    .select("full_name, phone")
    .eq("id", authUser.id)
    .single();
  if (error) throw error;
  return { ...toAppUser(authUser), name: data.full_name, phone: data.phone };
}

/** Сохраняет отображаемые поля своего профиля; изменение почты и прав не входит в этот запрос. */
export async function saveAccountProfile(
  id: string,
  input: { name: string; phone?: string },
) {
  const { data, error } = await getSupabaseClient()
    .from("profiles")
    .update({ full_name: input.name.trim(), phone: input.phone?.trim() ?? "" })
    .eq("id", id)
    .select("full_name, phone")
    .single();
  if (error) throw error;
  return data;
}

/** Даёт понятное сообщение об ошибке входа без раскрытия токенов или серверного ответа целиком. */
export function authErrorMessage(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? error.code
      : undefined;
  if (code === "invalid_credentials") return "Неверная почта или пароль.";
  if (code === "user_already_exists" || code === "email_exists")
    return "Аккаунт с этой почтой уже существует. Войдите в него.";
  if (code === "weak_password")
    return "Пароль слишком простой. Используйте более сложный пароль.";
  if (
    code === "over_request_rate_limit" ||
    code === "over_email_send_rate_limit"
  )
    return "Слишком много попыток. Попробуйте немного позже.";
  if (code === "email_not_confirmed")
    return "Сервер требует подтверждение почты. Настройка регистрации ещё не применена.";
  if (error instanceof Error && error.message.startsWith("Аккаунт создан"))
    return error.message;
  return "Не удалось выполнить запрос. Проверьте подключение и попробуйте ещё раз.";
}
