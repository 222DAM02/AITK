import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full rounded-xl px-4 py-2.5 ${s.input} ${s.accentRing} focus:border-transparent transition-shadow`

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCard, setNewCard] = useState({ front: '', back: '' })
  const [addingCard, setAddingCard] = useState(false)
  // Study mode
  const [studyMode, setStudyMode] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    itemsAPI.get(id)
      .then(({ data }) => { setItem(data); setCards(data.cards || []) })
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить колоду?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  const handleAddCard = async (e) => {
    e.preventDefault()
    if (!newCard.front.trim() || !newCard.back.trim()) return
    const { data } = await itemsAPI.addCard(id, newCard)
    setCards((prev) => [...prev, data])
    setNewCard({ front: '', back: '' })
    setAddingCard(false)
  }

  const handleDeleteCard = async (cardId) => {
    await itemsAPI.deleteCard(id, cardId)
    setCards((prev) => prev.filter((c) => c.id !== cardId))
  }

  const startStudy = () => {
    setStudyMode(true); setCurrentIdx(0); setFlipped(false)
    setCorrect(0); setAnswered(0); setFinished(false)
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setCorrect((c) => c + 1)
    setAnswered((a) => a + 1)
    setFlipped(false)
    if (currentIdx + 1 >= cards.length) {
      setFinished(true)
      itemsAPI.finishStudy(id, {
        cards_total: cards.length,
        cards_correct: correct + (isCorrect ? 1 : 0),
      })
    } else {
      setCurrentIdx((i) => i + 1)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div></div>
  if (!item) return null

  const isOwner = user?.id === item.owner

  // Study mode UI
  if (studyMode && cards.length > 0) {
    if (finished) {
      const score = Math.round((correct / cards.length) * 100)
      return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <span className="text-6xl block mb-4">{score >= 70 ? '🎉' : score >= 40 ? '💪' : '📖'}</span>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Сессия завершена!</h2>
          <p className="text-gray-400 mb-6">Результат: <span className={`font-bold text-xl ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>{score}%</span></p>
          <p className="text-gray-500 mb-8">{correct} из {cards.length} правильно</p>
          <div className="flex justify-center gap-3">
            <button onClick={startStudy} className={`${s.btnPrimary} px-6 py-2.5 rounded-xl`}>Повторить</button>
            <button onClick={() => setStudyMode(false)} className={`${s.btnSecondary} px-6 py-2.5 rounded-xl`}>К колоде</button>
          </div>
        </div>
      )
    }

    const card = cards[currentIdx]
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setStudyMode(false)} className="text-gray-500 text-sm hover:text-gray-300">← Выход</button>
          <span className="text-gray-500 text-sm">{currentIdx + 1} / {cards.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-800 rounded-full h-1 mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1 rounded-full transition-all" style={{ width: `${((currentIdx) / cards.length) * 100}%` }} />
        </div>

        {/* Flip card */}
        <div className="flip-card cursor-pointer mb-8" onClick={() => setFlipped(!flipped)} style={{ minHeight: '240px' }}>
          <div className={`flip-card-inner relative w-full ${flipped ? 'flipped' : ''}`} style={{ minHeight: '240px' }}>
            <div className="flip-card-front absolute inset-0 bg-gray-800 border border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-3">Вопрос</span>
              <p className="text-xl text-gray-100 text-center font-medium">{card.front}</p>
              <span className="text-xs text-gray-600 mt-4">Нажмите, чтобы перевернуть</span>
            </div>
            <div className="flip-card-back absolute inset-0 bg-teal-900/30 border border-teal-500/30 rounded-2xl p-8 flex flex-col items-center justify-center">
              <span className="text-xs text-teal-500 uppercase tracking-wider mb-3">Ответ</span>
              <p className="text-xl text-gray-100 text-center font-medium">{card.back}</p>
            </div>
          </div>
        </div>

        {flipped && (
          <div className="flex gap-3">
            <button onClick={() => handleAnswer(false)} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 py-3 rounded-xl font-medium hover:bg-red-500/30 transition-colors">
              Не знал
            </button>
            <button onClick={() => handleAnswer(true)} className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-3 rounded-xl font-medium hover:bg-emerald-500/30 transition-colors">
              Знал!
            </button>
          </div>
        )}
      </div>
    )
  }

  // Normal view
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-600 hover:text-gray-400 text-sm mb-4 inline-block">← Колоды</Link>

      <div className={`${s.surface} rounded-2xl p-6 mb-6`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{item.title}</h1>
            <p className="text-gray-500 mt-1 text-sm">{item.description}</p>
          </div>
          {cards.length > 0 && (
            <button onClick={startStudy} className={`${s.btnPrimary} px-5 py-2.5 rounded-xl whitespace-nowrap`}>
              Изучать ({cards.length})
            </button>
          )}
        </div>

        <div className="flex gap-4 text-sm text-gray-500">
          <span>{cards.length} карточек</span>
          <span>Автор: <span className={s.accent}>{item.owner_username}</span></span>
          <span>{new Date(item.created_at).toLocaleDateString('ru')}</span>
        </div>

        {isOwner && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
            <Link to={`/items/${id}/edit`} className={`${s.btnSecondary} px-4 py-2 rounded-lg text-sm`}>Редактировать</Link>
            <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-lg text-sm`}>Удалить</button>
          </div>
        )}
      </div>

      {/* Cards list */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-200">Карточки</h2>
        {isOwner && (
          <button onClick={() => setAddingCard(!addingCard)} className={`text-sm ${s.accent} ${s.accentHover}`}>
            {addingCard ? 'Отмена' : '+ Добавить'}
          </button>
        )}
      </div>

      {addingCard && (
        <form onSubmit={handleAddCard} className={`${s.surface} rounded-xl p-4 mb-4`}>
          <input value={newCard.front} onChange={(e) => setNewCard({...newCard, front: e.target.value})}
            placeholder="Вопрос (лицевая сторона)" className={`${inputClass} mb-2`} />
          <input value={newCard.back} onChange={(e) => setNewCard({...newCard, back: e.target.value})}
            placeholder="Ответ (обратная сторона)" className={`${inputClass} mb-3`} />
          <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-lg text-sm`}>Добавить карточку</button>
        </form>
      )}

      {cards.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-3xl block mb-2">📝</span>
          <p className="text-gray-600 text-sm">Карточек пока нет. {isOwner && 'Добавьте первую!'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {cards.map((card, i) => (
            <div key={card.id} className={`${s.surface} rounded-xl p-4 flex justify-between items-center group`}>
              <div className="flex-1 mr-4">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-200 flex-1"><span className="text-gray-600 text-xs mr-1">Q:</span> {card.front}</span>
                  <span className="text-teal-400 flex-1"><span className="text-gray-600 text-xs mr-1">A:</span> {card.back}</span>
                </div>
              </div>
              {isOwner && (
                <button onClick={() => handleDeleteCard(card.id)}
                  className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">✕</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}