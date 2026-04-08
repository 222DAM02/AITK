import { Link } from 'react-router-dom'
import config from '../theme.config'

const { s } = config

const catLabels = Object.fromEntries(
  config.entityFields.find(f => f.name === 'category')?.options?.map(o => [o.value, o.label]) || []
)
const catIcons = {
  salary: '💼', freelance: '💻', investment: '📈', other_income: '💵',
  food: '🍕', transport: '🚗', housing: '🏠', utilities: '💡',
  health: '🏥', education: '📚', entertainment: '🎬', clothing: '👕',
  savings: '🏦', other_expense: '📦',
}

export default function ItemCard({ item }) {
  const isIncome = item.type === 'income'

  return (
    <Link to={`/items/${item.id}`}
      className="finance-card flex items-center gap-4 p-4 hover:border-emerald-300">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isIncome ? 'bg-emerald-50' : 'bg-red-50'}`}>
        {catIcons[item.category] || '💳'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{item.title}</p>
        <p className="text-xs text-gray-400">{catLabels[item.category] || item.category} · {item.date}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold mono ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
          {isIncome ? '+' : '−'}{parseFloat(item.amount).toLocaleString('ru')} {item.currency === 'RUB' ? '₽' : item.currency}
        </p>
      </div>
    </Link>
  )
}
