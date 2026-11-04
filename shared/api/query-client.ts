import { clearAuthTokens } from "@/shared/lib/storage/token-storage";
import { QueryClient } from "@tanstack/react-query";
import { refreshToken } from "@/shared/api/api";

/**
 * Настроенный экземпляр QueryClient для React Query.
 *
 * @remarks
 * - При 401 ошибке автоматически пытается обновить токен
 * - Повторяет запрос с новым токеном
 * - Если обновление не удалось, очищает токены и завершает
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 && failureCount === 0) {
          refreshToken().catch(() => {
            clearAuthTokens();
            // window.location.href = "/login";
          });
          return true; // Повторить запрос с новым токеном
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401 && failureCount === 0) {
          clearAuthTokens();
          // window.location.href = "/login";
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
