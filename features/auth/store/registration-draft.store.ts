import { create } from "zustand";

type RegistrationDraft = {
  firstName: string;
  lastName: string;
  email: string;
  setName: (firstName: string, lastName: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
};

/** Черновик трёх шагов регистрации живёт только в auth-flow; пароли и сессия сюда не попадают. */
export const useRegistrationDraft = create<RegistrationDraft>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  setName: (firstName, lastName) => set({ firstName, lastName }),
  setEmail: (email) => set({ email }),
  reset: () => set({ firstName: "", lastName: "", email: "" }),
}));
