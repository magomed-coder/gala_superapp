import { AuthService } from "@/features/auth/api/auth.api";
import {
  clearAuthTokens,
  getAccessToken,
  saveAuthTokens,
} from "@/shared/lib/storage/token-storage";

import { create } from "zustand";

export const ROLES = {
  USER: "user",
  PARTNER: "partner",
  MANAGER: "manager",
  SUBADMIN: "subadmin",
} as const;

// тип ролей автоматически выведется
export type UserRole = (typeof ROLES)[keyof typeof ROLES];

interface User {
  id: number;
  email: string;
  role: UserRole;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuth: boolean;
  isEmailVerified: boolean;
  registeredEmail: string | null;
  isRegistrationCompleted: boolean;

  isAuthLoading: boolean; // login / register
  isOtpLoading: boolean; // verify / resend
  isInitializing: boolean; // app start

  isRefreshing: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  changePassword: (payload: {
    old_password: string;
    new_password: string;
  }) => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  initialize: () => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthLoading: false,
  isOtpLoading: false,
  isInitializing: false,

  isAuth: false,
  isEmailVerified: false,
  registeredEmail: null,
  isRegistrationCompleted: false,
  isRefreshing: false,
  error: null,

  // Вход
  login: async (username: string, password: string): Promise<void> => {
    set({ isAuthLoading: true, error: null });

    try {
      const res = await AuthService.login({
        username,
        password,
      });

      const { access, refresh } = res.data;

      await saveAuthTokens(access, refresh);
      set({ accessToken: access, isAuth: true });
      await get().fetchUser();
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "[Login failed]" });
      throw err;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  // Регистрация
  register: async (
    email: string,
    username: string,
    password: string,
  ): Promise<void> => {
    set({ isAuthLoading: true, error: null });
    try {
      await AuthService.register({
        username,
        email,
        password,
      });

      // Сохраняем информацию о зарегистрированном email
      set({
        isRegistrationCompleted: true,
        registeredEmail: email,
        isAuth: false,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "[Registration failed]" });
      throw err;
    } finally {
      set({ isAuthLoading: false });
    }
  },

  // Выход
  // logout: async () => {
  logout: async (): Promise<void> => {
    // await AuthService.logout();
    await clearAuthTokens();
    set({
      accessToken: null,
      user: null,
      isAuth: false,
      isRegistrationCompleted: false,
      registeredEmail: null,
    });
  },

  // Подгрузка данных пользователя
  fetchUser: async (): Promise<void> => {
    try {
      const res = await AuthService.me();
      set({ user: res.data });
    } catch (err: any) {
      console.error("[ERROR fetchUser]", err);
      throw err;
    }
  },

  // Инициализация при старте приложения
  initialize: async (): Promise<void> => {
    set({ isInitializing: true });

    const token = await getAccessToken();
    if (!token) {
      set({ isInitializing: false });
      return;
    }

    try {
      set({ accessToken: token });
      await get().fetchUser();
      set({ isAuth: true });
    } catch {
      await get().logout();
    } finally {
      set({ isInitializing: false });
    }
  },

  changePassword: async (payload: {
    old_password: string;
    new_password: string;
  }): Promise<void> => {
    await AuthService.changePassword(payload);
  },

  changeEmail: async (email: string): Promise<void> => {
    await AuthService.changeEmail(email);
  },

  deleteAccount: async (): Promise<void> => {
    try {
      await AuthService.deleteMe();
      await get().logout();
    } catch (err: any) {
      console.error("[ERROR deleteAccount]", err);
      throw err;
    }
  },

  verifyOtp: async (email: string, code: string): Promise<boolean> => {
    set({ isOtpLoading: true, error: null });
    try {
      await AuthService.verifyEmail({
        email,
        code,
      });

      // Если верификация успешна, обновляем состояние пользователя
      // if (res.data.success && res.data.access && res.data.refresh) {
      //   await saveAuthTokens(res.data.access, res.data.refresh);
      //   set({
      //     accessToken: res.data.access,
      //     isAuth: true,
      //     isRegistrationCompleted: false,
      //     registeredEmail: null,
      //     isEmailVerified: true,
      //   });

      //   // Обновляем данные пользователя
      //   await get().fetchUser();
      // }

      set({
        isEmailVerified: true,
        isRegistrationCompleted: false,
        registeredEmail: null,
      });

      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "[OTP verification failed]" });
      return false;
    } finally {
      set({ isOtpLoading: false });
    }
  },

  resendOtp: async (email: string): Promise<boolean> => {
    set({ isOtpLoading: true, error: null });
    try {
      await AuthService.resendCode(email);
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.detail || "[Resend OTP failed]" });
      return false;
    } finally {
      set({ isOtpLoading: false });
    }
  },

  // Обновление токена
  // refreshAccessToken: async () => {
  //   const refreshToken = await getRefreshToken();
  //   if (!refreshToken) throw new Error("[No refresh token]");

  //   set({ isRefreshing: true });
  //   try {
  //     const res = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  //     const { access, refresh } = res.data;
  //     await saveAuthTokens(access, refresh);

  //     set({ accessToken: access, isAuth: true });
  //     return res.data.access;
  //   } catch (err) {
  //     get().logout();
  //     throw err;
  //   } finally {
  //     set({ isRefreshing: false });
  //   }
  // },
}));

// UI (screens/components)
//    ↓
// Store (zustand) — состояние + бизнес-логика
//    ↓
// Service — работа с API
//    ↓
// api (axios) — транспорт
