import { useState, useEffect } from 'react'
import { aiAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function AIPage() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [kbStats, setKbStats] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [tab, setTab] = useState('chat')
  const [knowledge, setKnowledge] = useState([])
  const [kbSearch, setKbSearch] = useState('')

  useEffect(() => {
    aiAPI.history().then(({ data }) => {
      const hist = (data.results || data).slice(0, 10)
      const msgs = []
      hist.reverse().forEach(h => {
        msgs.push({ role: 'user', text: h.prompt, time: h.created_at })
        msgs.push({ role: 'ai', text: h.result, sources: h.sources || [], time: h.created_at, id: h.id })
      })
      setMessages(msgs)
    })
    loadStats()
  }, [])

  const loadStats = () => aiAPI.knowledgeStats().then(({ data }) => setKbStats(data)).catch(() => {})
  const loadKnowledge = (q = '') => aiAPI.knowledge({ search: q }).then(({ data }) => setKnowledge(data.results || data)).catch(() => {})

  const send = async (e) => {
    e.preventDefault()
    if (prompt.trim().length < 3) return
    const userMsg = { role: 'user', text: prompt, time: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    const q = prompt
    setPrompt('')
    setLoading(true)
    try {
      const { data } = await aiAPI.generate(q)
      setMessages(prev => [...prev, { role: 'ai', text: data.result, sources: data.sources || [], time: data.created_at, id: data.id }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Ошибка: ' + (err.response?.data?.detail || 'Сервис недоступен'), sources: [] }])
    }
    setLoading(false)
  }

  const handleFetch = async () => {
    setFetching(true)
    try {
      const { data } = await aiAPI.fetchData()
      loadStats()
      setMessages(prev => [...prev, { role: 'system', text: `Загружено ${data.fetched} новых записей. Всего в базе: ${data.total}` }])
    } catch { setMessages(prev => [...prev, { role: 'system', text: 'Ошибка загрузки данных' }]) }
    setFetching(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{config.aiFeature.title}</h1>
          <p className="text-sm opacity-50 mt-1">{config.aiFeature.description}</p>
        </div>
        <div className="flex gap-2">
          {[['chat', '💬 Чат'], ['knowledge', '📚 База']].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); if (k === 'knowledge') loadKnowledge() }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tab === k ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{l}</button>
          ))}
        </div>
      </div>

      {tab === 'chat' && (
        <>
          {/* KB stats mini bar */}
          <div className="flex items-center justify-between mb-4 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-sm opacity-60">База знаний: <strong>{kbStats?.total || 0}</strong> записей ({kbStats?.with_embeddings || 0} с embeddings)</span>
            <button onClick={handleFetch} disabled={fetching} className={`text-sm ${s.accent} font-medium hover:underline disabled:opacity-50`}>
              {fetching ? 'Загрузка...' : '📥 Загрузить из OpenFDA'}
            </button>
          </div>

          {/* Chat messages */}
          <div className="space-y-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto px-1">
            {messages.length === 0 && (
              <div className="text-center py-16 opacity-30">
                <span className="text-4xl block mb-3">💬</span>
                <p>Задайте вопрос AI-ассистенту</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? s.btnPrimary + ' text-white' :
                  msg.role === 'system' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200 text-sm italic' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                  {msg.sources?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-current/10 flex flex-wrap gap-1">
                      {msg.sources.map((src, j) => (
                        <span key={j} className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded-full">📎 {src.title}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="flex gap-2 sticky bottom-0 bg-white pt-2">
            <input value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={config.aiFeature.placeholder}
              className={`flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm ${s.accentRing} focus:border-transparent`} />
            <button type="submit" disabled={loading} className={`${s.btnPrimary} px-6 py-3 rounded-xl disabled:opacity-50`}>
              ➤
            </button>
          </form>
        </>
      )}

      {tab === 'knowledge' && (
        <div>
          <div className="flex gap-3 mb-4">
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Поиск..."
              className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`}
              onKeyDown={e => e.key === 'Enter' && loadKnowledge(kbSearch)} />
            <button onClick={() => loadKnowledge(kbSearch)} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Найти</button>
          </div>
          <div className="space-y-2">
            {knowledge.length === 0 ? <p className="text-center py-8 opacity-40">Нет записей</p> :
              knowledge.map(kb => (
                <div key={kb.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">{kb.title}</h3>
                    <span className="text-xs opacity-40 bg-gray-100 px-2 py-0.5 rounded-full shrink-0 ml-2">{kb.category}</span>
                  </div>
                  <p className="text-sm opacity-60 mt-1 line-clamp-2">{kb.content}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
