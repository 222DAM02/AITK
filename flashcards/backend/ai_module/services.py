import requests
import numpy as np
from bs4 import BeautifulSoup
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты ассистент для создания карточек для запоминания. Помогай пользователям "
    "создавать эффективные флеш-карточки, объясняй термины и концепции. "
    "Используй данные из базы знаний для точных определений."
)

# Wikipedia glossary pages to parse
GLOSSARY_URLS = [
    ("https://en.wikipedia.org/wiki/Glossary_of_computer_science", "computer_science"),
    ("https://en.wikipedia.org/wiki/Glossary_of_mathematics", "mathematics"),
    ("https://en.wikipedia.org/wiki/Glossary_of_physics", "physics"),
    ("https://en.wikipedia.org/wiki/Glossary_of_biology", "biology"),
    ("https://en.wikipedia.org/wiki/Glossary_of_chemistry", "chemistry"),
    ("https://en.wikipedia.org/wiki/Glossary_of_economics", "economics"),
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

def fetch_glossary_data() -> int:
    count = 0
    for url, category in GLOSSARY_URLS:
        try:
            r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 (Educational Bot)"})
            if r.status_code != 200:
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            # Wikipedia glossary pages use <dt> for term and <dd> for definition
            dts = soup.find_all("dt")
            for dt in dts[:30]:  # Limit per page
                term = dt.get_text(strip=True)
                if not term or len(term) < 2 or len(term) > 200:
                    continue
                # Get the next <dd> sibling
                dd = dt.find_next_sibling("dd")
                if not dd:
                    continue
                definition = dd.get_text(strip=True)
                if not definition or len(definition) < 10:
                    continue
                if KnowledgeBase.objects.filter(title__iexact=term, category=category).exists():
                    continue
                content = f"Термин: {term}\nОпределение: {definition[:800]}\nКатегория: {category}"
                kb = KnowledgeBase.objects.create(
                    title=term, content=content,
                    source=url, category=category,
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
