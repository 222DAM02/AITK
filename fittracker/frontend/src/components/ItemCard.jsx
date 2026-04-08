import { Link } from 'react-router-dom'
import config from '../theme.config'

const { s } = config

const typeStripes = {
  strength: 'bg-lime-500', cardio: 'bg-red-500', flexibility: 'bg-violet-500',
  hiit: 'bg-orange-500', crossfit: 'bg-yellow-500', yoga: 'bg-teal-500',
  swimming: 'bg-blue-500', running: 'bg-sky-500', cycling: 'bg-emerald-500', other: 'bg-slate-400',
}
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

export default function ItemCard({ item }) {
  const stripe = typeStripes[item.workout_type] || 'bg-slate-400'

  return (
    <Link to={`/items/${item.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
      <div className={`h-1.5 ${stripe}`} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{typeIcons[item.workout_type] || '💪'}</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
            {typeLabels[item.workout_type] || item.workout_type}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-lime-600 transition-colors mb-1">
          {item.title}
        </h3>
        {item.description && <p className="text-gray-500 text-sm line-clamp-1 mb-3">{item.description}</p>}
        <div className="flex items-center gap-3 text-xs">
          {item.duration_minutes && (
            <span className="flex items-center gap-1 text-slate-500">
              <span>⏱</span> {item.duration_minutes} мин
            </span>
          )}
          {item.calories_burned && (
            <span className="flex items-center gap-1 text-orange-500">
              <span>🔥</span> {item.calories_burned} ккал
            </span>
          )}
          {item.exercises_count > 0 && (
            <span className="flex items-center gap-1 text-slate-400">
              {item.exercises_count} упр.
            </span>
          )}
          <span className="ml-auto text-slate-400">{new Date(item.created_at).toLocaleDateString('ru')}</span>
        </div>
      </div>
    </Link>
  )
}
