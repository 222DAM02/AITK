import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

const typeColors = { conference: '#f43f5e', meetup: '#8b5cf6', workshop: '#06b6d4', webinar: '#f59e0b', hackathon: '#10b981', party: '#ec4899', other: '#6b7280' }
const typeLabels = Object.fromEntries(config.entityFields.find(f => f.name === 'event_type')?.options?.map(o => [o.value, o.label]) || [])

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      itemsAPI.myStats().then(({ data }) => setStats(data)),
      itemsAPI.myList().then(({ data }) => setMyItems(data.results || data)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>

  const types = Object.entries(stats?.by_type || {}).filter(([,v]) => v > 0)
  const totalTypes = types.reduce((s, [,v]) => s + v, 0) || 1

  // SVG horizontal stacked bar
  let barX = 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Дашборд</h1><p className="text-sm text-gray-400">Привет, {user?.username}!</p></div>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>+ Новое событие</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Мои события', value: stats?.my_events || 0, icon: '📅' },
          { label: 'Мои регистрации', value: stats?.my_registrations || 0, icon: '🎟️' },
          { label: 'Предстоящих', value: stats?.upcoming_events || 0, icon: '🔜' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-2xl">{card.icon}</span>
            <p className="text-3xl font-black text-gray-900 mt-2">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Stacked bar — by type */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">По типам</h3>
          {types.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Нет данных</p> : (
            <>
              <svg viewBox="0 0 300 24" className="w-full rounded-full overflow-hidden mb-4">
                {types.map(([type, count]) => {
                  const w = (count / totalTypes) * 300
                  const x = barX
                  barX += w
                  return <rect key={type} x={x} y="0" width={w} height="24" fill={typeColors[type] || '#6b7280'} rx={x === 0 ? 12 : 0} />
                })}
              </svg>
              <div className="flex flex-wrap gap-3">
                {types.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: typeColors[type] }} />
                    <span className="text-sm text-gray-600">{typeLabels[type] || type}</span>
                    <span className="text-sm font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* By status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">По статусу</h3>
          <div className="space-y-3">
            {Object.entries(stats?.by_status || {}).filter(([,v]) => v > 0).map(([status, count]) => {
              const colors = { upcoming: 'from-blue-500 to-cyan-400', active: 'from-emerald-500 to-green-400', completed: 'from-gray-400 to-gray-300', cancelled: 'from-red-400 to-red-300' }
              const max = Math.max(...Object.values(stats?.by_status || {}))
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${colors[status] || 'from-gray-400 to-gray-300'} rounded-full transition-all duration-700`}
                      style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900">Ближайшие события</h3>
          <Link to="/items" className={`text-sm ${s.accent} font-medium`}>Все →</Link>
        </div>
        {myItems.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">Нет событий</p> : (
          <div className="space-y-2">
            {myItems.slice(0, 5).map(item => (
              <Link key={item.id} to={`/items/${item.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full" style={{ background: typeColors[item.event_type] || '#6b7280' }} />
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.date} · {item.location || 'Онлайн'}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{item.registrations_count || 0} 👤</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
