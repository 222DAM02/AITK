import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

const subjectLabels = {
  math: 'Математика', physics: 'Физика', chemistry: 'Химия', biology: 'Биология',
  history: 'История', literature: 'Литература', cs: 'Информатика',
  languages: 'Языки', philosophy: 'Философия', other: 'Другое',
}
const subjectIcons = {
  math: '📐', physics: '⚛️', chemistry: '🧪', biology: '🧬',
  history: '🏛️', literature: '📖', cs: '💻', languages: '🌐',
  philosophy: '🤔', other: '📁',
}
const tagColors = [
  'bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-cyan-100 text-cyan-700',
]

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    itemsAPI.get(id)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить эту заметку?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  const handleTogglePin = async () => {
    const { data } = await itemsAPI.togglePin(id)
    setItem(data)
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
    </div>
  )
  if (!item) return null

  const isOwner = user?.id === item.owner
  const tags = item.tags_list || []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-slate-400 hover:text-slate-600 text-sm mb-4 inline-block">← Назад к заметкам</Link>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{subjectIcons[item.subject] || '📁'}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                  {subjectLabels[item.subject] || item.subject}
                </span>
                {item.is_pinned && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">📌 Закреплено</span>}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{item.title}</h1>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag, i) => (
                <Link key={tag} to={`/items?tag=${tag}`}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium hover:opacity-80 transition-opacity ${tagColors[i % tagColors.length]}`}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="bg-slate-50 rounded-xl p-5 whitespace-pre-wrap text-slate-700 leading-relaxed text-sm border border-slate-100">
            {item.description}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-between items-center border-t border-slate-50 pt-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{item.owner_username}</span>
            <span>{new Date(item.created_at).toLocaleDateString('ru')}</span>
            {item.updated_at !== item.created_at && (
              <span>Обновлено: {new Date(item.updated_at).toLocaleDateString('ru')}</span>
            )}
          </div>
        </div>

        {isOwner && (
          <div className="px-6 pb-6 flex gap-2 border-t border-slate-50 pt-4">
            <button onClick={handleTogglePin}
              className={`${item.is_pinned ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} px-4 py-2 rounded-xl text-sm font-medium transition-colors`}>
              📌 {item.is_pinned ? 'Открепить' : 'Закрепить'}
            </button>
            <Link to={`/items/${id}/edit`} className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>
              Редактировать
            </Link>
            <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-xl text-sm transition-colors`}>
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
