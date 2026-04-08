# CourseHub

![Django](https://img.shields.io/badge/Django-5.0-green) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan) ![OpenAI](https://img.shields.io/badge/OpenAI-RAG-orange)

**Образовательная платформа для создания и прохождения курсов с AI-ментором на базе реальных книг.**

---

### Ключевые особенности

| Функция | Описание |
|---------|----------|
| Auth | JWT (access + refresh) |
| Роли | User, Admin |
| Сущность | Курс (CRUD) |
| AI | GPT-3.5 + RAG с embeddings |
| Данные | Open Library API — книги по 20 направлениям |
| UI | Адаптивный дизайн (desktop + mobile) |

### RAG Pipeline

```
Запрос → Embedding (text-embedding-3-small) → Cosine Search → Top-3 контекст → LLM → Ответ + Источники
```

---

## Скриншоты

### Главная страница
![Главная](docs/screenshots/01_home.jpg)

### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

### Личный кабинет (Дашборд)
![Дашборд](docs/screenshots/04_dashboard.jpg)

### Курсы

| Список курсов | Создание курса |
|:-------------:|:--------------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

### Детальная страница курса
![Детальная](docs/screenshots/07_detail.jpg)

### AI-ассистент с RAG

| База знаний загружена | База знаний (список) |
|:---------------------:|:--------------------:|
| ![AI загружено](docs/screenshots/09_ai_loaded.jpg) | ![База знаний](docs/screenshots/11_ai_knowledge.jpg) |

### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

---

## Установка и запуск

```bash
# Первоначальная настройка

# Backend (терминал 1)
cd backend
source /path/to/shared_venv/bin/activate
python manage.py runserver

# Frontend (терминал 2)
cd frontend
npm run dev
```

Открыть http://localhost:5173  
Админ: `admin` / `admin123`

## API Endpoints

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/auth/register/` | Регистрация |
| POST | `/api/auth/login/` | Авторизация (JWT) |
| GET | `/api/auth/profile/` | Профиль пользователя |
| GET/POST | `/api/items/` | Список / создание курсов |
| GET/PUT/DELETE | `/api/items/:id/` | Курс (CRUD) |
| GET | `/api/items/my-stats/` | Статистика |
| POST | `/api/ai/generate/` | AI-генерация (RAG) |
| POST | `/api/ai/fetch-data/` | Загрузка книг из Open Library |
| GET | `/api/ai/knowledge/` | Просмотр базы знаний |
| GET | `/api/ai/knowledge/stats/` | Статистика базы знаний |
