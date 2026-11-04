# Проектные навыки

В `.agents/skills/` перенесены 18 навыков и их вспомогательные файлы из `paletter_worker_app` (120 файлов). Исходный проект не изменён. `feature-boundaries` адаптирован к фичам ALLIN; остальные пакеты сохранены как в источнике.

Правила выбора и работы закреплены в [AGENTS.md](../AGENTS.md). Перед применением нужно прочитать конкретный `SKILL.md`; наличие навыка не означает установку библиотеки или подключение внешнего сервиса.

| Навык | Когда применять |
| --- | --- |
| [feature-boundaries](../.agents/skills/feature-boundaries/SKILL.md) | Границы фич, владельцы состояния и запросов ALLIN |
| [expo-router](../.agents/skills/expo-router/SKILL.md) | Маршруты и навигация |
| [expo-native-ui](../.agents/skills/expo-native-ui/SKILL.md) | Нативные экраны Expo |
| [expo-design-system](../.agents/skills/expo-design-system/SKILL.md) | Тема, UI-система и согласованность экранов |
| [expo-animation](../.agents/skills/expo-animation/SKILL.md) | Анимации, жесты и haptics |
| [expo-data-fetching](../.agents/skills/expo-data-fetching/SKILL.md) | Запросы и серверное состояние |
| [expo-ui](../.agents/skills/expo-ui/SKILL.md) | Нативные контролы `@expo/ui`, если пакет используется |
| [expo-project-structure](../.agents/skills/expo-project-structure/SKILL.md) | Структура нового проекта; не повод повторно перестраивать ALLIN |
| [expo-dev-client](../.agents/skills/expo-dev-client/SKILL.md) | Development builds |
| [expo-upgrade](../.agents/skills/expo-upgrade/SKILL.md) | Обновление Expo SDK |
| [expo-module](../.agents/skills/expo-module/SKILL.md) | Нативные модули и config plugins |
| [expo-dom](../.agents/skills/expo-dom/SKILL.md) | DOM-компоненты внутри Expo |
| [expo-examples](../.agents/skills/expo-examples/SKILL.md) | Примеры реализации Expo |
| [expo-app-clip](../.agents/skills/expo-app-clip/SKILL.md) | iOS App Clip |
| [expo-brownfield](../.agents/skills/expo-brownfield/SKILL.md) | Встраивание Expo в существующее нативное приложение |
| [expo-web-to-native](../.agents/skills/expo-web-to-native/SKILL.md) | Перенос веб-интерфейса в нативный |
| [supabase](../.agents/skills/supabase/SKILL.md) | Работа с Supabase при соответствующей задаче |
| [supabase-postgres-best-practices](../.agents/skills/supabase-postgres-best-practices/SKILL.md) | SQL и производительность Postgres |

Общие навыки из пользовательской установки Codex, например `emil-design-eng` и `openai-docs`, не дублировались. Правила обмена изменениями с админкой Paletter не относятся к ALLIN и не включены в проектные инструкции.
