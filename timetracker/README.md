# TimeTracker

> Учёт рабочего времени с таймером и аналитикой

---

### Технологии

`Django 5` `DRF` `React 18` `Vite` `Tailwind CSS` `OpenAI` `SQLite`

### Данные и AI

Парсинг Wikipedia — Pomodoro, Deep Work, Flow (BeautifulSoup)

RAG: text-embedding-3-small → cosine similarity → контекст в GPT-3.5

### Основные возможности

- JWT-авторизация (access + refresh)
- Роли: User / Admin
- CRUD: проект с таймером
- Старт/стоп таймер в один клик
- Почасовые ставки и расчёт заработка
- Дашборд с недельной аналитикой
- AI-чат с RAG (Terminal-стиль)
- База знаний по техникам продуктивности
- Sidebar навигация
- Адаптивный дизайн

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

#### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Проекты

| Список проектов | Создание проекта |
|:---------------:|:----------------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница с записями времени
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент с RAG

| Ответ AI (Terminal) | База знаний |
|:-------------------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

#### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

### Запуск

```bash
# Терминал 1: cd backend && python manage.py runserver
# Терминал 2: cd frontend && npm run dev
```
