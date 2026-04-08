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
  const [tab, setTab] = useState('terminal')
  const [knowledge, setKnowledge] = useState([])
  const [kbSearch, setKbSearch] = useState('')
  const [logs, setLogs] = useState([])

  useEffect(() => {
    aiAPI.history().then(({ data }) => setHistory((data.results || data).slice(0, 10)))
    loadStats()
  }, [])

  const loadStats = () => aiAPI.knowledgeStats().then(({ data }) => setKbStats(data)).catch(() => {})
  const loadKnowledge = (q = '') => aiAPI.knowledge({ search: q }).then(({ data }) => setKnowledge(data.results || data)).catch(() => {})

  const addLog = (type, text) => setLogs(prev => [...prev, { type, text, time: new Date().toLocaleTimeString('ru') }])

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (prompt.trim().length < 3) return
    addLog('cmd', `> ${prompt}`)
    setLoading(true); setError('')
    try {
      const { data } = await aiAPI.generate(prompt)
      setResult(data.result); setSources(data.sources || []); setQid(data.id)
      addLog('out', data.result)
      if (data.sources?.length) addLog('info', `Источники: ${data.sources.map(s => s.title).join(', ')}`)
      setHistory(prev => [data, ...prev].slice(0, 10))
    } catch (err) {
      addLog('err', err.response?.data?.detail || 'Ошибка')
    }
    setLoading(false); setPrompt('')
  }

  const handleFetch = async () => {
    setFetching(true)
    addLog('cmd', '> fetch-data')
    try {
      const { data } = await aiAPI.fetchData()
      addLog('out', `Загружено: ${data.fetched}. Всего: ${data.total}`)
      loadStats()
    } catch { addLog('err', 'Ошибка загрузки') }
    setFetching(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{config.aiFeature.title}</h1>
        <div className="flex gap-2">
          {[['terminal', '> Terminal'], ['knowledge', '📚 База']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); if (k === 'knowledge') loadKnowledge() }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tab === k ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'terminal' && (
        <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-500 ml-2 font-mono">ai-assistant — bash</span>
            <div className="ml-auto flex items-center gap-3 text-xs text-gray-600">
              <span>KB: {kbStats?.total || 0} записей</span>
              <button onClick={handleFetch} disabled={fetching} className="text-green-500 hover:text-green-400 disabled:opacity-50">
                {fetching ? '[loading...]' : '📥 Спарсить техники'}
              </button>
            </div>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-sm min-h-[400px] max-h-[500px] overflow-y-auto space-y-2">
            <p className="text-gray-600"># {config.aiFeature.description}</p>
            <p className="text-gray-600"># Введите запрос ниже</p>
            <p className="text-gray-600">---</p>

            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-gray-600 shrink-0">[{log.time}]</span>
                {log.type === 'cmd' && <span className="text-green-400">{log.text}</span>}
                {log.type === 'out' && <span className="text-gray-300 whitespace-pre-wrap">{log.text}</span>}
                {log.type === 'info' && <span className="text-cyan-400">{log.text}</span>}
                {log.type === 'err' && <span className="text-red-400">{log.text}</span>}
              </div>
            ))}
            {loading && <p className="text-yellow-400 animate-pulse">processing...</p>}
          </div>

          {/* Terminal input */}
          <form onSubmit={handleGenerate} className="flex border-t border-gray-800">
            <span className="text-green-500 px-4 py-3 font-mono text-sm">$</span>
            <input value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={config.aiFeature.placeholder}
              className="flex-1 bg-transparent text-gray-200 py-3 pr-4 font-mono text-sm focus:outline-none placeholder-gray-700" />
          </form>
        </div>
      )}

      {tab === 'knowledge' && (
        <div>
          <div className="flex gap-3 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Поиск..."
              className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Найти</button>
          </div>
          {knowledge.length === 0 ? <p className="text-center py-8 opacity-40">Нет записей</p> :
            <div className="space-y-2">{knowledge.map(kb => (
              <div key={kb.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between"><h3 className="font-semibold text-sm">{kb.title}</h3>
                  <span className="text-xs opacity-40">{kb.category}</span></div>
                <p className="text-sm opacity-50 mt-1 line-clamp-2">{kb.content}</p></div>
            ))}</div>}
        </div>
      )}
    </div>
  )
}
