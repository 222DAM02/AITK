import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const langFlags = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸', ja: '🇯🇵', zh: '🇨🇳', ko: '🇰🇷', other: '🌐' }
const masteryLabels = { new: 'Новое', learning: 'Изучаю', learned: 'Выучено' }
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 focus:ring-rose-400 focus:ring-2 focus:ring-offset-1 focus:border-transparent transition-shadow`

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddWord, setShowAddWord] = useState(false)
  const [newWord, setNewWord] = useState({ word: '', translation: '', example_sentence: '' })
  const [tab, setTab] = useState('words') // words | quiz
  const [quiz, setQuiz] = useState(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    Promise.all([
      itemsAPI.get(id),
      itemsAPI.getWords(id)
    ]).then(([itemRes, wordsRes]) => {
      setItem(itemRes.data)
      setWords(wordsRes.data)
    }).catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = user?.id === item?.owner

  const handleDelete = async () => {
    if (!confirm('Удалить этот словарь?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  const handleAddWord = async (e) => {
    e.preventDefault()
    if (!newWord.word.trim() || !newWord.translation.trim()) return
    const { data } = await itemsAPI.addWord(id, newWord)
    setWords(prev => [...prev, data])
    setNewWord({ word: '', translation: '', example_sentence: '' })
    setShowAddWord(false)
  }

  const handleDeleteWord = async (wordId) => {
    await itemsAPI.deleteWord(id, wordId)
    setWords(prev => prev.filter(w => w.id !== wordId))
  }

  const handleMastery = async (wordId, mastery) => {
    const { data } = await itemsAPI.updateMastery(id, wordId, mastery)
    setWords(prev => prev.map(w => w.id === wordId ? data : w))
  }

  const startQuiz = async () => {
    try {
      const { data } = await itemsAPI.getQuiz(id)
      setQuiz(data)
      setQuizIndex(0)
      setQuizAnswers([])
      setQuizFinished(false)
      setQuizResult(null)
      setTab('quiz')
    } catch {
      alert('Нужно минимум 4 слова для квиза')
    }
  }

  const answerQuiz = async (selectedIndex) => {
    const current = quiz[quizIndex]
    const isCorrect = selectedIndex === current.correct_index
    const newAnswers = [...quizAnswers, { ...current, selectedIndex, isCorrect }]
    setQuizAnswers(newAnswers)

    if (quizIndex + 1 < quiz.length) {
      setQuizIndex(quizIndex + 1)
    } else {
      setQuizFinished(true)
      const correct = newAnswers.filter(a => a.isCorrect).length
      try {
        const { data } = await itemsAPI.finishQuiz(id, {
          total_questions: newAnswers.length,
          correct_answers: correct
        })
        setQuizResult(data)
      } catch {}
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></div>
    </div>
  )
  if (!item) return null

  const masteryStats = {
    new: words.filter(w => w.mastery === 'new').length,
    learning: words.filter(w => w.mastery === 'learning').length,
    learned: words.filter(w => w.mastery === 'learned').length,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">← Назад к словарям</Link>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{langFlags[item.language] || '🌐'}</span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
              <p className="text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>Редактировать</Link>
              <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-xl text-sm transition-colors`}>Удалить</button>
            </div>
          )}
        </div>

        {/* Mastery bar */}
        <div className="mt-5 flex gap-4 text-sm">
          <span className="mastery-new px-3 py-1 rounded-full font-medium">Новые: {masteryStats.new}</span>
          <span className="mastery-learning px-3 py-1 rounded-full font-medium">Изучаю: {masteryStats.learning}</span>
          <span className="mastery-learned px-3 py-1 rounded-full font-medium">Выучено: {masteryStats.learned}</span>
          <span className="ml-auto text-gray-400">Всего: {words.length} слов</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('words')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === 'words' ? s.btnPrimary : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
          📝 Слова ({words.length})
        </button>
        <button onClick={startQuiz}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${tab === 'quiz' ? s.btnPrimary : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
          🎯 Квиз
        </button>
      </div>

      {/* Words tab */}
      {tab === 'words' && (
        <div>
          {isOwner && (
            <div className="mb-4">
              {!showAddWord ? (
                <button onClick={() => setShowAddWord(true)} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>
                  + Добавить слово
                </button>
              ) : (
                <form onSubmit={handleAddWord} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input value={newWord.word} onChange={e => setNewWord({...newWord, word: e.target.value})}
                      placeholder="Слово" className={inputClass} required />
                    <input value={newWord.translation} onChange={e => setNewWord({...newWord, translation: e.target.value})}
                      placeholder="Перевод" className={inputClass} required />
                    <input value={newWord.example_sentence} onChange={e => setNewWord({...newWord, example_sentence: e.target.value})}
                      placeholder="Пример (необязательно)" className={inputClass} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>Добавить</button>
                    <button type="button" onClick={() => setShowAddWord(false)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-sm hover:bg-gray-200">Отмена</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {words.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-rose-100">
              <span className="text-5xl block mb-4">📭</span>
              <p className="text-gray-400 text-lg">В этом словаре пока нет слов</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-rose-50 border-b border-rose-100">
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Слово</th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Перевод</th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Пример</th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Уровень</th>
                    {isOwner && <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {words.map(w => (
                    <tr key={w.id} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-gray-900">{w.word}</td>
                      <td className="px-5 py-3 text-gray-700">{w.translation}</td>
                      <td className="px-5 py-3 text-gray-500 text-sm italic">{w.example_sentence || '—'}</td>
                      <td className="px-5 py-3">
                        {isOwner ? (
                          <select value={w.mastery} onChange={e => handleMastery(w.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer mastery-${w.mastery}`}>
                            <option value="new">Новое</option>
                            <option value="learning">Изучаю</option>
                            <option value="learned">Выучено</option>
                          </select>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium mastery-${w.mastery}`}>
                            {masteryLabels[w.mastery]}
                          </span>
                        )}
                      </td>
                      {isOwner && (
                        <td className="px-5 py-3">
                          <button onClick={() => handleDeleteWord(w.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Quiz tab */}
      {tab === 'quiz' && quiz && !quizFinished && (
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center">
          <div className="text-sm text-gray-400 mb-2">Вопрос {quizIndex + 1} из {quiz.length}</div>
          <div className="w-full bg-rose-100 rounded-full h-2 mb-6">
            <div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${((quizIndex) / quiz.length) * 100}%` }}></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{quiz[quizIndex].word}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {quiz[quizIndex].options.map((opt, i) => (
              <button key={i} onClick={() => answerQuiz(i)}
                className="p-4 rounded-xl border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 transition-all text-gray-900 font-medium text-lg">
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'quiz' && quizFinished && (
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center">
          <span className="text-6xl block mb-4">{quizResult?.score_percent >= 70 ? '🎉' : '📚'}</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Квиз завершён!</h2>
          <p className="text-4xl font-bold text-rose-600 mb-2">{quizResult?.score_percent || 0}%</p>
          <p className="text-gray-500 mb-6">
            Правильно: {quizAnswers.filter(a => a.isCorrect).length} из {quizAnswers.length}
          </p>

          <div className="space-y-2 text-left max-w-md mx-auto mb-6">
            {quizAnswers.map((a, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm flex justify-between ${a.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
                <span className="font-medium">{a.word}</span>
                <span>{a.isCorrect ? '✓' : `✕ ${a.options[a.correct_index]}`}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={startQuiz} className={`${s.btnPrimary} px-6 py-2.5 rounded-xl transition-colors`}>Пройти снова</button>
            <button onClick={() => setTab('words')} className={`${s.btnSecondary} px-6 py-2.5 rounded-xl transition-colors`}>К словам</button>
          </div>
        </div>
      )}

      {tab === 'quiz' && !quiz && (
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center">
          <span className="text-5xl block mb-4">🎯</span>
          <p className="text-gray-500">Нажмите "Квиз" чтобы начать тест</p>
        </div>
      )}
    </div>
  )
}
