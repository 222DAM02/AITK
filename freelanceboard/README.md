# FreelanceBoard

![Django](https://img.shields.io/badge/Django-5.0-green) ![React](https://img.shields.io/badge/React-18-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan) ![OpenAI](https://img.shields.io/badge/OpenAI-RAG-orange)

**Биржа фрилансеров с заказами и откликами**

---

### Ключевые особенности

| Функция | Описание |
|---------|----------|
| Auth | JWT (access + refresh) |
| Роли | User, Admin |
| Сущность | Заказ (CRUD) + Отклики |
| AI | GPT-3.5 + RAG с embeddings |
| Данные | Парсинг Wikipedia — IT-профессии, веб-разработка (BeautifulSoup) |
| UI | Sidebar + поиск, избранное (★), donut-графики |

### RAG Pipeline

```
Запрос → Embedding (text-embedding-3-small) → Cosine Search → Top-3 контекст → LLM → Ответ + Источники
```

### Скриншоты

#### Главная
![Главная](docs/screenshots/01_home.jpg)

#### Вход
![Вход](docs/screenshots/03_login.jpg)

#### Дашборд с графиком принятия откликов
![Дашборд](docs/screenshots/04_dashboard.jpg)

#### Заказы

| Список заказов | Создание заказа |
|:--------------:|:---------------:|
| ![Список](docs/screenshots/05_list.jpg) | ![Создание](docs/screenshots/06_create.jpg) |

#### Детальная страница (отклики)
![Детальная](docs/screenshots/07_detail.jpg)

#### AI-ассистент (Wizard-стиль)
![AI](docs/screenshots/10_ai_response.jpg)

#### Админ-панель
![Админ](docs/screenshots/12_admin.jpg)

#### Мобильная версия
![Мобильная](docs/screenshots/13_mobile.jpg)

### Быстрый старт

```bash
# + cd frontend && npm run dev → http://localhost:5173
```
