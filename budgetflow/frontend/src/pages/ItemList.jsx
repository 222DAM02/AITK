import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const load = () => {
    setLoading(true)
    const params = { mine: true }
    if (search) params.search = search
    if (typeFilter) params.type = typeFilter
    if (catFilter) params.category = catFilter
    itemsAPI.list(params).then(({ data }) => {
      setItems(data.results || data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [typeFilter, catFilter])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Транзакции</h1>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>+ Новая транзакция</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm" />
          <button type="submit" className={`${s.btnPrimary} px-4 py-2.5 rounded-xl text-sm`}>Найти</button>
        </form>
        <div className="flex gap-2">
          {[
            { value: '', label: 'Все' },
            { value: 'income', label: '📈 Доходы' },
            { value: 'expense', label: '📉 Расходы' },
          ].map(t => (
            <button key={t.value} onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition ${typeFilter === t.value ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-4">💸</span>
          <p>Нет транзакций</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => <ItemCard key={item.id} item={item} onUpdate={load} />)}
        </div>
      )}
    </div>
  )
}
