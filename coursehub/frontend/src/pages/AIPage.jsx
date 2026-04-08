import { useState, useEffect } from 'react'
import { aiAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-3 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

export default function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [sources, setSources] = useState([])
  const [currentQueryId, setCurrentQueryId] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saveTitle, setSaveTitle] = useState('')
  const [saved, setSaved] = useState(false)
  const [kbStats, setKbStats] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [tab, setTab] = useState('chat')
  const [knowledge, setKnowledge] = useState([])
  const [kbSearch, setKbSearch] = useState('')

  useEffect(() => {
    aiAPI.history().then(({ data }) => setHistory((data.results || data).slice(0, 10)))
    loadStats()
  }, [])

  const loadStats = () => { aiAPI.knowledgeStats().then(({ data }) => setKbStats(data)).catch(() => {}) }
  const loadKnowledge = (search = '') => { aiAPI.knowledge({ search }).then(({ data }) => setKnowledge(data.results || data)).catch(() => {}) }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (prompt.trim().length < 3) { setError('Запрос должен быть не менее 3 символов'); return }
    setLoading(true); setError(''); setResult(null); setSources([]); setSaved(false)
    try {
      const { data } = await aiAPI.generate(prompt)
      setResult(data.result)
      setSources(data.sources || [])
      setCurrentQueryId(data.id)
      setHistory(prev => [data, ...prev].slice(0, 10))
    } catch (err) { setError(err.response?.data?.detail || 'Ошибка AI сервиса') }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!saveTitle.trim()) return
    try { await aiAPI.saveAsItem(currentQueryId, saveTitle); setSaved(true) }
    catch { setError('Ошибка сохранения') }
  }

  const handleFetchData = async () => {
    setFetching(true)
    try {
      const { data } = await aiAPI.fetchData()
      loadStats()
      alert(`Загружено ${data.fetched} новых записей. Всего в базе: ${data.total}`)
    } catch (err) { alert('Ошибка загрузки: ' + (err.response?.data?.detail || err.message)) }
    finally { setFetching(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✨</span>
          <h1 className="text-3xl font-bold text-gray-900">{config.aiFeature.title}</h1>
        </div>
        <p className="text-gray-500">{config.aiFeature.description}</p>
      </div>

      {/* KB Stats */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-indigo-500 font-medium uppercase tracking-wider">База знаний</p>
              <p className="text-2xl font-bold text-indigo-700">{kbStats?.total || 0} <span className="text-sm font-normal text-indigo-400">записей</span></p>
            </div>
            <div>
              <p className="text-xs text-indigo-500 font-medium uppercase tracking-wider">С эмбеддингами</p>
              <p className="text-2xl font-bold text-indigo-700">{kbStats?.with_embeddings || 0}</p>
            </div>
          </div>
          <button onClick={handleFetchData} disabled={fetching}
            className={`${s.btnPrimary} px-5 py-2.5 rounded-xl disabled:opacity-50 transition flex items-center gap-2`}>
            {fetching ? <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Загрузка...</> : '📥 Загрузить книги из Open Library'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['chat', '💬 AI-чат с RAG'], ['knowledge', '📚 База знаний']].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); if (key === 'knowledge') loadKnowledge() }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === key ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'chat' && (
        <>
          <form onSubmit={handleGenerate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={config.aiFeature.placeholder}
              className={`${inputClass} min-h-[120px] resize-none`} />
            {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mt-3 text-sm border border-red-100">{error}</div>}
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">AI ответит на основе данных из базы знаний (RAG)</p>
              <button type="submit" disabled={loading}
                className={`${s.btnPrimary} px-6 py-2.5 rounded-xl disabled:opacity-50 transition-colors`}>
                {loading ? <span className="flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />Генерация...</span> : 'Отправить запрос'}
              </button>
            </div>
          </form>

          {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-3">Результат</h2>
              <div className={`${s.accentBg} rounded-xl p-5 whitespace-pre-wrap text-gray-800 leading-relaxed border ${s.accentBorder}`}>{result}</div>
              {sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">📎 Источники из базы знаний:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((src, i) => (
                      <a key={i} href={src.source} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium hover:bg-indigo-100 transition">
                        🔗 {src.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {!saved ? (
                  <div className="flex gap-2">
                    <input value={saveTitle} onChange={e => setSaveTitle(e.target.value)}
                      placeholder={`Название для сохранения как ${config.entityName.toLowerCase()}`}
                      className={`flex-1 ${inputClass}`} />
                    <button onClick={handleSave}
                      className={`${s.btnSuccess} px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap`}>Сохранить</button>
                  </div>
                ) : (
                  <div className="text-emerald-600 font-semibold flex items-center gap-2">✓ Сохранено как {config.entityName.toLowerCase()}!</div>
                )}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">История запросов</h2>
              <ul className="divide-y divide-gray-100">
                {history.map(q => (
                  <li key={q.id} className="py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition"
                    onClick={() => { setPrompt(q.prompt); setResult(q.result); setSources(q.sources || []); setCurrentQueryId(q.id) }}>
                    <p className="text-sm font-medium text-gray-900">{q.prompt}</p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{q.result}</p>
                    {q.sources?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {q.sources.map((src, i) => (
                          <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{src.title}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(q.created_at).toLocaleString('ru')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {tab === 'knowledge' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex gap-3 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)}
              placeholder="Поиск по базе знаний..."
              className={`flex-1 ${inputClass}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)}
              className={`${s.btnPrimary} px-5 py-2.5 rounded-xl`}>Найти</button>
          </div>
          {knowledge.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Нет записей. Нажмите «Загрузить данные» выше.</p>
          ) : (
            <div className="space-y-3">
              {knowledge.map(kb => (
                <div key={kb.id} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">{kb.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{kb.category}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap line-clamp-4">{kb.content}</p>
                  {kb.source && <a href={kb.source} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-indigo-500 hover:text-indigo-700 mt-2 inline-block">🔗 {kb.source}</a>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
