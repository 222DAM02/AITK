import { Link } from 'react-router-dom'
import config from '../theme.config'

const { s } = config

const categoryLabels = {
  languages: 'Языки', science: 'Наука', history: 'История',
  programming: 'Код', math: 'Математика', other: 'Другое',
}

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className={`group block ${s.card} rounded-xl ${s.cardHover} transition-all duration-300 overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{config.projectIcon}</span>
          {item.category && (
            <span className={`${s.badge} text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider`}>
              {categoryLabels[item.category] || item.category}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-gray-100 group-hover:text-teal-400 transition-colors mb-1.5">
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>

        <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-center justify-between text-xs">
          <span className="text-teal-400 font-semibold">
            {item.cards_count || 0} карт.
          </span>
          <span className="text-gray-600">{item.owner_username}</span>
        </div>
      </div>
    </Link>
  )
}
