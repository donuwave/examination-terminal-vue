# 🎓 Examination Terminal — Frontend

Клиент системы онлайн-экзаменов на Vue 3: личный кабинет студента с курсами и дедлайнами, прохождение тестов с таймером.

**Бэкенд:** [examination-terminal-fastapi](https://github.com/donuwave/examination-terminal-fastapi)

![Статус](https://img.shields.io/badge/статус-в_разработке-orange?style=flat)

> [!NOTE]
> **Сейчас:** реализован сценарий студента.
> **В планах:** экран результатов теста, кабинет преподавателя (курсы, конструктор тестов, открытие доступа, статистика и выгрузка результатов), страницы профиля и оценок, переключатель темы, деплой с демо-аккаунтами.

## Возможности

**Авторизация**
- Вход и регистрация с выбором роли, валидация форм
- Автоматическое обновление access-токена по refresh-токену в интерцепторе
- Защищённые маршруты

**Панель студента**
- Поиск по курсам с дебаунсом
- Список курсов с круговой диаграммой прогресса
- Блок дедлайнов с недельным календарём

**Курс и тесты**
- Страница курса со списком тестов и их статусами
- Запуск теста, таймер с оставшимся временем
- Прохождение: вопросы с вариантами ответов
- Завершение теста и отправка ответов

## Технические детали

- Архитектура по **Feature-Sliced Design**: `app` / `pages` / `widgets` / `features` / `entities` / `shared`
- **TanStack Query** для серверного состояния: кэш, загрузка, ошибки
- **Pinia** с `pinia-plugin-persistedstate` для сессии
- Каждый запрос в `entities/*/api` проходит **валидацию ответа** (Yup) и **конвертацию** из snake_case API в модели фронта
- Axios-интерцепторы: подстановка токена, refresh при `401`, обработка ошибок
- Формы на **VeeValidate + Yup**
- UI на **Vuetify 3** + **Tailwind CSS**, графики на **ECharts**
- Прокси `/api` на бэкенд в Vite dev-сервере

## Стек

![Vue](https://img.shields.io/badge/Vue_3-35495E?style=flat&logo=vue.js&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=flat&logo=vue.js&logoColor=black)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=flat&logo=vuetify&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

Vue 3, TypeScript, Vite, Vue Router, Pinia, TanStack Query, Axios, VeeValidate, Yup, Vuetify 3, Tailwind CSS, ECharts, dayjs

## Запуск

Сначала запусти [бэкенд](https://github.com/donuwave/examination-terminal-fastapi) на `localhost:8000`, фронт проксирует на него запросы `/api`.

```bash
git clone https://github.com/donuwave/examination-terminal-vue.git
cd examination-terminal-vue
npm install
npm run dev
```
