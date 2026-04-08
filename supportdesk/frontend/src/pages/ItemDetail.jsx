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
  const [comment, setComment] = useState('')

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const addComment = async (e) => { e.preventDefault(); if (!comment.trim()) return; try { await itemsAPI.addComment(id, { text: comment }); setComment(''); load() } catch {} }
  const deleteComment = async (cid) => { try { await itemsAPI.deleteComment(id, cid); load() } catch {} }
  const changeStatus = async (status) => { try { await itemsAPI.update(id, { status }); load() } catch {} }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const priorityColors = { low: 'bg-gray-100 text-gray-600', medium: 'bg-amber-100 text-amber-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${priorityColors[item.priority]}`}>{item.priority}</span>
            <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{item.status}</span>
            {item.is_overdue && <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500 text-white">⚠ SLA нарушен</span>}
          </div>
          <span className="text-xs text-gray-400">#{item.id}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
        {item.description && <p className="text-gray-600 mb-4">{item.description}</p>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><span className="text-gray-400">Категория</span><p className="font-medium">{item.category}</p></div>
          <div><span className="text-gray-400">Автор</span><p className="font-medium">{item.owner_username}</p></div>
          <div><span className="text-gray-400">Назначен</span><p className="font-medium">{item.assigned_username || '—'}</p></div>
          <div><span className="text-gray-400">SLA</span><p className="font-medium">{item.sla_hours ? `${item.sla_hours}ч` : '—'}</p></div>
        </div>

        {/* Status change buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {['open', 'in_progress', 'waiting', 'resolved', 'closed'].map(st => (
            <button key={st} onClick={() => changeStatus(st)} disabled={item.status === st}
              className={`text-xs px-3 py-1.5 rounded-lg transition ${item.status === st ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{st}</button>
          ))}
        </div>

        {isOwner && <div className="flex gap-2 mt-3">
          <Link to={`/items/${id}/edit`} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs">Ред.</Link>
          <button onClick={handleDelete} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs">Удалить</button>
        </div>}
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4">Комментарии ({item.comments?.length || 0})</h3>
        <div className="space-y-3 mb-4">
          {(item.comments || []).map(c => (
            <div key={c.id} className="p-3 rounded-xl bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{c.author_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString('ru')}</span>
                  {c.author === user?.id && <button onClick={() => deleteComment(c.id)} className="text-xs text-red-400 hover:text-red-600">✕</button>}
                </div>
              </div>
              <p className="text-sm text-gray-700">{c.text}</p>
            </div>
          ))}
          {(item.comments?.length || 0) === 0 && <p className="text-gray-400 text-sm text-center py-4">Нет комментариев</p>}
        </div>
        <form onSubmit={addComment} className="flex gap-2">
          <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Добавить комментарий..."
            className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`} />
          <button type="submit" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>→</button>
        </form>
      </div>
    </div>
  )
}
