import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'

const priorityConfig = {
  low:      { label: '🟢 Низкий',       cls: 'priority-low' },
  medium:   { label: '🔵 Средний',      cls: 'priority-medium' },
  high:     { label: '🟡 Высокий',      cls: 'priority-high' },
  critical: { label: '🔴 Критический',  cls: 'priority-critical' },
}

const STATUS_ORDER = ['todo', 'in_progress', 'review', 'done']

export default function ItemCard({ item, onMove }) {
  const p = priorityConfig[item.priority] || priorityConfig.medium
  const currentIdx = STATUS_ORDER.indexOf(item.status)
  const nextStatus = currentIdx < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIdx + 1] : null
  const prevStatus = currentIdx > 0 ? STATUS_ORDER[currentIdx - 1] : null

  const handleMove = async (s) => {
    try {
      const { data } = await itemsAPI.move(item.id, s)
      onMove(data)
    } catch {}
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-3 hover:border-violet-600/50 transition-all shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.cls}`}>{p.label}</span>
        {item.comments_count > 0 && (
          <span className="text-slate-500 text-xs">💬 {item.comments_count}</span>
        )}
      </div>

      <Link to={`/items/${item.id}`} className="block text-sm font-semibold text-slate-100 hover:text-violet-300 transition-colors mb-2 leading-snug">
        {item.title}
      </Link>

      {item.description && (
        <p className="text-xs text-slate-400 mb-2 line-clamp-2 leading-relaxed">{item.description}</p>
      )}

      {item.due_date && (
        <div className={`flex items-center gap-1 text-xs mb-2 ${item.is_overdue ? 'text-red-400' : 'text-slate-500'}`}>
          <span>{item.is_overdue ? '⚠️' : '📅'}</span>
          <span>{item.is_overdue ? 'Просрочено: ' : ''}{new Date(item.due_date).toLocaleDateString('ru')}</span>
        </div>
      )}

      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-700">
        {prevStatus && (
          <button onClick={() => handleMove(prevStatus)}
            className="text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors">
            ← Назад
          </button>
        )}
        <div className="flex-1" />
        {nextStatus && (
          <button onClick={() => handleMove(nextStatus)}
            className="text-violet-500 hover:text-violet-300 text-xs px-1.5 py-0.5 rounded hover:bg-slate-700 transition-colors">
            Вперёд →
          </button>
        )}
      </div>
    </div>
  )
}
