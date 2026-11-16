import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import type { User } from "@/shared/types";
import { getSupabaseClient } from "@/shared/api/supabase/supabase";
import {
  fetchAccountProfile,
  registerWithEmail,
  saveAccountProfile,
  signInWithEmail,
  toAppUser,
} from "@/features/auth/api/supabase-auth.api";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initializationError: boolean;
  profileLoaded: boolean;
  profileError: boolean;
  reloadProfile: () => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  initialize: () => Promise<void>;
}

let revision = 0;
let initialization: Promise<void> | null = null;
let subscribed = false;

/** Единственная проекция Supabase-сессии для UI; пароли и токены в Zustand не хранятся. */
export const useAuthStore = create<AuthStore>((set, get) => {
  /** Меняет владельца UI, затем загружает профиль; поздние ответы старой сессии игнорируются. */
  const acceptSession = (session: Session | null) => {
    const current = ++revision;
    const previous = get().user;
    const user = session
      ? previous?.id === session.user.id
        ? { ...previous, email: session.user.email ?? "" }
        : toAppUser(session.user)
      : null;
    set({
      user,
      isAuthenticated: !!user,
      profileLoaded:
        user?.id === previous?.id && !!user ? get().profileLoaded : false,
      profileError: false,
    });
    if (!session) return;
    // Auth callback синхронен: запрос профиля выполняется после освобождения lock SDK.
    setTimeout(() => {
      void fetchAccountProfile(session.user)
        .then((profile) => {
          if (current === revision)
            set({ user: profile, profileLoaded: true, profileError: false });
        })
        .catch(() => {
          if (current === revision) set({ profileError: true });
        });
    }, 0);
  };

  return {
    user: null,
    isAuthenticated: false,
    isInitializing: true,
    initializationError: false,
    profileLoaded: false,
    profileError: false,
    reloadProfile: async () => {
      set({ profileError: false });
      try {
        const { data, error } = await getSupabaseClient().auth.getSession();
        if (error) throw error;
        acceptSession(data.session);
      } catch {
        set({ profileError: true });
      }
    },
    login: async (input) => {
      acceptSession(await signInWithEmail(input));
    },
    register: async (input) => {
      acceptSession(await registerWithEmail(input));
    },
    logout: async () => {
      const { error } = await getSupabaseClient().auth.signOut({
        scope: "local",
      });
      if (error) throw error;
      acceptSession(null);
    },
    updateUser: async (user) => {
      if (get().user?.id !== user.id || !get().profileLoaded)
        throw new Error("Profile is not ready");
      const current = ++revision;
      const saved = await saveAccountProfile(user.id, user);
      if (current === revision && get().user?.id === user.id) {
        set({
          user: { ...get().user!, name: saved.full_name, phone: saved.phone },
        });
      }
    },
    initialize: () => {
      if (initialization) return initialization;
      set({ isInitializing: true, initializationError: false });
      const initialRevision = revision;
      // Даже ошибка создания клиента попадает в catch, а импорт store остаётся безопасным для маршрутов.
      initialization = Promise.resolve()
        .then(() => {
          const supabase = getSupabaseClient();
          if (!subscribed) {
            supabase.auth.onAuthStateChange((_event, session) =>
              acceptSession(session),
            );
            subscribed = true;
          }
          return supabase.auth.getSession();
        })
        .then(({ data, error }) => {
          if (error) throw error;
          if (revision === initialRevision) acceptSession(data.session);
        })
        .catch(() => {
          set({ initializationError: true });
        })
        .finally(() => {
          set({ isInitializing: false });
          initialization = null;
        });
      return initialization;
    },
  };
});
