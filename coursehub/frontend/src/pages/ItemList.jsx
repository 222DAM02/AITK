import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

const levels = [
  { value: '', label: 'Все уровни' },
  { value: 'beginner', label: 'Начальный' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
]

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [levelFilter, setLevelFilter] = useState('')

  const fetchItems = async (p = 1, level = levelFilter) => {
    setLoading(true)
    try {
      const params = { page: p }
      if (level) params.level = level
      const { data } = await itemsAPI.list(params)
      setItems(data.results || data)
      setHasNext(!!data.next)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems(1) }, [levelFilter])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Каталог курсов</h1>
          <p className="text-gray-500 mt-1">Найдите курс для себя</p>
        </div>
        <Link to="/items/new"
          className={`${s.btnPrimary} px-5 py-2.5 rounded-xl transition-colors`}>
          + Создать курс
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {levels.map((lvl) => (
          <button key={lvl.value} onClick={() => setLevelFilter(lvl.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              levelFilter === lvl.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600'
            }`}>
            {lvl.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📚</span>
          <p className="text-gray-400 text-lg">Курсы не найдены</p>
          <Link to="/items/new" className={`inline-block mt-4 ${s.accent} font-semibold`}>
            Создать первый →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
          {(page > 1 || hasNext) && (
            <div className="flex justify-center gap-3 mt-10">
              {page > 1 && (
                <button onClick={() => fetchItems(page - 1)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  ← Назад
                </button>
              )}
              <span className="px-4 py-2.5 text-gray-400 text-sm">Стр. {page}</span>
              {hasNext && (
                <button onClick={() => fetchItems(page + 1)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50">
                  Далее →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
