import requests
import numpy as np
from openai import OpenAI
from django.conf import settings

from .models import KnowledgeBase

SYSTEM_PROMPT = (
    "Ты языковой ассистент. Помогай пользователям изучать иностранные слова, "
    "составляй списки слов по темам, объясняй грамматику и предлагай примеры использования. "
    "Используй данные из базы знаний для точных ответов."
)

WORDS_TO_FETCH = [
    "hello", "world", "language", "study", "book", "read", "write", "speak",
    "listen", "understand", "knowledge", "learn", "teach", "school", "class",
    "grammar", "vocabulary", "sentence", "word", "phrase", "translate",
    "practice", "exercise", "homework", "exam", "test", "dictionary",
    "alphabet", "consonant", "vowel", "noun", "verb", "adjective", "adverb",
    "pronoun", "preposition", "article", "plural", "singular", "tense",
    "present", "future", "past", "perfect", "irregular", "regular",
    "synonym", "antonym", "idiom", "slang", "formal", "informal",
    "conversation", "dialogue", "accent", "pronunciation", "fluent",
    "beginner", "intermediate", "advanced", "native", "foreign",
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
    scored = []
    for entry in entries:
        score = cosine_similarity(query_emb, entry.embedding)
        scored.append((score, entry))
    scored.sort(reverse=True, key=lambda x: x[0])
    return [e for _, e in scored[:top_k]]


def generate_ai_response(user_prompt: str) -> dict:
    context_entries = search_knowledge(user_prompt, top_k=3)
    context = "\n\n".join([f"[{e.title}]: {e.content}" for e in context_entries])
    sources = [{"id": e.id, "title": e.title, "source": e.source} for e in context_entries]

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
    ]
    if context:
        messages.append({"role": "system", "content": f"СТРОГО: Отвечай ТОЛЬКО на основе данных ниже. НЕ выдумывай информацию, которой нет в контексте. Если данных нет — скажи прямо.\n\nДанные из базы знаний:\n{context}"})
    messages.append({"role": "user", "content": user_prompt})

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=1024,
        temperature=0.7,
    )
    return {
        "text": response.choices[0].message.content,
        "sources": sources,
    }


def fetch_dictionary_data(words: list = None) -> int:
    if words is None:
        words = WORDS_TO_FETCH
    count = 0
    for word in words:
        if KnowledgeBase.objects.filter(title__iexact=word).exists():
            continue
        try:
            resp = requests.get(
                f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}",
                timeout=10,
            )
            if resp.status_code != 200:
                continue
            data = resp.json()
            if not isinstance(data, list) or not data:
                continue
            entry = data[0]
            parts = []
            for meaning in entry.get("meanings", []):
                pos = meaning.get("partOfSpeech", "")
                for defn in meaning.get("definitions", [])[:2]:
                    d = defn.get("definition", "")
                    ex = defn.get("example", "")
                    line = f"({pos}) {d}"
                    if ex:
                        line += f" Example: {ex}"
                    parts.append(line)
            phonetic = ""
            for p in entry.get("phonetics", []):
                if p.get("text"):
                    phonetic = p["text"]
                    break
            content = f"Word: {word}"
            if phonetic:
                content += f" [{phonetic}]"
            content += "\n" + "\n".join(parts)

            synonyms = []
            antonyms = []
            for meaning in entry.get("meanings", []):
                synonyms.extend(meaning.get("synonyms", [])[:3])
                antonyms.extend(meaning.get("antonyms", [])[:3])
            if synonyms:
                content += f"\nSynonyms: {', '.join(synonyms[:5])}"
            if antonyms:
                content += f"\nAntonyms: {', '.join(antonyms[:5])}"

            kb = KnowledgeBase.objects.create(
                title=word,
                content=content,
                source=f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}",
                category="dictionary",
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
