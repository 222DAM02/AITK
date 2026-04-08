import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты эксперт по автопарку и автомобилям. Помогай с техобслуживанием, "
    "расходом топлива, страховками и управлением транспортом. Используй данные из базы знаний."
)

SAMPLE_MAKES = [
    "Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Volkswagen", "Hyundai",
    "Kia", "Nissan", "Chevrolet", "Audi", "Mazda", "Subaru", "Volvo", "Lexus",
    "Porsche", "Jeep", "Tesla", "Mitsubishi", "Suzuki",
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
        messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай информацию. Если данных нет — скажи прямо.\n\nДанные:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=1024, temperature=0.7)
    return {"text": response.choices[0].message.content, "sources": sources}

def fetch_vehicle_data() -> int:
    count = 0
    # Fetch makes and models from NHTSA
    for make in SAMPLE_MAKES:
        if KnowledgeBase.objects.filter(title__iexact=make, category="make").exists():
            continue
        try:
            r = requests.get(
                f"https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{make}?format=json",
                timeout=15,
            )
            if r.status_code != 200:
                continue
            data = r.json()
            models_list = [m.get("Model_Name", "") for m in data.get("Results", [])[:15] if m.get("Model_Name")]
            content = f"Производитель: {make}\nМодели: {', '.join(models_list)}\nВсего моделей: {data.get('Count', 0)}"
            kb = KnowledgeBase.objects.create(title=make, content=content,
                source=f"https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{make}", category="make")
            try:
                kb.embedding = get_embedding(content)
                kb.save(update_fields=["embedding"])
            except Exception:
                pass
            count += 1
        except Exception:
            continue
    # Also fetch some Wikipedia articles
    wiki_topics = [
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Vehicle_maintenance", "maintenance"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Fuel_economy_in_automobiles", "fuel"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Vehicle_insurance", "insurance"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Automobile_safety", "safety"),
    ]
    for url, cat in wiki_topics:
        if KnowledgeBase.objects.filter(source=url).exists():
            continue
        try:
            r = requests.get(url, timeout=10, headers={"User-Agent": "EduProject/1.0 (Educational)"})
            if r.status_code != 200:
                continue
            d = r.json()
            kb = KnowledgeBase.objects.create(title=d.get("title", ""), content=d.get("extract", ""),
                source=d.get("content_urls", {}).get("desktop", {}).get("page", url), category=cat)
            try:
                kb.embedding = get_embedding(kb.content)
                kb.save(update_fields=["embedding"])
            except Exception:
                pass
            count += 1
        except Exception:
            continue
    return count
