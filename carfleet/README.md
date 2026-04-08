# CarFleet

Управление автопарком с учётом топлива и ТО. Django 5 + React 18 + OpenAI RAG.

**Данные:** NHTSA API — данные по 20 маркам автомобилей

### Запуск

### Что внутри
JWT-авторизация • Роли (user/admin) • CRUD транспорт • Учёт топлива • ТО и страховки • Дашборд • AI с RAG • База знаний • Админ-панель • Мобильная версия

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

#### Автопарк

| Список | Создание |
|:------:|:--------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент с RAG
![AI](docs/screenshots/10_ai_response.jpg)

#### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

### API
`POST /api/auth/login/` • `GET/POST /api/items/` • `POST /api/ai/generate/` • `POST /api/ai/fetch-data/` • `GET /api/ai/knowledge/`
