import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      itemsAPI.myStats().then(({ data }) => setStats(data)),
      itemsAPI.myList().then(({ data }) => setItems(data.results || data)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>

  const cats = Object.entries(stats?.by_category || {})
  const totalCats = cats.reduce((s, [,v]) => s + v, 0) || 1
  const lowStock = items.filter(i => i.quantity <= (i.min_stock || 5))

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Дашборд склада</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Товаров', value: stats?.total_products || 0, icon: '📦', color: 'text-orange-600' },
          { label: 'Всего единиц', value: stats?.total_quantity || 0, icon: '🔢', color: 'text-blue-600' },
          { label: 'Стоимость', value: `${((stats?.total_value || 0) / 1000).toFixed(0)}k ₽`, icon: '💰', color: 'text-emerald-600' },
          { label: 'Мало на складе', value: stats?.low_stock || 0, icon: '⚠️', color: lowStock.length > 0 ? 'text-red-600' : 'text-gray-400' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-2xl">{c.icon}</span>
            <p className={`text-2xl font-black mt-2 ${c.color}`}>{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Category breakdown — horizontal bars */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">По категориям</h3>
          {cats.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">Нет данных</p> : (
            <div className="space-y-3">
              {cats.map(([cat, count]) => {
                const catLabel = config.entityFields.find(f => f.name === 'category')?.options?.find(o => o.value === cat)?.label || cat
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24 truncate">{catLabel}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${(count / totalCats) * 100}%` }} />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">⚠️ Требуют пополнения</h3>
          {lowStock.length === 0 ? (
            <div className="text-center py-8"><span className="text-4xl">✅</span><p className="text-sm text-gray-400 mt-2">Все в порядке</p></div>
          ) : (
            <div className="space-y-2">
              {lowStock.slice(0, 6).map(item => (
                <Link key={item.id} to={`/items/${item.id}`} className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition">
                  <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  <span className="text-sm font-bold text-red-600">{item.quantity} / {item.min_stock}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
