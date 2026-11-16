import { useRegistrationDraft } from "@/features/auth/store/registration-draft.store";
import { useEffect } from "react";

/** Очищает несохранённые имя и почту при закрытии всей группы авторизации, сохраняя их между шагами. */
export function useRegistrationDraftLifecycle() {
  useEffect(() => {
    return () => useRegistrationDraft.getState().reset();
  }, []);
}
