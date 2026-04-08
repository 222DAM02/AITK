import requests
import numpy as np
from openai import OpenAI
from django.conf import settings
from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты финансовый консультант. Помогай пользователям с бюджетом, планированием расходов, "
    "инвестициями и финансовой грамотностью. Используй данные из базы знаний — актуальные курсы валют и финансовые советы."
)

CURRENCIES = [
    "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY",
    "TRY", "KZT", "BYN", "UAH", "GEL", "AED", "INR",
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

def fetch_finance_data() -> int:
    count = 0
    # 1. Exchange rates from RUB
    try:
        r = requests.get("https://open.er-api.com/v6/latest/RUB", timeout=15)
        if r.status_code == 200:
            data = r.json()
            rates = data.get("rates", {})
            for cur in CURRENCIES:
                if cur in rates and not KnowledgeBase.objects.filter(title=f"Курс RUB/{cur}", category="exchange_rate").exists():
                    rate = rates[cur]
                    inverse = round(1 / rate, 4) if rate else 0
                    content = f"Курс валют: 1 RUB = {rate} {cur}\n1 {cur} = {inverse} RUB\nДата: {data.get('time_last_update_utc', 'N/A')}"
                    kb = KnowledgeBase.objects.create(
                        title=f"Курс RUB/{cur}", content=content,
                        source="https://open.er-api.com/v6/latest/RUB",
                        category="exchange_rate",
                    )
                    try:
                        kb.embedding = get_embedding(content)
                        kb.save(update_fields=["embedding"])
                    except Exception:
                        pass
                    count += 1
    except Exception:
        pass

    # 2. Exchange rates from USD
    try:
        r = requests.get("https://open.er-api.com/v6/latest/USD", timeout=15)
        if r.status_code == 200:
            data = r.json()
            rates = data.get("rates", {})
            for cur in ["EUR", "GBP", "JPY", "RUB", "CNY", "CHF", "CAD", "AUD"]:
                title = f"Курс USD/{cur}"
                if not KnowledgeBase.objects.filter(title=title, category="exchange_rate").exists():
                    rate = rates.get(cur, 0)
                    content = f"Курс валют: 1 USD = {rate} {cur}\nДата: {data.get('time_last_update_utc', 'N/A')}"
                    kb = KnowledgeBase.objects.create(
                        title=title, content=content,
                        source="https://open.er-api.com/v6/latest/USD",
                        category="exchange_rate",
                    )
                    try:
                        kb.embedding = get_embedding(content)
                        kb.save(update_fields=["embedding"])
                    except Exception:
                        pass
                    count += 1
    except Exception:
        pass

    # 3. Financial tips from Wikipedia
    tips_urls = [
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Personal_finance", "personal_finance"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Budget", "budgeting"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Saving", "saving"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Investment", "investment"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Inflation", "inflation"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Compound_interest", "interest"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Emergency_fund", "emergency_fund"),
        ("https://en.wikipedia.org/api/rest_v1/page/summary/Debt", "debt"),
    ]
    for url, cat in tips_urls:
        if KnowledgeBase.objects.filter(source=url).exists():
            continue
        try:
            r = requests.get(url, timeout=10, headers={"User-Agent": "EduProject/1.0 (Educational)"})
            if r.status_code != 200:
                continue
            d = r.json()
            title = d.get("title", "")
            extract = d.get("extract", "")
            if not extract:
                continue
            page_url = d.get("content_urls", {}).get("desktop", {}).get("page", "")
            kb = KnowledgeBase.objects.create(
                title=title, content=f"Тема: {title}\n\n{extract}",
                source=page_url or url, category=cat,
            )
            try:
                kb.embedding = get_embedding(kb.content)
                kb.save(update_fields=["embedding"])
            except Exception:
                pass
            count += 1
        except Exception:
            continue
    return count
