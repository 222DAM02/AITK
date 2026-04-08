import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-lime-400 focus:ring-2 focus:ring-offset-1 focus:border-transparent transition-shadow text-sm`

const typeLabels = {
  strength: 'Силовая', cardio: 'Кардио', flexibility: 'Растяжка', hiit: 'HIIT',
  crossfit: 'Кроссфит', yoga: 'Йога', swimming: 'Плавание', running: 'Бег',
  cycling: 'Велосипед', other: 'Другое',
}
const typeIcons = {
  strength: '🏋️', cardio: '❤️', flexibility: '🧘', hiit: '⚡',
  crossfit: '🔥', yoga: '🧘', swimming: '🏊', running: '🏃',
  cycling: '🚴', other: '💪',
}

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newEx, setNewEx] = useState({ name: '', sets: 3, reps: 10, weight_kg: '' })

  useEffect(() => {
    Promise.all([itemsAPI.get(id), itemsAPI.getExercises(id)])
      .then(([itemRes, exRes]) => {
        setItem(itemRes.data)
        setExercises(exRes.data)
      })
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = user?.id === item?.owner

  const handleDelete = async () => {
    if (!confirm('Удалить тренировку?')) return
    await itemsAPI.delete(id); navigate('/items')
  }

  const handleAddExercise = async (e) => {
    e.preventDefault()
    if (!newEx.name.trim()) return
    const payload = { ...newEx, weight_kg: newEx.weight_kg || null }
    const { data } = await itemsAPI.addExercise(id, payload)
    setExercises(prev => [...prev, data])
    setNewEx({ name: '', sets: 3, reps: 10, weight_kg: '' })
    setShowAdd(false)
  }

  const handleDeleteExercise = async (exId) => {
    await itemsAPI.deleteExercise(id, exId)
    setExercises(prev => prev.filter(e => e.id !== exId))
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div></div>
  if (!item) return null

  const totalVolume = exercises.reduce((sum, ex) => sum + (ex.sets * ex.reps * (parseFloat(ex.weight_kg) || 0)), 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">← Назад к тренировкам</Link>

      {/* Workout info */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{typeIcons[item.workout_type] || '💪'}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{typeLabels[item.workout_type]}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{item.title}</h1>
            {item.description && <p className="text-gray-500 text-sm">{item.description}</p>}
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm`}>Редактировать</Link>
              <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-xl text-sm`}>Удалить</button>
            </div>
          )}
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-50 text-sm">
          {item.duration_minutes && (
            <div><span className="text-gray-400">Длительность:</span> <span className="font-semibold">{item.duration_minutes} мин</span></div>
          )}
          {item.calories_burned && (
            <div><span className="text-gray-400">Калории:</span> <span className="font-semibold text-orange-500">{item.calories_burned} ккал</span></div>
          )}
          {totalVolume > 0 && (
            <div><span className="text-gray-400">Объём:</span> <span className="font-semibold text-lime-600">{Math.round(totalVolume)} кг</span></div>
          )}
          <div className="ml-auto text-gray-400">{item.owner_username} · {new Date(item.created_at).toLocaleDateString('ru')}</div>
        </div>
      </div>

      {/* Exercises */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Упражнения ({exercises.length})</h2>
          {isOwner && !showAdd && (
            <button onClick={() => setShowAdd(true)} className={`${s.btnPrimary} px-3 py-1.5 rounded-lg text-xs`}>+ Добавить</button>
          )}
        </div>

        {showAdd && (
          <form onSubmit={handleAddExercise} className="p-5 bg-lime-50 border-b border-lime-100">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <input value={newEx.name} onChange={e => setNewEx({...newEx, name: e.target.value})}
                placeholder="Упражнение" className={`${inputClass} col-span-2 sm:col-span-1`} required />
              <input type="number" value={newEx.sets} onChange={e => setNewEx({...newEx, sets: parseInt(e.target.value) || 0})}
                placeholder="Подходы" className={inputClass} min="1" />
              <input type="number" value={newEx.reps} onChange={e => setNewEx({...newEx, reps: parseInt(e.target.value) || 0})}
                placeholder="Повторения" className={inputClass} min="1" />
              <input type="number" step="0.5" value={newEx.weight_kg} onChange={e => setNewEx({...newEx, weight_kg: e.target.value})}
                placeholder="Вес (кг)" className={inputClass} />
              <div className="flex gap-2">
                <button type="submit" className={`${s.btnPrimary} px-3 py-2 rounded-lg text-xs flex-1`}>Добавить</button>
                <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-xs">✕</button>
              </div>
            </div>
          </form>
        )}

        {exercises.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <span className="text-4xl block mb-2">🏋️</span>
            <p className="text-sm">Нет упражнений</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">Упражнение</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Подходы</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Повторения</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold text-center">Вес (кг)</th>
                {isOwner && <th className="px-5 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {exercises.map(ex => (
                <tr key={ex.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{ex.name}</td>
                  <td className="px-5 py-3 text-center text-gray-700">{ex.sets}</td>
                  <td className="px-5 py-3 text-center text-gray-700">{ex.reps}</td>
                  <td className="px-5 py-3 text-center text-gray-700">{ex.weight_kg || '—'}</td>
                  {isOwner && (
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDeleteExercise(ex.id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
