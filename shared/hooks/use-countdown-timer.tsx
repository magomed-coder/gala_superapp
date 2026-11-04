import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

// Ключ для сохранения времени окончания таймера в AsyncStorage
const STORAGE_KEY = "otp_timer_end";

/**
 * Кастомный хук для обратного отсчёта с сохранением состояния между перезапусками приложения.
 * @param defaultMinutes - длительность таймера в минутах (по умолчанию 1 минута)
 * @returns объект с текущим временем, минутами, секундами, состоянием и функцией сброса
 */
export function useCountdownTimer(defaultMinutes: number = 1) {
  // Состояние оставшегося времени в секундах
  const [timeLeft, setTimeLeft] = useState<number>(defaultMinutes * 60);
  // Ссылка на интервал для возможности его очистки
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // useEffect для инициализации таймера при монтировании компонента
  useEffect(() => {
    let endTime: number;

    // Функция инициализации таймера
    const init = async () => {
      // Проверяем, есть ли сохранённое время окончания в AsyncStorage
      const savedEnd = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedEnd) {
        // Если есть, продолжаем отсчёт с сохранённого времени
        endTime = parseInt(savedEnd, 10);
      } else {
        // Если нет, создаём новое время окончания и сохраняем его
        endTime = Date.now() + defaultMinutes * 60 * 1000;
        await AsyncStorage.setItem(STORAGE_KEY, endTime.toString());
      }

      // Обновляем состояние таймера сразу после инициализации
      updateTimer(endTime);
      // Запускаем интервал для обновления каждую секунду
      startInterval(endTime);
    };

    init();

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /**
   * Запуск интервала обновления таймера каждую секунду
   * @param endTime - время окончания таймера (timestamp в ms)
   */
  const startInterval = (endTime: number) => {
    intervalRef.current = setInterval(() => {
      updateTimer(endTime);
    }, 1000);
  };

  /**
   * Обновление состояния таймера
   * @param endTime - время окончания таймера
   */
  const updateTimer = async (endTime: number) => {
    // Вычисляем оставшееся время в секундах
    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setTimeLeft(diff);

    // Если таймер дошёл до нуля — останавливаем интервал и очищаем AsyncStorage
    if (diff === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Сброс таймера на начальное значение
   */
  const resetTimer = async () => {
    // Создаём новое время окончания
    const newEnd = Date.now() + defaultMinutes * 60 * 1000;
    // Сохраняем его в AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEY, newEnd.toString());
    // Обновляем состояние оставшегося времени
    setTimeLeft(defaultMinutes * 60);

    // Очищаем предыдущий интервал, если он есть, и запускаем новый
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval(newEnd);
  };

  // Форматирование времени для UI: минуты и секунды
  const minutes: number = Math.floor(timeLeft / 60);
  const seconds: number = timeLeft % 60;

  // Возвращаем объект с состоянием таймера и функцией сброса
  return {
    timeLeft, // общее время в секундах
    minutes, // минуты
    seconds, // секунды
    isCounting: timeLeft > 0, // идёт ли отсчёт
    resetTimer, // функция для сброса таймера
  };
}

// [Клиент] ──(email)──▶ [Сервер]
//                        │
//                        ▼
//                  [Генерация OTP]
//                        │
//                        ▼
//                [Сохранение в БД/Redis]
//                        │
//                        ▼
//              [Отправка письма (SMTP/Email API)]
//                        │
//                        ▼
//                   [Пользователь]
//                        │
//                        ▼
// [Клиент] ──(email + OTP)──▶ [Сервер]
//                                │
//                                ▼
//                        [Проверка OTP]
//                                │
//          ┌─────────────(валид)─────────────┐
//          ▼                                 ▼
//    [Создание токена/сессии]          [Ошибка: код неверен/истёк]
//          │
//          ▼
//     [Доступ к системе]
