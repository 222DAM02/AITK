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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full" /></div>

  const cats = Object.entries(stats?.by_category || {})
  const maxCat = cats.length ? Math.max(...cats.map(([,v]) => v)) : 1

  // Acceptance rate donut
  const total = stats?.my_proposals || 1
  const accepted = stats?.accepted || 0
  const rate = Math.round((accepted / total) * 100) || 0
  const circ = 2 * Math.PI * 45
  const off = circ - (rate / 100) * circ

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Мои заказы', value: stats?.my_orders || 0, icon: '📋' },
          { label: 'Открытых', value: stats?.open_orders || 0, icon: '🟢' },
          { label: 'Мои отклики', value: stats?.my_proposals || 0, icon: '✍️' },
          { label: 'Принято', value: stats?.accepted || 0, icon: '✅' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-black text-gray-900 mt-2">{c.value}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Acceptance rate donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center">
          <h3 className="font-bold text-gray-900 mb-4 self-start">Процент принятия</h3>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={off} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black">{rate}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">{accepted} из {total} откликов принято</p>
        </div>

        {/* By category bars */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">По категориям</h3>
          {cats.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Нет данных</p> : (
            <div className="space-y-3">
              {cats.map(([cat, count]) => {
                const label = config.entityFields.find(f => f.name === 'category')?.options?.find(o => o.value === cat)?.label || cat
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${(count / maxCat) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
