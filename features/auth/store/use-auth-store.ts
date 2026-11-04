import { create } from "zustand";
import { User } from "@/shared/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: false,
  login: (user: User) => {
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (user: User) => {
    set({ user });
  },
  initialize: async () => {
    set({ isInitializing: true });
    // Placeholder initialization: restore session, fetch profile, etc.
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isInitializing: false });
  },
}));
