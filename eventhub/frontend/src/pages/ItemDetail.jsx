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

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const handleRegister = async () => { try { await itemsAPI.registerEvent(id); load() } catch(e) { alert(e.response?.data?.detail || 'Ошибка') } }
  const handleUnregister = async () => { try { await itemsAPI.unregisterEvent(id); load() } catch {} }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const typeLabel = config.entityFields.find(f => f.name === 'event_type')?.options?.find(o => o.value === item.event_type)?.label || ''

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className={`${s.heroGradient} text-white px-6 py-8`}>
          <div className="flex items-center gap-2 mb-2">
            {typeLabel && <span className="bg-white/20 text-sm px-3 py-0.5 rounded-full">{typeLabel}</span>}
            <span className="bg-white/20 text-sm px-3 py-0.5 rounded-full">{item.status}</span>
          </div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
            {item.date && <span>📅 {item.date}</span>}
            {item.time_start && <span>🕐 {item.time_start}</span>}
            {item.location && <span>📍 {item.location}</span>}
          </div>
        </div>

        <div className="p-6">
          {item.description && <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>}

          {/* Registration section */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Участники</p>
                <p className="text-sm text-gray-500">{item.registrations_count || 0} {item.max_participants ? `/ ${item.max_participants}` : ''} зарегистрировано</p>
              </div>
              {user && !isOwner && (
                item.is_registered ? (
                  <button onClick={handleUnregister} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100">Отменить запись</button>
                ) : (
                  <button onClick={handleRegister} className={`${s.btnPrimary} px-6 py-2 rounded-xl text-sm`}>Записаться 🎟️</button>
                )
              )}
            </div>
            {item.registrations?.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t border-gray-200">
                {item.registrations.map(r => (
                  <div key={r.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{r.username}</span>
                    <span className="text-gray-400">{new Date(r.registered_at).toLocaleString('ru')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div><span className="text-gray-400">Стоимость</span><p className="font-medium">{item.is_free ? 'Бесплатно' : `${item.price} ₽`}</p></div>
            <div><span className="text-gray-400">Организатор</span><p className="font-medium">{item.owner_username}</p></div>
          </div>

          {isOwner && (
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200">Редактировать</Link>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm hover:bg-red-100">Удалить</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
