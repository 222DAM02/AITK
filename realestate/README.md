# RealEstate

Каталог недвижимости с фильтрами и аналитикой цен

## 🛠 Стек

- **Backend:** Django 5, DRF, SimpleJWT
- **Frontend:** React 18, Vite, Tailwind CSS
- **AI/ML:** OpenAI, text-embedding-3-small, cosine similarity
- **Данные:** Парсинг Wikipedia — ипотека, оценка, аренда (BeautifulSoup)

## 📋 Функционал

**Пользователь:** регистрация, вход, CRUD (объект), цена за м², дашборд, AI-чат, избранное (★)

**Администратор:** управление пользователями, модерация, блокировка

**AI + RAG:** загрузка данных → embeddings → семантический поиск → ответ с источниками

## 📸 Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Вход
![Вход](docs/screenshots/03_login.jpg)

#### Объекты

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница (цена за м²)
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент с RAG
![AI](docs/screenshots/10_ai_response.jpg)

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
- `GET /api/items/my-stats/` — аналитика
- `POST /api/ai/generate/` — AI (RAG)
- `POST /api/ai/fetch-data/` — загрузка данных
- `GET /api/ai/knowledge/` — база знаний
