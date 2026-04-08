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
  const [kbStats, setKbStats] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [tab, setTab] = useState('ask')
  const [knowledge, setKnowledge] = useState([])
  const [kbSearch, setKbSearch] = useState('')

  useEffect(() => {
    aiAPI.history().then(({ data }) => setHistory((data.results || data).slice(0, 10)))
    loadStats()
  }, [])

  const loadStats = () => aiAPI.knowledgeStats().then(({ data }) => setKbStats(data)).catch(() => {})
  const loadKnowledge = (q = '') => aiAPI.knowledge({ search: q }).then(({ data }) => setKnowledge(data.results || data)).catch(() => {})

  const gen = async (e) => {
    e.preventDefault()
    if (prompt.trim().length < 3) return
    setLoading(true); setResult(null); setSources([])
    try {
      const { data } = await aiAPI.generate(prompt)
      setResult(data.result); setSources(data.sources || []); setQid(data.id)
      setHistory(prev => [data, ...prev].slice(0, 10))
    } catch {}
    setLoading(false)
  }

  const handleFetch = async () => {
    setFetching(true)
    try { const { data } = await aiAPI.fetchData(); loadStats(); alert(`Загружено: ${data.fetched}. Всего: ${data.total}`) }
    catch {} finally { setFetching(false) }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">{config.aiFeature.title}</h1>
      <p className="text-sm opacity-50 mb-6">{config.aiFeature.description}</p>

      {/* Top bar: stats + fetch + tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-4 text-sm">
          <span className="opacity-50">📚 <strong>{kbStats?.total || 0}</strong> в базе</span>
          <button onClick={handleFetch} disabled={fetching} className={`${s.btnPrimary} px-3 py-1.5 rounded-lg text-xs disabled:opacity-50`}>
            {fetching ? '...' : '📥 Спарсить недвижимость'}</button>
        </div>
        <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
          {[['ask', '💬 Спросить'], ['history', '📋 История'], ['knowledge', '📚 База']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); if (k === 'knowledge') loadKnowledge() }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${tab === k ? s.btnPrimary : 'text-gray-500 hover:bg-gray-50'}`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'ask' && (
        <div className="space-y-6">
          <form onSubmit={gen}>
            <div className="relative">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
                placeholder={config.aiFeature.placeholder}
                className={`w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm resize-none ${s.accentRing}`} />
              <button type="submit" disabled={loading} className={`absolute bottom-3 right-3 ${s.btnPrimary} px-4 py-2 rounded-xl text-sm disabled:opacity-50`}>
                {loading ? '⏳' : '→'}</button>
            </div>
          </form>

          {result && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`${s.heroGradient} text-white px-5 py-3`}>
                <h3 className="font-semibold text-sm">Ответ AI</h3>
              </div>
              <div className="p-5">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
              </div>
              {sources.length > 0 && (
                <div className="px-5 pb-4 flex flex-wrap gap-2">
                  {sources.map((src, i) => <span key={i} className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>📎 {src.title}</span>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="grid sm:grid-cols-2 gap-3">
          {history.length === 0 ? <p className="col-span-2 text-center py-12 opacity-30">Пусто</p> :
            history.map(q => (
              <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:shadow-sm transition"
                onClick={() => { setTab('ask'); setPrompt(q.prompt); setResult(q.result); setSources(q.sources || []); setQid(q.id) }}>
                <p className="font-medium text-sm line-clamp-1">{q.prompt}</p>
                <p className="text-xs opacity-40 mt-1 line-clamp-2">{q.result}</p>
                <p className="text-xs opacity-30 mt-2">{new Date(q.created_at).toLocaleString('ru')}</p>
              </div>
            ))}
        </div>
      )}

      {tab === 'knowledge' && (
        <div>
          <div className="flex gap-2 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Поиск..."
              className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>→</button>
          </div>
          <div className="space-y-2">
            {knowledge.length === 0 ? <p className="text-center py-8 opacity-30">Нет записей</p> :
              knowledge.map(kb => (
                <details key={kb.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
                  <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium text-sm">{kb.title}</span>
                    <span className="text-xs opacity-30">{kb.category}</span>
                  </summary>
                  <div className="px-4 pb-3 text-sm opacity-60 whitespace-pre-wrap">{kb.content}</div>
                </details>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
