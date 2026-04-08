import { Link } from 'react-router-dom'
import config from '../theme.config'

const { s } = config

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

const levelLabels = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {item.image_url ? (
        <div className="h-40 overflow-hidden relative">
          <img src={item.image_url} alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.parentElement.style.display = 'none' }} />
          {item.level && (
            <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold ${levelColors[item.level] || s.badge}`}>
              {levelLabels[item.level] || item.level}
            </span>
          )}
        </div>
      ) : (
        <div className={`h-28 ${s.heroGradient} relative`}>
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-5xl font-bold">
            {config.projectIcon}
          </div>
          {item.level && (
            <span className="absolute top-3 left-3 text-xs bg-white/20 backdrop-blur text-white px-2.5 py-1 rounded-full font-semibold">
              {levelLabels[item.level] || item.level}
            </span>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {item.category && (
          <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider mb-1">
            {item.category}
          </span>
        )}
        <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1">{item.description}</p>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            {item.lessons_count > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.lessons_count} ур.
              </span>
            )}
            {item.duration_hours > 0 && (
              <span>{item.duration_hours} ч.</span>
            )}
          </div>
          <span className={`${s.badge} px-2 py-0.5 rounded-full font-medium`}>{item.owner_username}</span>
        </div>
      </div>
    </Link>
  )
}
