import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'
import useFavorites from '../hooks/useFavorites'
const { s } = config

export default function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showFavs, setShowFavs] = useState(false)
  const { toggle, isFav, count: favCount } = useFavorites()

  const load = () => {
    setLoading(true)
    const params = { mine: true }
    if (search) params.search = search
    itemsAPI.list(params).then(({ data }) => { setItems(data.results || data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{config.entityNamePlural}</h1>
          <p className="text-sm opacity-40 mt-1">{items.length} записей</p>
        </div>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>+ Создать</Link>
        <button onClick={() => setShowFavs(!showFavs)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition ${showFavs ? s.btnPrimary : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{showFavs ? '★' : '☆'} {favCount}</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load() }} className="flex gap-2 mb-6">
        <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`} />
        <button type="submit" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Найти</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full opacity-30" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 opacity-30"><span className="text-6xl block mb-4">{config.projectIcon}</span><p>Пока пусто</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(showFavs ? items.filter(i => isFav(i.id)) : items).map(item => (
                  <div key={item.id} className="relative group">
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item.id) }}
                      className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isFav(item.id) ? 'bg-amber-100 text-amber-500 scale-110' : 'bg-white/80 text-gray-300 opacity-0 group-hover:opacity-100'} hover:scale-125`}>
                      {isFav(item.id) ? '★' : '☆'}
                    </button>
                    <ItemCard item={item} />
                  </div>
                ))}
        </div>
      )}
    </div>
  )
}
