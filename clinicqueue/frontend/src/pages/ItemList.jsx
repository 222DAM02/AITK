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
  const [filter, setFilter] = useState('')

  const load = () => {
    setLoading(true)
    const params = { mine: true }
    if (search) params.search = search
    const stField = config.entityFields.find(f => f.name === 'status' || f.name === 'specialization' || f.name === 'category')
    if (filter && stField) params[stField.name] = filter
    itemsAPI.list(params).then(({ data }) => { setItems(data.results || data); setLoading(false) })
  }

  useEffect(() => { load() }, [filter])

  const filterField = config.entityFields.find(f => f.name === 'status' || f.name === 'specialization' || f.name === 'category')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">{config.entityNamePlural}</h1>
        <Link to="/items/new" className={`${s.btnPrimary} px-6 py-2.5 rounded-full text-sm`}>+ Создать</Link>
        <button onClick={() => setShowFavs(!showFavs)} className={`px-3 py-2.5 rounded-xl text-sm font-medium transition ${showFavs ? s.btnPrimary : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{showFavs ? '★' : '☆'} {favCount}</button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load() }} className="relative mb-6">
        <input type="text" placeholder={`Поиск ${config.entityNamePlural.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)}
          className={`w-full px-5 py-3.5 rounded-2xl border border-gray-200 text-sm pr-24 ${s.accentRing} focus:border-transparent shadow-sm`} />
        <button type="submit" className={`absolute right-2 top-1/2 -translate-y-1/2 ${s.btnPrimary} px-4 py-2 rounded-xl text-sm`}>Поиск</button>
      </form>

      {filterField?.options && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-full text-sm transition ${!filter ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Все</button>
          {filterField.options.map(o => (
            <button key={o.value} onClick={() => setFilter(o.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${filter === o.value ? s.btnPrimary : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{o.label}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full opacity-30" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 opacity-30">
          <span className="text-6xl block mb-4">{config.projectIcon}</span>
          <p className="text-lg">Пока пусто</p>
        </div>
      ) : (
        <div className="space-y-3">
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
