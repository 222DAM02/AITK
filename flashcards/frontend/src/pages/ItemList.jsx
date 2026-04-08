import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

const categories = [
  { value: '', label: 'Все' },
  { value: 'languages', label: 'Языки' },
  { value: 'science', label: 'Наука' },
  { value: 'programming', label: 'Код' },
  { value: 'math', label: 'Математика' },
  { value: 'history', label: 'История' },
  { value: 'other', label: 'Другое' },
]

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [catFilter, setCatFilter] = useState('')

  const fetchItems = async (p = 1, cat = catFilter) => {
    setLoading(true)
    try {
      const params = { page: p }
      if (cat) params.category = cat
      const { data } = await itemsAPI.list(params)
      setItems(data.results || data)
      setHasNext(!!data.next)
      setPage(p)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems(1) }, [catFilter])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-100">{config.entityNamePlural}</h1>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2 rounded-xl text-sm transition-colors`}>
          + Новая колода
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((c) => (
          <button key={c.value} onClick={() => setCatFilter(c.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              catFilter === c.value
                ? 'bg-teal-500 text-white'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-teal-500/50'
            }`}>{c.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl block mb-3">📦</span>
          <p className="text-gray-500">Колоды не найдены</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
          {(page > 1 || hasNext) && (
            <div className="flex justify-center gap-3 mt-8">
              {page > 1 && <button onClick={() => fetchItems(page - 1)} className={`${s.btnSecondary} px-4 py-2 rounded-lg text-sm`}>← Назад</button>}
              <span className="px-3 py-2 text-gray-600 text-sm">Стр. {page}</span>
              {hasNext && <button onClick={() => fetchItems(page + 1)} className={`${s.btnSecondary} px-4 py-2 rounded-lg text-sm`}>Далее →</button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}