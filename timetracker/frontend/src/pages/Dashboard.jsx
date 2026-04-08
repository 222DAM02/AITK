import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

function fmtTime(mins) {
  if (!mins) return '0м'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}м`
  return m ? `${h}ч ${m}м` : `${h}ч`
}

const dayNames = { Mon: 'Пн', Tue: 'Вт', Wed: 'Ср', Thu: 'Чт', Fri: 'Пт', Sat: 'Сб', Sun: 'Вс' }

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    itemsAPI.myStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
    </div>
  )

  const maxDay = Math.max(...(stats?.daily?.map(d => d.minutes) || [1]), 1)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
          <p className="text-gray-500 text-sm">Отчёты по времени</p>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Проекты', value: stats?.total_projects || 0, icon: '📁', color: 'text-cyan-600' },
          { label: 'Записей', value: stats?.total_entries || 0, icon: '📝', color: 'text-teal-600' },
          { label: 'Всего', value: fmtTime(stats?.total_minutes || 0), icon: '⏱', color: 'text-emerald-600' },
          { label: 'Эта неделя', value: fmtTime(stats?.week_minutes || 0), icon: '📊', color: 'text-blue-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className={`text-2xl font-extrabold ${c.color}`}>{c.value}</div>
            <div className="text-gray-400 text-xs mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Weekly bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Эта неделя</h3>
          <div className="flex items-end gap-2 h-36">
            {stats?.daily?.map(d => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full">
                <div className="w-full bg-cyan-500 rounded-t-lg transition-all"
                  style={{ height: `${Math.max(2, (d.minutes / maxDay) * 100)}%` }} />
                <span className="text-xs text-gray-500 mt-2">{dayNames[d.weekday] || d.weekday}</span>
                <span className="text-xs text-gray-400">{d.minutes > 0 ? fmtTime(d.minutes) : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* By project */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">По проектам</h3>
          {stats?.by_project?.length > 0 ? (
            <div className="space-y-3">
              {stats.by_project.map(p => {
                const maxP = Math.max(...stats.by_project.map(x => x.minutes), 1)
                const pct = (p.minutes / maxP) * 100
                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <Link to={`/items/${p.id}`} className="text-gray-700 font-medium hover:text-cyan-600 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full color-dot-${p.color}`} />
                        {p.title}
                      </Link>
                      <span className="text-gray-400">{fmtTime(p.minutes)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full color-${p.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-4">Нет записей</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/items" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm transition-colors`}>Проекты</Link>
        <Link to="/items/new" className={`${s.btnSecondary} px-5 py-2.5 rounded-xl text-sm transition-colors`}>+ Новый проект</Link>
      </div>
    </div>
  )
}
