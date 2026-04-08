# StudyNotes

Приложение для ведения учебных конспектов и заметок. Django 5 + React 18 + OpenAI RAG.

**Данные:** Wikipedia REST API — статьи по 25 учебным темам

### Запуск

### Что внутри
JWT-авторизация • Роли (user/admin) • CRUD заметка • Дашборд • AI с RAG • База знаний • Админ-панель • Мобильная версия

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Регистрация и вход

| Регистрация | Вход |
|:-----------:|:----:|
| ![Регистрация](docs/screenshots/02_register.jpg) | ![Вход](docs/screenshots/03_login.jpg) |

#### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Заметки

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

### API
`POST /api/auth/login/` • `GET/POST /api/items/` • `POST /api/ai/generate/` • `POST /api/ai/fetch-data/` • `GET /api/ai/knowledge/`
