import { Link } from 'react-router-dom'
import config from '../theme.config'
const { s } = config

export default function ItemCard({ item }) {
  const stField = config.entityFields.find(f => f.name === 'status' || f.name === 'specialization')
  const stLabel = stField?.options?.find(o => o.value === item[stField?.name])?.label || ''

  return (
    <Link to={`/items/${item.id}`}
      className="flex items-stretch bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5 group">
      <div className={`w-2 shrink-0 ${s.btnPrimary.split(' ')[0]}`} />
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate group-hover:underline">{item.title}</h3>
            {item.description && <p className="text-sm opacity-50 mt-1 line-clamp-2">{item.description}</p>}
          </div>
          <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
            {stLabel && <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{stLabel}</span>}
            <span className="text-xs opacity-40">{new Date(item.created_at).toLocaleDateString('ru')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
