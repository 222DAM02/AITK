import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const params = { mine: true }
    if (statusFilter) params.status = statusFilter
    if (search) params.search = search
    itemsAPI.list(params)
      .then(({ data }) => setItems(data.results || data))
      .finally(() => setLoading(false))
  }, [statusFilter, search, refresh])

  const statusFilters = [
    { value: '', label: 'Все' },
    { value: 'active', label: '🟢 Активные' },
    { value: 'paused', label: '⏸ На паузе' },
    { value: 'completed', label: '✅ Завершённые' },
    { value: 'archived', label: '📦 Архив' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} проектов</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent w-44" />
          <Link to="/items/new" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>
            + Проект
          </Link>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-cyan-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📁</span>
          <p className="text-gray-400 text-lg">Нет проектов</p>
          <Link to="/items/new" className={`inline-block mt-4 ${s.accent} font-semibold ${s.accentHover}`}>
            Создать первый →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(item => (
            <ItemCard key={item.id} item={item} onTimerStart={() => setRefresh(r => r + 1)} />
          ))}
        </div>
      )}
    </div>
  )
}
