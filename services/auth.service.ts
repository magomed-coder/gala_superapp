import { api } from "@/shared/api/api";
import { endpoints } from "@/shared/api/apiSlice";

export const AuthService = {
  // AUTH
  register: async (payload: {
    username: string;
    email: string;
    password: string;
  }) => await api.post(endpoints.register, payload),

  login: (payload: { username: string; password: string }) =>
    api.post(endpoints.login, payload),

  refresh: (refresh: string) => api.post(endpoints.refresh, { refresh }),

  logout: () => api.post(endpoints.logout),

  // EMAIL / OTP
  verifyEmail: (payload: { email: string; code: string }) =>
    api.post(endpoints.verifyEmail, payload),

  resendCode: (email: string) => api.post(endpoints.resendCode, { email }),
  // USER
  me: () => api.get(endpoints.me),
  deleteMe: () => api.delete(endpoints.deleteMe),

  changeEmail: (email: string) => api.post(endpoints.changeEmail, { email }),

  changePassword: (payload: { old_password: string; new_password: string }) =>
    api.post(endpoints.changePassword, payload),
};
