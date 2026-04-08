import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
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

  const statusField = config.entityFields.find(f => f.name === 'status' || f.name === 'department')
  const catField = config.entityFields.find(f => f.name === 'category' || f.name === 'department' || f.name === 'specialization' || f.name === 'fuel_type')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{config.entityNamePlural}</h1>
          <p className="text-sm opacity-50 mt-1">{items.length} записей</p>
        </div>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>+ Создать</Link>
      </div>

      <div className="flex gap-3 mb-6">
        <form onSubmit={(e) => { e.preventDefault(); load() }} className="flex-1 flex gap-2">
          <input type="text" placeholder="Поиск по названию..." value={search} onChange={e => setSearch(e.target.value)}
            className={`flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm ${s.accentRing} focus:border-transparent`} />
          <button type="submit" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>Найти</button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full opacity-30" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 opacity-40">
          <span className="text-5xl block mb-4">{config.projectIcon}</span>
          <p>Нет записей. Создайте первую!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider opacity-50">Название</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider opacity-50">{catField?.label || 'Категория'}</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider opacity-50">Статус</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider opacity-50">Автор</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider opacity-50">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => {
                const catLabel = catField?.options?.find(o => o.value === item[catField?.name])?.label || ''
                const stField = config.entityFields.find(f => f.name === 'status')
                const stLabel = stField?.options?.find(o => o.value === item.status)?.label || item.status || ''
                return (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => window.location.href = `/items/${item.id}`}>
                    <td className="px-4 py-3">
                      <Link to={`/items/${item.id}`} className={`font-medium ${s.accent} hover:underline`}>{item.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm opacity-60">{catLabel}</td>
                    <td className="px-4 py-3">
                      {stLabel && <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{stLabel}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm opacity-50">{item.owner_username}</td>
                    <td className="px-4 py-3 text-sm opacity-50">{new Date(item.created_at).toLocaleDateString('ru')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
