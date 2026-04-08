import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты кулинарный ассистент. Помогай пользователям с рецептами, "
    "предлагай блюда, объясняй техники готовки и подбирай ингредиенты. "
    "Используй данные из базы знаний для точных рецептов."
)

MEAL_SEARCHES = [
    "chicken", "beef", "pork", "fish", "salmon", "pasta", "rice",
    "soup", "salad", "cake", "bread", "pizza", "curry", "steak",
    "shrimp", "lamb", "turkey", "egg", "cheese", "potato",
]

def get_embedding(text: str) -> list:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    resp = client.embeddings.create(model="text-embedding-3-small", input=text[:8000])
    return resp.data[0].embedding

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))

def search_knowledge(query: str, top_k: int = 3) -> list:
    entries = list(KnowledgeBase.objects.exclude(embedding__isnull=True))
    if not entries:
        return []
    query_emb = get_embedding(query)
    scored = [(cosine_similarity(query_emb, e.embedding), e) for e in entries]
    scored.sort(reverse=True, key=lambda x: x[0])
    return [e for _, e in scored[:top_k]]

def generate_ai_response(user_prompt: str) -> dict:
    context_entries = search_knowledge(user_prompt, top_k=3)
    context = "\n\n".join([f"[{e.title}]: {e.content}" for e in context_entries])
    sources = [{"id": e.id, "title": e.title, "source": e.source} for e in context_entries]
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context:
        messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай информацию, которой нет в контексте. Если данных нет — скажи прямо.\n\nДанные из базы знаний:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=1024, temperature=0.7)
    return {"text": response.choices[0].message.content, "sources": sources}

def fetch_recipe_data(searches=None) -> int:
    if searches is None:
        searches = MEAL_SEARCHES
    count = 0
    for query in searches:
        try:
            r = requests.get(
                f"https://www.themealdb.com/api/json/v1/1/search.php?s={query}",
                timeout=15,
            )
            if r.status_code != 200:
                continue
            meals = r.json().get("meals") or []
            for meal in meals[:5]:
                name = meal.get("strMeal", "").strip()
                if not name or KnowledgeBase.objects.filter(title=name).exists():
                    continue
                # Collect ingredients
                ingredients = []
                for i in range(1, 21):
                    ing = meal.get(f"strIngredient{i}", "")
                    measure = meal.get(f"strMeasure{i}", "")
                    if ing and ing.strip():
                        ingredients.append(f"{measure.strip()} {ing.strip()}".strip())
                category = meal.get("strCategory", "")
                area = meal.get("strArea", "")
                instructions = meal.get("strInstructions", "")[:1000]
                content = f"Рецепт: {name}\n"
                if category:
                    content += f"Категория: {category}\n"
                if area:
                    content += f"Кухня: {area}\n"
                if ingredients:
                    content += f"Ингредиенты: {', '.join(ingredients)}\n"
                if instructions:
                    content += f"Приготовление: {instructions}"
                kb = KnowledgeBase.objects.create(
                    title=name, content=content,
                    source=f"https://www.themealdb.com/meal/{meal.get('idMeal', '')}",
                    category=category.lower() if category else "recipe",
                )
                try:
                    kb.embedding = get_embedding(content)
                    kb.save(update_fields=["embedding"])
                except Exception:
                    pass
                count += 1
        except Exception:
            continue
    return count
