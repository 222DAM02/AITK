# LangLearn

> Платформа для изучения иностранных языков с словарными коллекциями и квизами

---

### Технологии

`Django 5` `DRF` `React 18` `Vite` `Tailwind CSS` `OpenAI` `SQLite`

### Данные и AI

Dictionary API (dictionaryapi.dev) — определения, фонетика, примеры

RAG: text-embedding-3-small → cosine similarity → контекст в GPT-3.5

### Основные возможности

- JWT-авторизация (access + refresh)
- Роли: User / Admin
- CRUD: словарная коллекция
- Квизы по словам с результатами
- Дашборд с аналитикой
- AI-чат с RAG
- База знаний с поиском
- Админ-панель
- Адаптивный дизайн

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Регистрация
![Регистрация](docs/screenshots/02_register.jpg)

#### Дашборд
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Список коллекций
![Список](docs/screenshots/05_list.jpg)

#### Детальная страница коллекции
![Детальная](docs/screenshots/07_detail.jpg)

#### Квиз
| Прохождение квиза | Результат |
|:-----------------:|:---------:|
| ![Квиз](docs/screenshots/quiz.jpg) | ![Результат](docs/screenshots/quiz_result.jpg) |

#### AI-ассистент с RAG
| Ответ AI с источниками | База знаний |
|:-----------------------:|:-----------:|
| ![AI](docs/screenshots/10_ai_response.jpg) | ![База](docs/screenshots/11_ai_knowledge.jpg) |

#### Админ-панель
![Админ](docs/screenshots/admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

### Запуск

```bash
# Терминал 1: cd backend && python manage.py runserver
# Терминал 2: cd frontend && npm run dev
```
