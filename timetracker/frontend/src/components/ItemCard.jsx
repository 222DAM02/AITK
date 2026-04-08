import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const statusLabels = { active: 'Активный', paused: 'На паузе', completed: 'Завершён', archived: 'Архив' }
const statusColors = { active: 'bg-emerald-100 text-emerald-700', paused: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', archived: 'bg-gray-100 text-gray-500' }

function fmtTime(mins) {
  if (mins < 60) return `${mins} мин`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}ч ${m}м` : `${h}ч`
}

export default function ItemCard({ item, onTimerStart }) {
  const handleStart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await itemsAPI.startTimer(item.id)
    if (onTimerStart) onTimerStart()
  }

  return (
    <Link to={`/items/${item.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
      <div className={`h-1.5 color-${item.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-cyan-600 transition-colors flex-1">
            {item.title}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 ${statusColors[item.status]}`}>
            {statusLabels[item.status]}
          </span>
        </div>
        {item.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-gray-400">
            <span>📊 {item.entries_count || 0} записей</span>
            <span>⏱ {fmtTime(item.total_minutes || 0)}</span>
            {item.hourly_rate && <span>💰 {item.hourly_rate}₽/ч</span>}
          </div>
          {item.status === 'active' && (
            <button onClick={handleStart}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs px-3 py-1 rounded-lg font-medium transition-colors shadow-sm">
              ▶ Старт
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
