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
  const [bookForm, setBookForm] = useState({ date: '', time_slot: '', complaint: '' })
  const [showBook, setShowBook] = useState(false)

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const book = async (e) => {
    e.preventDefault()
    try { await itemsAPI.bookAppointment(id, bookForm); setShowBook(false); setBookForm({ date: '', time_slot: '', complaint: '' }); load() }
    catch(e) { alert(e.response?.data?.detail || 'Ошибка') }
  }
  const cancelApt = async (aptId) => {
    try { await itemsAPI.updateAppointment(id, aptId, { status: 'cancelled' }); load() } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const specLabel = config.entityFields.find(f=>f.name==='specialization')?.options?.find(o=>o.value===item.specialization)?.label || ''

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl">👨‍⚕️</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            <p className="text-teal-600 font-medium">{specLabel}</p>
            <div className="flex gap-3 mt-2 text-sm text-gray-400">
              {item.cabinet && <span>🚪 Каб. {item.cabinet}</span>}
              {item.experience_years && <span>📋 Стаж {item.experience_years} лет</span>}
              {item.reception_time && <span>🕐 {item.reception_time}</span>}
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${item.status==='available'?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-600'}`}>{item.status}</span>
        </div>
        {item.description && <p className="text-gray-600 text-sm mb-4">{item.description}</p>}

        {item.status === 'available' && (
          <button onClick={() => setShowBook(!showBook)} className={`${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm w-full`}>
            {showBook ? 'Отмена' : '📅 Записаться на приём'}
          </button>
        )}

        {showBook && (
          <form onSubmit={book} className="mt-4 bg-teal-50 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={bookForm.date} onChange={e => setBookForm({...bookForm, date: e.target.value})}
                className="px-3 py-2 rounded-lg border border-teal-200 text-sm" />
              <input type="time" required value={bookForm.time_slot} onChange={e => setBookForm({...bookForm, time_slot: e.target.value})}
                className="px-3 py-2 rounded-lg border border-teal-200 text-sm" />
            </div>
            <textarea value={bookForm.complaint} onChange={e => setBookForm({...bookForm, complaint: e.target.value})}
              placeholder="Жалоба / причина визита" className="w-full px-3 py-2 rounded-lg border border-teal-200 text-sm" rows={2} />
            <button type="submit" className={`${s.btnPrimary} px-5 py-2 rounded-lg text-sm`}>Подтвердить запись</button>
          </form>
        )}

        {isOwner && <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">Ред.</Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">Удалить</button>
        </div>}
      </div>

      {/* Appointments */}
      {item.appointments?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3">Записи на приём</h3>
          <div className="space-y-2">
            {item.appointments.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status==='booked'?'bg-teal-100 text-teal-700':a.status==='completed'?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                  <span className="text-sm ml-2">{a.date} · {a.time_slot} · {a.patient_name}</span>
                </div>
                {a.status === 'booked' && a.patient === user?.id && (
                  <button onClick={() => cancelApt(a.id)} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">Отменить</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
