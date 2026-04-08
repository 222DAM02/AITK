import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

const priorityConfig = {
  low:      { label: '🟢 Низкий',       cls: 'priority-low' },
  medium:   { label: '🔵 Средний',      cls: 'priority-medium' },
  high:     { label: '🟡 Высокий',      cls: 'priority-high' },
  critical: { label: '🔴 Критический',  cls: 'priority-critical' },
}
const statusConfig = {
  todo:        { label: 'К выполнению', icon: '📋' },
  in_progress: { label: 'В работе',     icon: '⚡' },
  review:      { label: 'На проверке',  icon: '👁️' },
  done:        { label: 'Готово',        icon: '✅' },
}
const STATUS_ORDER = ['todo', 'in_progress', 'review', 'done']

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([itemsAPI.get(id), itemsAPI.getComments(id)])
      .then(([itemRes, commentsRes]) => {
        setItem(itemRes.data)
        setComments(commentsRes.data)
      })
      .catch(() => navigate('/board'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить задачу?')) return
    await itemsAPI.delete(id)
    navigate('/board')
  }

  const handleMove = async (newStatus) => {
    const { data } = await itemsAPI.move(id, newStatus)
    setItem(data)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const { data } = await itemsAPI.addComment(id, newComment.trim())
    setComments(prev => [...prev, data])
    setNewComment('')
  }

  const handleDeleteComment = async (commentId) => {
    await itemsAPI.deleteComment(id, commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
    </div>
  )
  if (!item) return null

  const isOwner = user?.id === item.owner
  const p = priorityConfig[item.priority] || priorityConfig.medium
  const st = statusConfig[item.status] || statusConfig.todo
  const currentIdx = STATUS_ORDER.indexOf(item.status)
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/board" className="text-slate-500 hover:text-slate-300 text-sm mb-6 inline-block transition-colors">
        ← Назад к доске
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.cls}`}>{p.label}</span>
              <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
                {st.icon} {st.label}
              </span>
              {item.is_overdue && (
                <span className="text-xs bg-red-900/50 text-red-300 border border-red-700/50 px-2.5 py-1 rounded-full">
                  ⚠️ Просрочено
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{item.title}</h1>
            {item.description && (
              <div className="bg-slate-900/50 rounded-xl p-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap border border-slate-700">
                {item.description}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-white font-semibold mb-4">💬 Комментарии ({comments.length})</h3>

            <div className="space-y-3 mb-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-semibold flex-shrink-0">
                    {c.author_username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 bg-slate-700/50 rounded-xl px-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-violet-400">{c.author_username}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleDateString('ru')}</span>
                        {user?.username === c.author_username && (
                          <button onClick={() => handleDeleteComment(c.id)}
                            className="text-slate-600 hover:text-red-400 text-xs transition-colors">✕</button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300">{c.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-4">Нет комментариев</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Добавить комментарий..."
                className="flex-1 bg-slate-900/60 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>
                Отправить
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Детали</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Автор</span>
                <span className="text-slate-200">{item.owner_username}</span>
              </div>
              {item.due_date && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Дедлайн</span>
                  <span className={item.is_overdue ? 'text-red-400' : 'text-slate-200'}>
                    {new Date(item.due_date).toLocaleDateString('ru')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Создано</span>
                <span className="text-slate-500 text-xs">{new Date(item.created_at).toLocaleDateString('ru')}</span>
              </div>
            </div>
          </div>

          {isOwner && (prevStatus || nextStatus) && (
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Переместить</h3>
              <div className="space-y-2">
                {prevStatus && (
                  <button onClick={() => handleMove(prevStatus)}
                    className="w-full text-left text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors">
                    ← {statusConfig[prevStatus]?.icon} {statusConfig[prevStatus]?.label}
                  </button>
                )}
                {nextStatus && (
                  <button onClick={() => handleMove(nextStatus)}
                    className="w-full text-left text-sm text-violet-300 hover:text-violet-200 bg-violet-900/30 hover:bg-violet-900/50 border border-violet-700/50 px-3 py-2 rounded-lg transition-colors">
                    → {statusConfig[nextStatus]?.icon} {statusConfig[nextStatus]?.label}
                  </button>
                )}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-2">
              <Link to={`/items/${id}/edit`} className={`${s.btnSecondary} block text-center px-4 py-2 rounded-xl text-sm transition-colors`}>
                Редактировать
              </Link>
              <button onClick={handleDelete} className={`${s.btnDanger} w-full px-4 py-2 rounded-xl text-sm transition-colors`}>
                Удалить задачу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
