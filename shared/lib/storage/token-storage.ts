import { STORAGE_KEYS } from "@/shared/constants";
import * as SecureStore from "expo-secure-store";

export const saveRefreshToken = async (token: string) =>
  await SecureStore.setItemAsync(STORAGE_KEYS.AUTH.REFRESH, token);

export const getRefreshToken = async () =>
  await SecureStore.getItemAsync(STORAGE_KEYS.AUTH.REFRESH);

export const removeRefreshToken = async () =>
  await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH.REFRESH);

export const saveAccessToken = async (token: string) =>
  await SecureStore.setItemAsync(STORAGE_KEYS.AUTH.ACCESS, token);

export const getAccessToken = async () =>
  await SecureStore.getItemAsync(STORAGE_KEYS.AUTH.ACCESS);

export const removeAccessToken = async () =>
  await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH.ACCESS);

export const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH.ACCESS),
    SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH.REFRESH),
  ]);
};

export const saveAuthTokens = async (
  accessToken: string,
  refreshToken: string
) => {
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.AUTH.ACCESS, accessToken),
    SecureStore.setItemAsync(STORAGE_KEYS.AUTH.REFRESH, refreshToken),
  ]);
};

// Axios (transport)
// → Service (API contract)
// → Store (use-case / business flow)
// → UI (presentation)
