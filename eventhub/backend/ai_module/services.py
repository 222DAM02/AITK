import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты организатор мероприятий. Помогай пользователям планировать события, "
    "учитывай праздники и выходные. Используй данные из базы знаний."
)

COUNTRIES = ["RU", "US", "DE", "FR", "GB", "JP", "CN", "IN", "BR", "KZ"]

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
        messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай информацию. Если данных нет — скажи прямо.\n\nДанные:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=1024, temperature=0.7)
    return {"text": response.choices[0].message.content, "sources": sources}

def fetch_holidays_data() -> int:
    count = 0
    import datetime
    year = datetime.date.today().year
    for country in COUNTRIES:
        try:
            r = requests.get(f"https://date.nager.at/api/v3/PublicHolidays/{year}/{country}", timeout=10)
            if r.status_code != 200:
                continue
            for h in r.json():
                title = f"{h.get('localName', '')} ({country})"
                if KnowledgeBase.objects.filter(title=title).exists():
                    continue
                content = f"Праздник: {h.get('localName', '')}\nМеждународное: {h.get('name', '')}\nСтрана: {country}\nДата: {h.get('date', '')}\nТип: {'Фиксированный' if h.get('fixed') else 'Плавающий'}"
                kb = KnowledgeBase.objects.create(title=title, content=content,
                    source=f"https://date.nager.at/api/v3/PublicHolidays/{year}/{country}", category=country.lower())
                try:
                    kb.embedding = get_embedding(content)
                    kb.save(update_fields=["embedding"])
                except Exception:
                    pass
                count += 1
        except Exception:
            continue
    return count
