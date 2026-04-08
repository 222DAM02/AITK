import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты образовательный ассистент и ментор. Помогай пользователям с подбором курсов, "
    "учебных материалов, книг по темам. Рекомендуй литературу и составляй учебные планы. "
    "Используй данные из базы знаний для точных рекомендаций."
)

TOPICS = [
    "programming", "mathematics", "physics", "chemistry", "biology",
    "history", "philosophy", "psychology", "economics", "literature",
    "computer science", "data science", "machine learning", "web development",
    "algorithms", "artificial intelligence", "statistics", "networking",
    "cybersecurity", "cloud computing",
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
        messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай книги, факты или авторов, которых нет в контексте. Если в контексте нет нужной информации — честно скажи что в базе нет данных по этой теме.\n\nДанные из базы знаний:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, max_tokens=1024, temperature=0.7)
    return {"text": response.choices[0].message.content, "sources": sources}

def fetch_books_data(topics=None) -> int:
    if topics is None:
        topics = TOPICS
    count = 0
    for topic in topics:
        try:
            r = requests.get(
                f"https://openlibrary.org/search.json?q={topic}&limit=5",
                timeout=15,
            )
            if r.status_code != 200:
                continue
            for book in r.json().get("docs", []):
                title = book.get("title", "").strip()
                if not title or KnowledgeBase.objects.filter(title=title).exists():
                    continue
                authors = ", ".join(book.get("author_name", [])[:3])
                year = book.get("first_publish_year", "")
                subjects = ", ".join(book.get("subject", [])[:5])
                content = f"Книга: {title}\n"
                if authors:
                    content += f"Автор(ы): {authors}\n"
                if year:
                    content += f"Год публикации: {year}\n"
                if subjects:
                    content += f"Темы: {subjects}\n"
                content += f"Категория поиска: {topic}"
                key = book.get("key", "")
                kb = KnowledgeBase.objects.create(
                    title=title, content=content,
                    source=f"https://openlibrary.org{key}" if key else "",
                    category=topic,
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
