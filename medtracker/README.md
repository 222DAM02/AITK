# MedTracker

Трекер приёма лекарств с дозировками и расписанием

## 🛠 Стек

- **Backend:** Django 5, DRF, SimpleJWT
- **Frontend:** React 18, Vite, Tailwind CSS
- **AI/ML:** OpenAI, text-embedding-3-small, cosine similarity
- **Данные:** OpenFDA API (api.fda.gov) — 40 препаратов, побочные эффекты

## 📋 Функционал

**Пользователь:** регистрация, вход, CRUD (лекарство), дашборд, AI-чат, история

**Администратор:** управление пользователями, модерация, блокировка

**AI + RAG:** загрузка данных → embeddings → семантический поиск → ответ с источниками

## 📸 Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

#### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Лекарства

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент с RAG

| Ответ AI с источниками | База знаний |
|:-----------------------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

#### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

## 🚀 Запуск

```bash
cd backend && python manage.py runserver
cd frontend && npm run dev
```

## 🔌 API

- `POST /api/auth/register/` — регистрация
- `POST /api/auth/login/` — JWT
- `GET/POST /api/items/` — CRUD
- `POST /api/ai/generate/` — AI (RAG)
- `POST /api/ai/fetch-data/` — загрузка данных
- `GET /api/ai/knowledge/` — база знаний
