import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты медицинский ассистент. Помогай пользователям с информацией о лекарствах, "
    "дозировках, побочных эффектах и взаимодействиях препаратов. "
    "Используй данные из базы знаний для точных ответов. "
    "Всегда напоминай, что нужно консультироваться с врачом."
)

MEDICATIONS = [
    "ibuprofen", "acetaminophen", "aspirin", "amoxicillin", "metformin",
    "lisinopril", "atorvastatin", "omeprazole", "losartan", "amlodipine",
    "metoprolol", "levothyroxine", "gabapentin", "sertraline", "fluoxetine",
    "tramadol", "prednisone", "cetirizine", "loratadine", "ranitidine",
    "pantoprazole", "ciprofloxacin", "azithromycin", "cephalexin", "doxycycline",
    "naproxen", "diclofenac", "meloxicam", "hydrochlorothiazide", "furosemide",
    "warfarin", "clopidogrel", "rosuvastatin", "simvastatin", "montelukast",
    "albuterol", "methotrexate", "hydroxychloroquine", "colchicine", "insulin",
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

def fetch_medication_data(meds=None) -> int:
    if meds is None:
        meds = MEDICATIONS
    count = 0
    for drug in meds:
        if KnowledgeBase.objects.filter(title__iexact=drug).exists():
            continue
        try:
            r = requests.get(
                f"https://api.fda.gov/drug/label.json?search=openfda.generic_name:{drug}&limit=1",
                timeout=15,
            )
            if r.status_code != 200:
                continue
            results = r.json().get("results", [])
            if not results:
                continue
            label = results[0]
            parts = [f"Препарат: {drug.capitalize()}"]
            for field, name in [
                ("purpose", "Назначение"),
                ("indications_and_usage", "Показания"),
                ("dosage_and_administration", "Дозировка"),
                ("warnings", "Предупреждения"),
                ("adverse_reactions", "Побочные эффекты"),
            ]:
                val = label.get(field, [])
                if val:
                    text = val[0][:500] if isinstance(val, list) else str(val)[:500]
                    parts.append(f"{name}: {text}")
            content = "\n".join(parts)
            kb = KnowledgeBase.objects.create(
                title=drug, content=content,
                source=f"https://api.fda.gov/drug/label.json?search=openfda.generic_name:{drug}",
                category="medication",
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
