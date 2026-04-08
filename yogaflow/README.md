# YogaFlow — Библиотека йога-практик с последовательностями асан

## Описание

Библиотека йога-практик с последовательностями асан. Полнофункциональное SPA с REST API, AI-модулем и RAG для ответов на основе реальных данных.

## Стек

| Компонент | Технология |
|-----------|------------|
| Backend | Django 5 + DRF |
| Auth | SimpleJWT |
| Frontend | React 18 + Vite + Tailwind |
| AI | OpenAI GPT-3.5 + RAG |
| Embeddings | text-embedding-3-small |
| Данные | Парсинг Wikipedia — асаны, Хатха, Виньяса (BeautifulSoup) |

## Возможности

- Регистрация / авторизация (JWT)
- Роли: User, Admin
- CRUD для сущности: последовательность
- Режим практики с таймером
- Дашборд со статистикой
- AI-ассистент с RAG (поиск по embeddings → контекст → ответ)
- База знаний (загрузка, поиск, просмотр)
- Админ-панель (пользователи, модерация)
- Адаптивный дизайн

## Скриншоты

### Главная
![Главная](docs/screenshots/01_home.jpg)

### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

### Последовательности

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

### Детальная страница
![Детальная](docs/screenshots/07_detail.jpg)

### AI-ассистент с RAG

| Ответ AI | База знаний |
|:--------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

## Запуск

```bash
cd backend && python manage.py runserver  # API
cd frontend && npm run dev                # UI → http://localhost:5173
```
