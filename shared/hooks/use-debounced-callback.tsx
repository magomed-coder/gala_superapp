import { useEffect, useRef } from "react";

type callbackFn = (...args: any[]) => void;

const useDebouncedCallback = <T extends callbackFn>(func: T, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(func);

  // Обновляем ссылку на функцию при изменении
  useEffect(() => {
    callbackRef.current = func;
  }, [func]);

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
};

export default useDebouncedCallback;
