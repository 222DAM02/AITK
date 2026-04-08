import { Link } from 'react-router-dom'
import config from '../theme.config'
const { s } = config

export default function ItemCard({ item }) {
  const statusField = config.entityFields.find(f => f.name === 'status')
  const statusLabel = statusField?.options?.find(o => o.value === item.status)?.label || item.status || ''
  const catField = config.entityFields.find(f => f.name === 'category' || f.name === 'department' || f.name === 'specialization' || f.name === 'fuel_type')
  const catLabel = catField?.options?.find(o => o.value === item[catField?.name])?.label || ''

  return (
    <Link to={`/items/${item.id}`} className="table-row group">
      <td className="px-4 py-3 font-medium">{item.title}</td>
      <td className="px-4 py-3 text-sm opacity-70">{catLabel}</td>
      <td className="px-4 py-3">
        {statusLabel && <span className={`${s.badge} text-xs px-2 py-0.5 rounded-full`}>{statusLabel}</span>}
      </td>
      <td className="px-4 py-3 text-sm opacity-50">{item.owner_username}</td>
      <td className="px-4 py-3 text-sm opacity-50">{new Date(item.created_at).toLocaleDateString('ru')}</td>
    </Link>
  )
}
