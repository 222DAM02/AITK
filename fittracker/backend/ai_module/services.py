import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты фитнес-тренер и эксперт по упражнениям. Помогай пользователям с тренировками, "
    "подбирай упражнения, объясняй технику выполнения и составляй программы тренировок. "
    "Используй данные из базы знаний для точных рекомендаций."
)

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

WIKI_TOPICS = [
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Push-up", "chest"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Squat_(exercise)", "legs"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Deadlift", "back"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Bench_press", "chest"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Pull-up_(exercise)", "back"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Plank_(exercise)", "core"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Lunge_(exercise)", "legs"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Biceps_curl", "arms"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Shoulder_press", "shoulders"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Dumbbell", "equipment"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Barbell", "equipment"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Kettlebell", "equipment"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Burpee_(exercise)", "cardio"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Crunch_(exercise)", "core"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Rowing_(exercise)", "back"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Leg_press", "legs"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Triceps", "arms"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Stretching", "flexibility"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/High-intensity_interval_training", "cardio"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Strength_training", "general"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Bodyweight_exercise", "general"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Aerobic_exercise", "cardio"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Muscle_hypertrophy", "general"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Warm-up", "general"),
    ("https://en.wikipedia.org/api/rest_v1/page/summary/Overtraining", "general"),
]

def fetch_exercise_data() -> int:
    count = 0
    # Try Wger API first
    try:
        r = requests.get("https://wger.de/api/v2/exercise/?format=json&language=2&limit=5", timeout=8)
        if r.status_code == 200:
            for ex in r.json().get("results", []):
                name = ex.get("name", "").strip()
                if not name or KnowledgeBase.objects.filter(title__iexact=name).exists():
                    continue
                desc = ex.get("description", "").replace("<p>", "").replace("</p>", "").strip()
                content = f"Упражнение: {name}\n{desc}" if desc else f"Упражнение: {name}"
                kb = KnowledgeBase.objects.create(title=name, content=content, source="https://wger.de", category="exercise")
                try:
                    kb.embedding = get_embedding(content)
                    kb.save(update_fields=["embedding"])
                except Exception:
                    pass
                count += 1
    except Exception:
        pass

    # Wikipedia fitness articles (reliable fallback)
    for url, category in WIKI_TOPICS:
        if KnowledgeBase.objects.filter(source=url).exists():
            continue
        try:
            r = requests.get(url, timeout=10, headers={"User-Agent": "FitTracker/1.0 (Educational Project)"})
            if r.status_code != 200:
                continue
            d = r.json()
            title = d.get("title", "")
            extract = d.get("extract", "")
            if not extract:
                continue
            page_url = d.get("content_urls", {}).get("desktop", {}).get("page", url)
            content = f"Тема: {title}\nКатегория: {category}\n\n{extract}"
            kb = KnowledgeBase.objects.create(title=title, content=content, source=page_url, category=category)
            try:
                kb.embedding = get_embedding(content)
                kb.save(update_fields=["embedding"])
            except Exception:
                pass
            count += 1
        except Exception:
            continue
    return count
