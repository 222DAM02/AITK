# Как адаптировать шаблон под новую тему

## Что менять (3 файла + 1 команда)

### 1. Frontend: `frontend/src/theme.config.js`
Измени:
- `projectName` — название проекта
- `projectDescription` — описание
- `entityName` / `entityNamePlural` — название сущности (ед./мн. число)
- `entityFields` — массив полей формы (name, label, type, required)
- `aiFeature` — title, description, placeholder для AI-функции
- `colors` — primary/secondary цвета (названия Tailwind)

### 2. Backend: `backend/items/models.py`
Измени поля модели `Item` между комментариями `ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ`.
Поля `owner`, `title`, `description`, `created_at`, `updated_at` — общие, не трогай.

### 3. Backend: `backend/items/serializers.py`
Обнови список полей в `fields` между комментариями `ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ`.

### 4. Backend: `backend/ai_module/services.py`
Обнови `SYSTEM_PROMPT` под тему.

### 5. Применить миграции
```bash
cd backend
source venv/bin/activate
python manage.py makemigrations items
python manage.py migrate
```

## Пример: тема "Библиотека книг"

### theme.config.js
```js
entityName: "Книга",
entityNamePlural: "Книги",
entityFields: [
  { name: "title", label: "Название", type: "text", required: true },
  { name: "description", label: "Описание", type: "textarea", required: true },
  { name: "author_name", label: "Автор книги", type: "text", required: true },
  { name: "year", label: "Год издания", type: "number" },
  { name: "image_url", label: "Обложка (URL)", type: "url" },
],
aiFeature: {
  title: "AI-помощник по книгам",
  description: "Спросите AI о книгах, авторах или жанрах",
  placeholder: "Например: посоветуй книгу для начинающего программиста",
},
```

### items/models.py
```python
# === ТЕМА-СПЕЦИФИЧНЫЕ ПОЛЯ ===
author_name = models.CharField(max_length=200, blank=True, default='')
year = models.PositiveIntegerField(null=True, blank=True)
image_url = models.URLField(blank=True, default='')
# === КОНЕЦ ===
```

### ai_module/services.py
```python
SYSTEM_PROMPT = "Ты библиотечный ассистент. Помогай с рекомендациями книг."
```
