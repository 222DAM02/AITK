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
  const [showForm, setShowForm] = useState(false)
  const [leaveForm, setLeaveForm] = useState({ leave_type: 'vacation', start_date: '', end_date: '', reason: '' })

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const submitLeave = async (e) => {
    e.preventDefault()
    try { await itemsAPI.addLeave(id, leaveForm); setShowForm(false); setLeaveForm({ leave_type: 'vacation', start_date: '', end_date: '', reason: '' }); load() } catch {}
  }
  const updateLeaveStatus = async (leaveId, status) => {
    try { await itemsAPI.updateLeave(id, leaveId, { status }); load() } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            <p className="text-gray-500 mt-1">{item.position}</p>
          </div>
          <span className={`${s.badge} text-xs px-3 py-1 rounded-full`}>{item.status}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-400">Отдел</span><p className="font-medium">{config.entityFields.find(f=>f.name==='department')?.options?.find(o=>o.value===item.department)?.label || item.department}</p></div>
          <div><span className="text-gray-400">Дата найма</span><p className="font-medium">{item.hire_date || '—'}</p></div>
          <div><span className="text-gray-400">Email</span><p className="font-medium">{item.email || '—'}</p></div>
          <div><span className="text-gray-400">Телефон</span><p className="font-medium">{item.phone || '—'}</p></div>
        </div>
        {item.salary && <p className="mt-4 text-lg font-bold text-indigo-600">{parseFloat(item.salary).toLocaleString('ru')} ₽</p>}
        {isOwner && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">Редактировать</Link>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">Удалить</button>
          </div>
        )}
      </div>

      {/* Leave requests */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Заявки на отпуск</h2>
          <button onClick={() => setShowForm(!showForm)} className={`text-sm ${s.accent} font-medium`}>{showForm ? 'Отмена' : '+ Новая заявка'}</button>
        </div>
        {showForm && (
          <form onSubmit={submitLeave} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <select value={leaveForm.leave_type} onChange={e => setLeaveForm({...leaveForm, leave_type: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm ${s.accentRing}`}>
              <option value="vacation">Отпуск</option><option value="sick">Больничный</option>
              <option value="personal">Личный</option><option value="remote">Удалёнка</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" required value={leaveForm.start_date} onChange={e => setLeaveForm({...leaveForm, start_date: e.target.value})}
                className={`px-3 py-2 rounded-lg border border-gray-200 text-sm ${s.accentRing}`} />
              <input type="date" required value={leaveForm.end_date} onChange={e => setLeaveForm({...leaveForm, end_date: e.target.value})}
                className={`px-3 py-2 rounded-lg border border-gray-200 text-sm ${s.accentRing}`} />
            </div>
            <input value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} placeholder="Причина"
              className={`w-full px-3 py-2 rounded-lg border border-gray-200 text-sm ${s.accentRing}`} />
            <button type="submit" className={`${s.btnPrimary} px-5 py-2 rounded-lg text-sm`}>Отправить</button>
          </form>
        )}
        {(item.leave_requests?.length || 0) === 0 ? <p className="text-gray-400 text-center py-6 text-sm">Нет заявок</p> : (
          <div className="space-y-2">
            {item.leave_requests.map(lr => (
              <div key={lr.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${lr.status==='approved'?'bg-emerald-100 text-emerald-700':lr.status==='rejected'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{lr.status}</span>
                  <span className="text-sm ml-2">{lr.leave_type} · {lr.start_date} — {lr.end_date}</span>
                </div>
                {isOwner && lr.status === 'pending' && (
                  <div className="flex gap-1">
                    <button onClick={() => updateLeaveStatus(lr.id, 'approved')} className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded">✓</button>
                    <button onClick={() => updateLeaveStatus(lr.id, 'rejected')} className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded">✕</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
