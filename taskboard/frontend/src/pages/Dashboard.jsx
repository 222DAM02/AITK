import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

const statusConfig = {
  todo:        { label: 'К выполнению', icon: '📋', color: 'bg-slate-500' },
  in_progress: { label: 'В работе',      icon: '⚡', color: 'bg-violet-500' },
  review:      { label: 'На проверке',   icon: '👁️', color: 'bg-amber-500' },
  done:        { label: 'Готово',         icon: '✅', color: 'bg-emerald-500' },
}
const priorityConfig = {
  low:      { label: 'Низкий',      color: 'bg-emerald-500' },
  medium:   { label: 'Средний',     color: 'bg-blue-500' },
  high:     { label: 'Высокий',     color: 'bg-amber-500' },
  critical: { label: 'Критический', color: 'bg-red-500' },
}

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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
    </div>
  )

  const total = stats?.total || 0
  const done = stats?.by_status?.done || 0
  const donePercent = total > 0 ? Math.round(done / total * 100) : 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-900/50">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
          <p className="text-slate-400 text-sm">Статистика задач</p>
        </div>
      </div>

      {/* Top numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Всего задач',    value: total,               icon: '📋', color: 'text-violet-400' },
          { label: 'Выполнено',      value: done,                icon: '✅', color: 'text-emerald-400' },
          { label: 'Просрочено',     value: stats?.overdue || 0, icon: '⚠️', color: 'text-red-400' },
          { label: 'Дедлайн сегодня', value: stats?.due_today || 0, icon: '📅', color: 'text-amber-400' },
        ].map(card => (
          <div key={card.label} className="bg-slate-800 rounded-2xl border border-slate-700 p-5 text-center">
            <div className="text-3xl mb-1">{card.icon}</div>
            <div className={`text-3xl font-extrabold ${card.color}`}>{card.value}</div>
            <div className="text-slate-400 text-xs mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Progress */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Общий прогресс</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#7c3aed" strokeWidth="3"
                  strokeDasharray={`${donePercent} ${100 - donePercent}`}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                {donePercent}%
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                  <span className="text-slate-400 text-xs flex-1">{cfg.label}</span>
                  <span className="text-white text-sm font-medium">{stats?.by_status?.[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">По приоритету</h3>
          <div className="space-y-3">
            {Object.entries(priorityConfig).map(([key, cfg]) => {
              const count = stats?.by_priority?.[key] || 0
              const pct = total > 0 ? (count / total * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{cfg.label}</span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${cfg.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/board" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm transition-colors`}>
          Открыть доску
        </Link>
        <Link to="/items/new" className={`${s.btnSecondary} px-5 py-2.5 rounded-xl text-sm transition-colors`}>
          + Новая задача
        </Link>
      </div>
    </div>
  )
}
