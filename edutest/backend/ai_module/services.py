import requests
import numpy as np
import html
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты образовательный ассистент и эксперт по тестированию. Помогай создавать тесты, "
    "объясняй ответы и подбирай вопросы по темам. Используй данные из базы знаний."
)

TRIVIA_CATEGORIES = [
    (9, "general"), (17, "science"), (23, "history"), (22, "geography"),
    (19, "math"), (10, "literature"), (18, "computers"), (21, "sports"), (25, "art"),
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

def fetch_trivia_data() -> int:
    count = 0
    for cat_id, cat_name in TRIVIA_CATEGORIES:
        try:
            r = requests.get(f"https://opentdb.com/api.php?amount=10&category={cat_id}&type=multiple", timeout=15)
            if r.status_code != 200:
                continue
            for q in r.json().get("results", []):
                question = html.unescape(q.get("question", ""))
                if not question or KnowledgeBase.objects.filter(title=question[:300]).exists():
                    continue
                correct = html.unescape(q.get("correct_answer", ""))
                incorrect = [html.unescape(a) for a in q.get("incorrect_answers", [])]
                diff = q.get("difficulty", "medium")
                content = f"Вопрос: {question}\nПравильный ответ: {correct}\nНеправильные: {', '.join(incorrect)}\nСложность: {diff}\nКатегория: {cat_name}"
                kb = KnowledgeBase.objects.create(title=question[:300], content=content,
                    source="https://opentdb.com/", category=cat_name)
                try:
                    kb.embedding = get_embedding(content)
                    kb.save(update_fields=["embedding"])
                except Exception:
                    pass
                count += 1
        except Exception:
            continue
    return count
