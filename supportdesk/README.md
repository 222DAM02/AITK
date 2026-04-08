# SupportDesk

Тикет-система поддержки с SLA и приоритетами. Django 5 + React 18 + OpenAI RAG.

**Данные:** Парсинг Wikipedia — ITIL, SLA, ITSM (BeautifulSoup)

### Запуск

### Что внутри
JWT-авторизация • Роли (user/admin) • CRUD тикет • Приоритеты и SLA • Комментарии • Смена статусов • Дашборд • AI с RAG (Terminal-стиль) • Sidebar навигация • Мобильная версия

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Вход
![Вход](docs/screenshots/03_login.jpg)

#### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Тикеты

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница (комментарии + статусы)
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент (Terminal)
![AI](docs/screenshots/10_ai_response.jpg)

#### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

### API
`POST /api/auth/login/` • `GET/POST /api/items/` • `POST /api/ai/generate/` • `POST /api/ai/fetch-data/` • `GET /api/ai/knowledge/`
