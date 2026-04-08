import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты учебный ассистент. Помогай пользователям с конспектами, объяснениями тем, "
    "подготовкой к экзаменам и структурированием знаний. "
    "Используй данные из базы знаний для точных и подробных ответов."
)

WIKI_TOPICS = [
    "Python_(programming_language)", "JavaScript", "Machine_learning",
    "Artificial_intelligence", "Database", "Algorithm", "Data_structure",
    "Operating_system", "Computer_network", "Calculus", "Linear_algebra",
    "Statistics", "Quantum_mechanics", "Organic_chemistry", "Cell_biology",
    "World_War_II", "Renaissance", "Philosophy_of_science",
    "Cognitive_psychology", "Microeconomics", "Software_engineering",
    "Cloud_computing", "Computer_security", "Blockchain",
    "Internet_of_things",
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

def fetch_wikipedia_data(topics=None) -> int:
    if topics is None:
        topics = WIKI_TOPICS
    count = 0
    for topic in topics:
        display = topic.replace("_", " ")
        if KnowledgeBase.objects.filter(title__iexact=display).exists():
            continue
        try:
            r = requests.get(
                f"https://en.wikipedia.org/api/rest_v1/page/summary/{topic}",
                timeout=10,
                headers={"User-Agent": "StudyNotes/1.0 (Educational Project)"},
            )
            if r.status_code != 200:
                continue
            data = r.json()
            title = data.get("title", display)
            extract = data.get("extract", "")
            if not extract:
                continue
            page_url = data.get("content_urls", {}).get("desktop", {}).get("page", "")
            content = f"Тема: {title}\n\n{extract}"
            kb = KnowledgeBase.objects.create(
                title=title, content=content,
                source=page_url,
                category="wikipedia",
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
