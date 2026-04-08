# ClinicQueue — Электронная очередь в клинику с записью на приём

## Описание

Электронная очередь в клинику с записью на приём. Полнофункциональное SPA с REST API, AI-модулем и RAG для ответов на основе реальных данных.

## Стек

| Компонент | Технология |
|-----------|------------|
| Backend | Django 5 + DRF |
| Auth | SimpleJWT |
| Frontend | React 18 + Vite + Tailwind |
| AI | OpenAI GPT-3.5 + RAG |
| Embeddings | text-embedding-3-small |
| Данные | Парсинг Wikipedia — 12 медицинских специализаций (BeautifulSoup) |

## Возможности

- Регистрация / авторизация (JWT)
- Роли: User, Admin
- CRUD для сущности: врач
- Запись на приём с выбором даты и времени
- Дашборд с графиками по специализациям
- Избранные врачи (★ закладки)
- AI-ассистент с RAG
- Bottom-навигация на мобильном
- Адаптивный дизайн

## Скриншоты

### Главная
![Главная](docs/screenshots/01_home.jpg)

### Регистрация
![Регистрация](docs/screenshots/02_register.jpg)

### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

### Врачи

| Список врачей | Добавление врача |
|:-------------:|:----------------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

### Детальная страница врача (запись на приём)
![Детальная](docs/screenshots/07_detail.jpg)

### AI-ассистент с RAG

| Ответ AI | База знаний |
|:--------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

## Запуск

```bash
cd backend && python manage.py runserver
cd frontend && npm run dev
```
