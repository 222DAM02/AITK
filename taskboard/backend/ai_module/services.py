import requests
import numpy as np
from bs4 import BeautifulSoup
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты менеджер проектов и эксперт по управлению задачами. Помогай пользователям "
    "организовывать задачи, планировать спринты, создавать чеклисты и приоритизировать работу. "
    "Используй данные из базы знаний для конкретных рекомендаций."
)

# Pages to parse for project management best practices
PARSE_URLS = [
    ("https://en.wikipedia.org/wiki/Scrum_(software_development)", "scrum"),
    ("https://en.wikipedia.org/wiki/Kanban_(development)", "kanban"),
    ("https://en.wikipedia.org/wiki/Agile_software_development", "agile"),
    ("https://en.wikipedia.org/wiki/Project_management", "project_management"),
    ("https://en.wikipedia.org/wiki/Time_management", "time_management"),
    ("https://en.wikipedia.org/wiki/Getting_Things_Done", "gtd"),
    ("https://en.wikipedia.org/wiki/SMART_criteria", "smart"),
    ("https://en.wikipedia.org/wiki/Pomodoro_Technique", "pomodoro"),
    ("https://en.wikipedia.org/wiki/MoSCoW_method", "prioritization"),
    ("https://en.wikipedia.org/wiki/Work_breakdown_structure", "wbs"),
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

def fetch_checklist_data() -> int:
    count = 0
    for url, category in PARSE_URLS:
        title_key = url.split("/wiki/")[-1].replace("_", " ")
        if KnowledgeBase.objects.filter(title__iexact=title_key).exists():
            continue
        try:
            r = requests.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0 (Educational Bot)"})
            if r.status_code != 200:
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            # Get article title
            title_tag = soup.find("h1", {"id": "firstHeading"})
            title = title_tag.get_text(strip=True) if title_tag else title_key
            # Get first paragraphs from the article
            content_div = soup.find("div", {"class": "mw-parser-output"})
            if not content_div:
                continue
            paragraphs = []
            for p in content_div.find_all("p", recursive=False)[:5]:
                text = p.get_text(strip=True)
                if text and len(text) > 50:
                    paragraphs.append(text)
            if not paragraphs:
                continue
            # Also extract list items (key practices/steps)
            lists = []
            for ul in content_div.find_all("ul", recursive=False)[:2]:
                for li in ul.find_all("li", recursive=False)[:8]:
                    li_text = li.get_text(strip=True)
                    if li_text and len(li_text) > 10:
                        lists.append(f"• {li_text[:200]}")
            content = f"Тема: {title}\n\n" + "\n".join(paragraphs[:3])
            if lists:
                content += "\n\nКлючевые пункты:\n" + "\n".join(lists[:8])
            content = content[:3000]
            kb = KnowledgeBase.objects.create(
                title=title, content=content,
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
