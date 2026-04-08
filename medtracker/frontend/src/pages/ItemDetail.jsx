import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

const timeLabels = { morning: '🌅 Утро (~08:00)', afternoon: '☀️ День (~13:00)', evening: '🌆 Вечер (~19:00)', night: '🌙 Ночь (~22:00)' }
const categoryIcons = { tablet: '💊', capsule: '💉', syrup: '🍶', injection: '💉', drops: '💧', spray: '🌬️', patch: '🩹', other: '🏥' }
const freqLabels = { once: '1 раз в день', twice: '2 раза в день', three: '3 раза в день', four: '4 раза в день', weekly: '1 раз в неделю', as_needed: 'По необходимости' }

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [todayDoses, setTodayDoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDose, setLoadingDose] = useState({})

  useEffect(() => {
    itemsAPI.get(id)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))

    itemsAPI.today().then(({ data }) => {
      setTodayDoses(data.filter(d => String(d.medication_id) === String(id)))
    })
  }, [id])

  const isOwner = user?.id === item?.owner

  const handleDelete = async () => {
    if (!confirm('Удалить это лекарство?')) return
    await itemsAPI.delete(id); navigate('/items')
  }

  const handleDoseLog = async (dose, doseStatus) => {
    const key = dose.time_of_day
    setLoadingDose(prev => ({ ...prev, [key]: true }))
    try {
      await itemsAPI.logDose(id, { time_of_day: dose.time_of_day, status: doseStatus, date: dose.date })
      setTodayDoses(prev => prev.map(d =>
        d.time_of_day === dose.time_of_day ? { ...d, status: doseStatus } : d
      ))
    } finally { setLoadingDose(prev => ({ ...prev, [key]: false })) }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  if (!item) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">← Назад к лекарствам</Link>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left — Medication details */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{categoryIcons[item.category] || '💊'}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
                  {item.dosage && <p className="text-gray-500 text-sm">{item.dosage}</p>}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {item.is_active ? 'Активен' : 'Завершён'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-400">Частота</span>
                <span className="font-medium text-gray-900">{freqLabels[item.frequency]}</span>
              </div>
              {item.start_date && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Начало</span>
                  <span className="font-medium text-gray-900">{new Date(item.start_date).toLocaleDateString('ru')}</span>
                </div>
              )}
              {item.end_date && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">Окончание</span>
                  <span className="font-medium text-gray-900">{new Date(item.end_date).toLocaleDateString('ru')}</span>
                </div>
              )}
              {item.description && (
                <div className="pt-2">
                  <p className="text-gray-400 text-xs mb-1">Заметки</p>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              )}
            </div>

            {isOwner && (
              <div className="mt-5 pt-4 border-t border-gray-50 flex gap-2">
                <Link to={`/items/${id}/edit`} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm flex-1 text-center`}>Редактировать</Link>
                <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-xl text-sm`}>Удалить</button>
              </div>
            )}
          </div>

          {/* Schedule info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Расписание приёмов</h2>
            {item.schedules?.length > 0 ? (
              <div className="space-y-2">
                {item.schedules.map(sch => (
                  <div key={sch.id} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                    <span className="text-base">{timeLabels[sch.time_of_day]?.split(' ')[0]}</span>
                    <span>{timeLabels[sch.time_of_day]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Расписание не задано</p>
            )}
          </div>
        </div>

        {/* Right — Today's doses */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-1">Сегодня</h2>
            <p className="text-xs text-gray-400 mb-4">{new Date().toLocaleDateString('ru', {weekday:'long', day:'numeric', month:'long'})}</p>

            {todayDoses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Нет приёмов на сегодня</p>
                <p className="text-gray-400 text-xs mt-1">Добавьте расписание при редактировании</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayDoses.map((dose) => {
                  const isTaken = dose.status === 'taken'
                  return (
                    <div key={dose.time_of_day} className={`p-4 rounded-xl transition-colors ${isTaken ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{timeLabels[dose.time_of_day]}</span>
                        {isTaken && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Принято ✓</span>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDoseLog(dose, 'taken')}
                          disabled={loadingDose[dose.time_of_day]}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isTaken ? 'bg-emerald-200 text-emerald-800' : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}>
                          {isTaken ? '✓ Принято' : 'Принял'}
                        </button>
                        {!isTaken && (
                          <button onClick={() => handleDoseLog(dose, 'missed')}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                            Пропустил
                          </button>
                        )}
                        {isTaken && (
                          <button onClick={() => handleDoseLog(dose, 'missed')}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                            Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
