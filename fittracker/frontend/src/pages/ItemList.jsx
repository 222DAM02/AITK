import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

const types = [
  { value: '', label: 'Все', icon: '📋' },
  { value: 'strength', label: 'Силовая', icon: '🏋️' },
  { value: 'cardio', label: 'Кардио', icon: '❤️' },
  { value: 'hiit', label: 'HIIT', icon: '⚡' },
  { value: 'crossfit', label: 'Кроссфит', icon: '🔥' },
  { value: 'yoga', label: 'Йога', icon: '🧘' },
  { value: 'running', label: 'Бег', icon: '🏃' },
  { value: 'swimming', label: 'Плавание', icon: '🏊' },
  { value: 'cycling', label: 'Вело', icon: '🚴' },
  { value: 'flexibility', label: 'Растяжка', icon: '🤸' },
  { value: 'other', label: 'Другое', icon: '💪' },
]

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('')

  const fetchItems = async (type = '') => {
    setLoading(true)
    try {
      const params = {}
      if (type) params.type = type
      const { data } = await itemsAPI.list(params)
      setItems(data.results || data)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems(activeType) }, [activeType])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{config.entityNamePlural}</h1>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm transition-colors`}>
          + Новая тренировка
        </Link>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map((t) => (
          <button key={t.value} onClick={() => setActiveType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              activeType === t.value
                ? 'bg-slate-900 text-lime-400'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <span className="text-5xl block mb-4">🏋️</span>
          <p className="text-gray-400">Тренировки не найдены</p>
          <Link to="/items/new" className={`inline-block mt-3 ${s.accent} font-semibold ${s.accentHover} text-sm`}>
            Создать первую →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
