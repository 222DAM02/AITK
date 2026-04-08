# HRPortal

HR-система управления персоналом и отпусками

## Архитектура

```
React 18 (Vite + Tailwind)
    ↕ REST API (JSON)
Django 5 (DRF + SimpleJWT)
    ↕ ORM
SQLite
    ↕
AI Module (OpenAI + RAG)
    ↕
Парсинг Wikipedia — HR-практики, трудовое право (BeautifulSoup)
```

## Backend

- Django 5 + DRF
- Auth: SimpleJWT
- Models: CustomUser, Item (сотрудник), LeaveRequest, KnowledgeBase, AIQuery
- Permissions: IsOwner, IsNotBlocked

## Frontend

- React 18, Vite, Tailwind CSS
- React Router v6, Topbar + поиск
- Context API (AuthContext)
- Axios + interceptors

## RAG

```
1. fetch_data() → парсинг Wikipedia (HR, onboarding, трудовое право...)
2. get_embedding(text) → text-embedding-3-small
3. KnowledgeBase.objects.create(embedding=vector)
4. search_knowledge(query) → cosine_similarity → top-3
5. generate_ai_response(prompt, context) → GPT-3.5
```

## Скриншоты

### Главная
![Главная](docs/screenshots/01_home.jpg)

### Вход
![Вход](docs/screenshots/03_login.jpg)

### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

### Сотрудники

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

### Детальная страница (заявки на отпуск)
![Детальная](docs/screenshots/07_detail.jpg)

### AI-ассистент (чат-пузыри)
![AI](docs/screenshots/10_ai_response.jpg)

### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

## Запуск

```bash
cd backend && python manage.py runserver
cd frontend && npm run dev
```
