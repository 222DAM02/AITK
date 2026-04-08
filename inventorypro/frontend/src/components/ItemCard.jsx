import { Link } from 'react-router-dom'
import config from '../theme.config'
import useFavorites from '../hooks/useFavorites'
const { s } = config

export default function ItemCard({ item, onFavToggle }) {
  const stField = config.entityFields.find(f => f.name === 'status' || f.name === 'difficulty')
  const stLabel = stField?.options?.find(o => o.value === item[stField?.name])?.label || ''
  const catField = config.entityFields.find(f => f.name === 'category')
  const catLabel = catField?.options?.find(o => o.value === item[catField?.name])?.label || ''

  // Extract a numeric metric if available
  const metric = item.questions_count || item.quantity || item.proposals_count || item.budget || null
  const metricLabel = item.questions_count != null ? 'вопросов' : item.quantity != null ? 'шт' : item.proposals_count != null ? 'откликов' : item.budget ? '₽' : ''

  return (
    <Link to={`/items/${item.id}`}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        {catLabel && <span className="text-xs opacity-40 uppercase tracking-wider">{catLabel}</span>}
        {stLabel && <span className={`${s.badge} text-xs px-2 py-0.5 rounded-full`}>{stLabel}</span>}
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>
      {item.description && <p className="text-sm opacity-40 line-clamp-2 mb-3 flex-1">{item.description}</p>}
      <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
        {metric != null && (
          <div>
            <span className={`text-2xl font-black ${s.accent}`}>{typeof metric === 'number' && metric > 999 ? (metric/1000).toFixed(0) + 'k' : metric}</span>
            <span className="text-xs opacity-40 ml-1">{metricLabel}</span>
          </div>
        )}
        <span className="text-xs opacity-30">{new Date(item.created_at).toLocaleDateString('ru')}</span>
      </div>
    </Link>
  )
}
