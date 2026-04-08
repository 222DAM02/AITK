import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [mode, setMode] = useState('info') // info | quiz | result
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [startTime, setStartTime] = useState(null)
  // Add question form
  const [newQ, setNewQ] = useState({ text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'a' })

  const load = () => {
    itemsAPI.get(id).then(({ data }) => {
      setItem(data)
      setQuestions(data.questions || [])
      setLoading(false)
    }).catch(() => navigate('/items'))
  }
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }

  const startQuiz = () => { setMode('quiz'); setCurrentQ(0); setAnswers({}); setStartTime(Date.now()) }

  const selectAnswer = (qId, ans) => setAnswers(prev => ({ ...prev, [qId]: ans }))

  const submitQuiz = async () => {
    const time_spent = Math.round((Date.now() - startTime) / 1000)
    try {
      const { data } = await itemsAPI.submitTest(id, { answers, time_spent })
      setResult(data)
      setMode('result')
    } catch {}
  }

  const addQuestion = async (e) => {
    e.preventDefault()
    try {
      await itemsAPI.addQuestion(id, { ...newQ, order: questions.length })
      setNewQ({ text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'a' })
      load()
    } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {mode === 'info' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full difficulty-${item.difficulty}`}>{item.difficulty}</span>
                  <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{item.category}</span>
                  {item.time_limit && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">⏱ {item.time_limit} мин</span>}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Link to={`/items/${id}/edit`} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm">Ред.</Link>
                  <button onClick={handleDelete} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm">Удалить</button>
                </div>
              )}
            </div>
            {item.description && <p className="text-gray-600 mb-4">{item.description}</p>}
            <div className="flex gap-4 text-sm text-gray-400">
              <span>{questions.length} вопросов</span>
              <span>Автор: {item.owner_username}</span>
              {item.avg_score != null && <span>Средний балл: {item.avg_score}</span>}
            </div>
          </div>

          {questions.length > 0 && (
            <button onClick={startQuiz} className={`${s.btnPrimary} w-full py-4 rounded-2xl text-lg font-bold mb-6`}>
              🎯 Начать тест ({questions.length} вопросов)
            </button>
          )}

          {/* Results history */}
          {item.results?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Результаты</h3>
              <div className="space-y-2">
                {item.results.map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium">{r.username}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${r.percentage >= 70 ? 'text-emerald-600' : r.percentage >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {r.score}/{r.total} ({r.percentage}%)
                      </span>
                      <span className="text-xs text-gray-400">{r.time_spent}с</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add question (owner only) */}
          {isOwner && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Добавить вопрос</h3>
              <form onSubmit={addQuestion} className="space-y-3">
                <textarea value={newQ.text} onChange={e => setNewQ({...newQ, text: e.target.value})} placeholder="Текст вопроса" required
                  className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`} rows={2} />
                <div className="grid grid-cols-2 gap-2">
                  {['a','b','c','d'].map(l => (
                    <input key={l} value={newQ[`option_${l}`]} onChange={e => setNewQ({...newQ, [`option_${l}`]: e.target.value})}
                      placeholder={`Вариант ${l.toUpperCase()}`} required={l==='a'||l==='b'}
                      className={`px-3 py-2 rounded-lg border text-sm ${newQ.correct === l ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200'}`} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Правильный:</span>
                  {['a','b','c','d'].map(l => (
                    <button key={l} type="button" onClick={() => setNewQ({...newQ, correct: l})}
                      className={`w-8 h-8 rounded-lg text-sm font-bold ${newQ.correct === l ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{l.toUpperCase()}</button>
                  ))}
                  <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-lg text-sm ml-auto`}>Добавить</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {mode === 'quiz' && questions[currentQ] && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-400">Вопрос {currentQ + 1} из {questions.length}</span>
            <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${s.btnPrimary.split(' ')[0]} rounded-full transition-all`} style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{questions[currentQ].text}</h2>
            <div className="space-y-3">
              {['a','b','c','d'].map(l => {
                const text = questions[currentQ][`option_${l}`]
                if (!text) return null
                const selected = answers[questions[currentQ].id] === l
                return (
                  <button key={l} onClick={() => selectAnswer(questions[currentQ].id, l)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition ${
                      selected ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <span className="font-bold mr-2">{l.toUpperCase()}.</span> {text}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex justify-between">
            {currentQ > 0 && <button onClick={() => setCurrentQ(currentQ - 1)} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm">← Назад</button>}
            <div className="ml-auto">
              {currentQ < questions.length - 1 ? (
                <button onClick={() => setCurrentQ(currentQ + 1)} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Далее →</button>
              ) : (
                <button onClick={submitQuiz} className={`${s.btnPrimary} px-8 py-2.5 rounded-xl text-sm font-bold`}>Завершить ✓</button>
              )}
            </div>
          </div>
        </div>
      )}

      {mode === 'result' && result && (
        <div className="text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
            <span className="text-6xl block mb-4">{result.percentage >= 70 ? '🎉' : result.percentage >= 40 ? '🤔' : '😔'}</span>
            <h2 className="text-3xl font-black text-gray-900 mb-2">{result.score} / {result.total}</h2>
            <p className={`text-xl font-bold ${result.percentage >= 70 ? 'text-emerald-600' : result.percentage >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
              {result.percentage}%
            </p>
            <p className="text-gray-400 mt-2">Время: {result.time_spent} сек</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startQuiz} className={`${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm`}>Пройти заново</button>
            <button onClick={() => setMode('info')} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm">К тесту</button>
          </div>
        </div>
      )}
    </div>
  )
}
