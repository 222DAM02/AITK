import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const fetchItems = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await itemsAPI.list({ page: p })
      setItems(data.results || data)
      setHasNext(!!data.next)
      setPage(p)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{config.entityNamePlural}</h1>
          <p className="text-gray-500 mt-1">Все {config.entityNamePlural.toLowerCase()} на платформе</p>
        </div>
        <Link to="/items/new"
          className={`${s.btnPrimary} px-5 py-2.5 rounded-xl transition-colors`}>
          + Создать {config.entityName.toLowerCase()}
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📭</span>
          <p className="text-gray-400 text-lg">Пока нет {config.entityNamePlural.toLowerCase()}</p>
          <Link to="/items/new" className={`inline-block mt-4 ${s.accent} font-semibold ${s.accentHover}`}>
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
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  ← Назад
                </button>
              )}
              <span className="px-4 py-2.5 text-gray-400 text-sm">Стр. {page}</span>
              {hasNext && (
                <button onClick={() => fetchItems(page + 1)}
                  className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
