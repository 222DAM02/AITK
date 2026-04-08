# TaskBoard

Канбан-доска для управления задачами

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
Парсинг Wikipedia — Scrum, Kanban, Agile, GTD (BeautifulSoup)
```

## Backend

- Django 5 + DRF
- Auth: SimpleJWT
- Models: CustomUser, Item (задача), Comment, KnowledgeBase, AIQuery
- Permissions: IsOwner, IsNotBlocked

## Frontend

- React 18, Vite, Tailwind CSS
- React Router v6, Sidebar навигация
- Context API (AuthContext)
- Axios + interceptors

## RAG

```
1. fetch_data() → парсинг Wikipedia (Scrum, Kanban, Agile...)
2. get_embedding(text) → text-embedding-3-small
3. KnowledgeBase.objects.create(embedding=vector)
4. search_knowledge(query) → cosine_similarity → top-3
5. generate_ai_response(prompt, context) → GPT-3.5
```

## Скриншоты

### Главная
![Главная](docs/screenshots/01_home.jpg)

### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

### Канбан-доска
![Канбан](docs/screenshots/kanban.jpg)

### Задачи

| Создание задачи | Детальная страница |
|:---------------:|:------------------:|
| ![Создание](docs/screenshots/06_create.jpg) | ![Детальная](docs/screenshots/07_detail.jpg) |

### AI-ассистент (Terminal-стиль)

| Ответ AI | База знаний |
|:--------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

## Запуск

```bash
cd backend && python manage.py runserver
cd frontend && npm run dev
```
