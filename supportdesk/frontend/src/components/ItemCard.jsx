import { Link } from 'react-router-dom'
import config from '../theme.config'

const { s } = config

export default function ItemCard({ item }) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
    >
      {item.image_url ? (
        <div className="h-44 overflow-hidden">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.parentElement.style.display = 'none' }}
          />
        </div>
      ) : (
        <div className={`h-24 ${s.heroGradient} opacity-80`} />
      )}
      <div className="p-5">
        <h3 className={`text-lg font-bold text-gray-900 group-hover:${s.accent.replace('text-', 'text-')} transition-colors mb-1.5`}>
          {item.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <span className={`${s.badge} px-2 py-0.5 rounded-full font-medium`}>{item.owner_username}</span>
          <span className="text-gray-400">{new Date(item.created_at).toLocaleDateString('ru')}</span>
        </div>
      </div>
    </Link>
  )
}
