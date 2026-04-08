import { useState, useEffect } from 'react'
import { aiAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [sources, setSources] = useState([])
  const [qid, setQid] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kbStats, setKbStats] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [knowledge, setKnowledge] = useState([])
  const [kbSearch, setKbSearch] = useState('')
  const [showKb, setShowKb] = useState(false)

  useEffect(() => {
    aiAPI.history().then(({ data }) => setHistory((data.results || data).slice(0, 10)))
    loadStats()
  }, [])

  const loadStats = () => aiAPI.knowledgeStats().then(({ data }) => setKbStats(data)).catch(() => {})
  const loadKnowledge = (q = '') => aiAPI.knowledge({ search: q }).then(({ data }) => setKnowledge(data.results || data)).catch(() => {})

  const gen = async (e) => {
    e.preventDefault()
    if (prompt.trim().length < 3) return
    setLoading(true); setError(''); setResult(null); setSources([])
    try {
      const { data } = await aiAPI.generate(prompt)
      setResult(data.result); setSources(data.sources || []); setQid(data.id)
      setHistory(prev => [data, ...prev].slice(0, 10))
    } catch (err) { setError(err.response?.data?.detail || 'Ошибка') }
    setLoading(false)
  }

  const handleFetch = async () => {
    setFetching(true)
    try { const { data } = await aiAPI.fetchData(); loadStats(); alert(`Загружено ${data.fetched}. Всего: ${data.total}`) }
    catch {} finally { setFetching(false) }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{config.aiFeature.title}</h1>
        <button onClick={() => { setShowKb(!showKb); if (!showKb) loadKnowledge() }}
          className={`text-sm font-medium ${s.accent}`}>{showKb ? '← Назад к чату' : '📚 База знаний'}</button>
      </div>

      {!showKb ? (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left — input + result */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-3 mb-4 text-sm">
              <span className="opacity-50">База: <strong>{kbStats?.total || 0}</strong> записей</span>
              <button onClick={handleFetch} disabled={fetching} className={`${s.btnPrimary} px-3 py-1 rounded-lg text-xs disabled:opacity-50`}>
                {fetching ? '...' : '📥 Загрузить из Wikipedia'}</button>
            </div>

            <form onSubmit={gen} className="mb-6">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
                placeholder={config.aiFeature.placeholder}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none ${s.accentRing}`} />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <button type="submit" disabled={loading} className={`mt-3 ${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm disabled:opacity-50 w-full`}>
                {loading ? 'Генерация...' : 'Спросить AI'}</button>
            </form>

            {result && (
              <div className={`${s.accentBg} rounded-2xl p-5 border ${s.accentBorder}`}>
                <h3 className="font-bold mb-2">Ответ AI</h3>
                <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-80">{result}</p>
                {sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/10">
                    <p className="text-xs font-semibold mb-1 opacity-50">Источники:</p>
                    {sources.map((src, i) => <span key={i} className={`inline-block ${s.badge} text-xs px-2 py-0.5 rounded-full mr-1 mb-1`}>{src.title}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right — history sidebar */}
          <div className="md:col-span-2">
            <h3 className="font-bold text-sm mb-3 opacity-60">История запросов</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {history.length === 0 ? <p className="text-sm opacity-30 text-center py-8">Пусто</p> :
                history.map(q => (
                  <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-3 cursor-pointer hover:shadow-sm transition text-sm"
                    onClick={() => { setPrompt(q.prompt); setResult(q.result); setSources(q.sources || []); setQid(q.id) }}>
                    <p className="font-medium line-clamp-1">{q.prompt}</p>
                    <p className="opacity-40 line-clamp-1 mt-0.5 text-xs">{q.result}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-3 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Поиск по базе знаний..."
              className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Найти</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {knowledge.length === 0 ? <p className="col-span-2 text-center py-8 opacity-40">Нет записей</p> :
              knowledge.map(kb => (
                <div key={kb.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex justify-between mb-1"><h3 className="font-semibold text-sm">{kb.title}</h3>
                    <span className="text-xs opacity-30">{kb.category}</span></div>
                  <p className="text-xs opacity-50 line-clamp-3">{kb.content}</p></div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
