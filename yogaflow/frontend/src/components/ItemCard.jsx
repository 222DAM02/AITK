import { Link } from 'react-router-dom'
import config from '../theme.config'
const { s } = config

export default function ItemCard({ item }) {
  const stField = config.entityFields.find(f => f.name === 'status' || f.name === 'event_type' || f.name === 'property_type')
  const stLabel = stField?.options?.find(o => o.value === item[stField?.name])?.label || ''

  return (
    <div className="flex gap-4 group">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-2 ${s.btnPrimary.split(' ')[0]} shrink-0`} />
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      {/* Content */}
      <Link to={`/items/${item.id}`} className="flex-1 pb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:border-current/20">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg group-hover:underline">{item.title}</h3>
            {stLabel && <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full shrink-0 ml-3`}>{stLabel}</span>}
          </div>
          {item.description && <p className="text-sm opacity-50 line-clamp-2 mb-2">{item.description}</p>}
          <div className="flex items-center gap-4 text-xs opacity-40">
            <span>{item.owner_username}</span>
            <span>{new Date(item.created_at).toLocaleDateString('ru')}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
