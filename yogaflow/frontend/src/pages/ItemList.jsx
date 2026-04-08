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

  const load = () => {
    setLoading(true)
    const params = { mine: true }
    if (search) params.search = search
    itemsAPI.list(params).then(({ data }) => { setItems(data.results || data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">{config.entityNamePlural}</h1>
        <Link to="/items/new" className={`${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm`}>+ Создать</Link>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load() }} className="flex gap-2 mb-8">
        <input type="text" placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing}`} />
        <button type="submit" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>→</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full opacity-30" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 opacity-30">
          <span className="text-6xl block mb-4">{config.projectIcon}</span>
          <p>Пока пусто</p>
        </div>
      ) : (
        <div className="ml-1">
          {items.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
