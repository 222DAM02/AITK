import requests
import numpy as np
from bs4 import BeautifulSoup
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты инструктор йоги и эксперт по wellness. Помогай пользователям с практикой йоги, "
    "подбирай асаны, составляй последовательности и объясняй технику выполнения. "
    "Используй данные из базы знаний для точных рекомендаций."
)

# Wikipedia pages with yoga poses and concepts
PARSE_URLS = [
    ("https://en.wikipedia.org/wiki/List_of_asanas", "asanas"),
    ("https://en.wikipedia.org/wiki/Surya_Namaskar", "sequence"),
    ("https://en.wikipedia.org/wiki/Pranayama", "breathing"),
    ("https://en.wikipedia.org/wiki/Yoga", "general"),
    ("https://en.wikipedia.org/wiki/Hatha_yoga", "hatha"),
    ("https://en.wikipedia.org/wiki/Vinyasa", "vinyasa"),
    ("https://en.wikipedia.org/wiki/Ashtanga_vinyasa_yoga", "ashtanga"),
    ("https://en.wikipedia.org/wiki/Yin_Yoga", "yin"),
    ("https://en.wikipedia.org/wiki/Meditation", "meditation"),
    ("https://en.wikipedia.org/wiki/Chakra", "philosophy"),
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

def fetch_yoga_data() -> int:
    count = 0
    for url, category in PARSE_URLS:
        title_key = url.split("/wiki/")[-1].replace("_", " ")
        if KnowledgeBase.objects.filter(source=url).exists():
            continue
        try:
            r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 (Educational Bot)"})
            if r.status_code != 200:
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            title_tag = soup.find("h1", {"id": "firstHeading"})
            title = title_tag.get_text(strip=True) if title_tag else title_key

            content_div = soup.find("div", {"class": "mw-parser-output"})
            if not content_div:
                continue

            # Special handling for List of asanas — extract individual poses
            if category == "asanas":
                tables = content_div.find_all("table", {"class": "wikitable"})
                for table in tables[:2]:
                    for row in table.find_all("tr")[1:40]:
                        cells = row.find_all(["td", "th"])
                        if len(cells) >= 2:
                            pose_name = cells[0].get_text(strip=True)
                            pose_desc = cells[1].get_text(strip=True) if len(cells) > 1 else ""
                            if not pose_name or len(pose_name) < 3 or KnowledgeBase.objects.filter(title=pose_name).exists():
                                continue
                            content = f"Асана: {pose_name}\n{pose_desc[:500]}"
                            kb = KnowledgeBase.objects.create(
                                title=pose_name, content=content, source=url, category="pose",
                            )
                            try:
                                kb.embedding = get_embedding(content)
                                kb.save(update_fields=["embedding"])
                            except Exception:
                                pass
                            count += 1
                continue

            # For other pages — extract paragraphs
            paragraphs = []
            for p in content_div.find_all("p", recursive=False)[:6]:
                text = p.get_text(strip=True)
                if text and len(text) > 50:
                    paragraphs.append(text)
            if not paragraphs:
                continue
            content = f"Тема: {title}\n\n" + "\n".join(paragraphs[:4])
            content = content[:3000]
            kb = KnowledgeBase.objects.create(title=title, content=content, source=url, category=category)
            try:
                kb.embedding = get_embedding(content)
                kb.save(update_fields=["embedding"])
            except Exception:
                pass
            count += 1
        except Exception:
            continue
    return count
