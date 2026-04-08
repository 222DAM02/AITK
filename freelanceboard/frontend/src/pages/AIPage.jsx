import { useState, useEffect } from 'react'
import { aiAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function AIPage() {
  const [step, setStep] = useState(1)
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState(null)
  const [sources, setSources] = useState([])
  const [qid, setQid] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [kbStats, setKbStats] = useState(null)
  const [fetching, setFetching] = useState(false)
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
      setStep(3)
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
      <p className="text-sm opacity-50 mb-8">{config.aiFeature.description}</p>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[{n:1,l:'База знаний'},{n:2,l:'Запрос'},{n:3,l:'Результат'}].map(({n,l}) => (
          <button key={n} onClick={() => { setStep(n); if (n === 1) loadKnowledge() }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${step === n ? s.btnPrimary : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === n ? 'bg-white/20' : 'bg-gray-200'}`}>{n}</span>
            <span className="hidden sm:inline">{l}</span>
          </button>
        ))}
      </div>

      {/* Step 1: Knowledge base */}
      {step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="font-semibold">📚 База знаний</p>
              <p className="text-sm opacity-50">{kbStats?.total || 0} записей, {kbStats?.with_embeddings || 0} с embeddings</p>
            </div>
            <button onClick={handleFetch} disabled={fetching} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm disabled:opacity-50`}>
              {fetching ? 'Загрузка...' : '📥 Спарсить IT-профессии'}</button>
          </div>
          <div className="flex gap-2 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Поиск в базе..."
              className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)} className={`${s.btnPrimary} px-4 py-2.5 rounded-xl text-sm`}>→</button>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {knowledge.length === 0 ? <p className="text-center py-8 opacity-30">Загрузите данные кнопкой выше</p> :
              knowledge.map(kb => (
                <div key={kb.id} className="bg-white rounded-xl border border-gray-100 p-3 text-sm">
                  <div className="flex justify-between"><strong>{kb.title}</strong><span className="opacity-30 text-xs">{kb.category}</span></div>
                  <p className="opacity-50 line-clamp-2 mt-1">{kb.content}</p>
                </div>
              ))}
          </div>
          <button onClick={() => setStep(2)} className={`mt-4 ${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm w-full`}>Далее: задать вопрос →</button>
        </div>
      )}

      {/* Step 2: Ask */}
      {step === 2 && (
        <div>
          <form onSubmit={gen} className="space-y-4">
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={5}
              placeholder={config.aiFeature.placeholder}
              className={`w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm resize-none ${s.accentRing}`} />
            <button type="submit" disabled={loading} className={`${s.btnPrimary} px-8 py-3 rounded-xl text-sm disabled:opacity-50 w-full`}>
              {loading ? 'AI думает...' : 'Получить ответ →'}</button>
          </form>
          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3 opacity-50">Или выберите из истории:</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {history.slice(0, 6).map(q => (
                  <div key={q.id} className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition text-sm"
                    onClick={() => { setPrompt(q.prompt); setResult(q.result); setSources(q.sources || []); setQid(q.id); setStep(3) }}>
                    <p className="line-clamp-1 font-medium">{q.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && result && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <div className={`px-5 py-3 ${s.accentBg} border-b ${s.accentBorder}`}>
              <p className="text-sm font-medium opacity-60">Вопрос: {prompt || history[0]?.prompt}</p>
            </div>
            <div className="p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result}</p>
            </div>
            {sources.length > 0 && (
              <div className="px-5 pb-4 border-t border-gray-50 pt-3">
                <p className="text-xs font-semibold opacity-40 mb-2">📎 Использованные источники:</p>
                <div className="flex flex-wrap gap-1">
                  {sources.map((src, i) => <span key={i} className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{src.title}</span>)}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setResult(null); setPrompt(''); setStep(2) }} className={`${s.btnSecondary} px-5 py-2.5 rounded-xl text-sm flex-1`}>← Новый вопрос</button>
            <button onClick={() => { setStep(1); loadKnowledge() }} className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl text-sm">К базе знаний</button>
          </div>
        </div>
      )}
    </div>
  )
}
