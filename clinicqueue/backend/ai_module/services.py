import requests
import numpy as np
from bs4 import BeautifulSoup
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = "Ты медицинский администратор. Помогай с расписанием врачей, записью на приём и медицинскими специализациями. Используй базу знаний."

def get_embedding(text: str) -> list:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    resp = client.embeddings.create(model="text-embedding-3-small", input=text[:8000])
    return resp.data[0].embedding

def cosine_similarity(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))

def search_knowledge(query: str, top_k: int = 3) -> list:
    entries = list(KnowledgeBase.objects.exclude(embedding__isnull=True))
    if not entries: return []
    query_emb = get_embedding(query)
    scored = [(cosine_similarity(query_emb, e.embedding), e) for e in entries]
    scored.sort(reverse=True, key=lambda x: x[0])
    return [e for _, e in scored[:top_k]]

def generate_ai_response(user_prompt: str) -> dict:
    context_entries = search_knowledge(user_prompt, top_k=3)
    context = "\n\n".join([f"[{e.title}]: {e.content}" for e in context_entries])
    sources = [{"id": e.id, "title": e.title, "source": e.source} for e in context_entries]
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context: messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай информацию. Если данных нет — скажи прямо.\n\nДанные:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=1024, temperature=0.7)
    return {"text": response.choices[0].message.content, "sources": sources}


def _parse_wiki(url, category):
    try:
        r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 (Educational Bot)"})
        if r.status_code != 200: return 0
        soup = BeautifulSoup(r.text, "html.parser")
        title_tag = soup.find("h1", {"id": "firstHeading"})
        title = title_tag.get_text(strip=True) if title_tag else url.split("/wiki/")[-1].replace("_"," ")
        if KnowledgeBase.objects.filter(source=url).exists(): return 0
        cd = soup.find("div", {"class": "mw-parser-output"})
        if not cd: return 0
        paras = [p.get_text(strip=True) for p in cd.find_all("p", recursive=False)[:5] if p.get_text(strip=True) and len(p.get_text(strip=True)) > 50]
        if not paras: return 0
        lists = []
        for ul in cd.find_all("ul", recursive=False)[:2]:
            for li in ul.find_all("li", recursive=False)[:6]:
                t = li.get_text(strip=True)
                if t and len(t) > 10: lists.append(f"• {t[:200]}")
        content = f"Тема: {title}\n\n" + "\n".join(paras[:3])
        if lists: content += "\n\n" + "\n".join(lists[:6])
        content = content[:3000]
        kb = KnowledgeBase.objects.create(title=title, content=content, source=url, category=category)
        try: kb.embedding = get_embedding(content); kb.save(update_fields=["embedding"])
        except: pass
        return 1
    except: return 0

URLS = [
    ('https://en.wikipedia.org/wiki/General_practitioner','therapist'),
    ('https://en.wikipedia.org/wiki/Surgery','surgeon'),
    ('https://en.wikipedia.org/wiki/Dentistry','dentist'),
    ('https://en.wikipedia.org/wiki/Cardiology','cardiologist'),
    ('https://en.wikipedia.org/wiki/Neurology','neurologist'),
    ('https://en.wikipedia.org/wiki/Ophthalmology','ophthalmologist'),
    ('https://en.wikipedia.org/wiki/Dermatology','dermatologist'),
    ('https://en.wikipedia.org/wiki/Pediatrics','pediatrician'),
    ('https://en.wikipedia.org/wiki/Otorhinolaryngology','ent'),
    ('https://en.wikipedia.org/wiki/Orthopedic_surgery','orthopedist'),
    ('https://en.wikipedia.org/wiki/Triage','triage'),
    ('https://en.wikipedia.org/wiki/Medical_record','medical_records'),
]
def fetch_clinic_data() -> int:
    return sum(_parse_wiki(url, cat) for url, cat in URLS)
