import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import ItemCard from '../components/ItemCard'
import config from '../theme.config'

const { s } = config

const COLUMNS = [
  { key: 'todo',        label: 'К выполнению', icon: '📋', border: 'border-slate-600',       header: 'bg-slate-700/50' },
  { key: 'in_progress', label: 'В работе',      icon: '⚡', border: 'border-violet-600/60',   header: 'bg-violet-900/30' },
  { key: 'review',      label: 'На проверке',   icon: '👁️', border: 'border-amber-600/60',    header: 'bg-amber-900/20' },
  { key: 'done',        label: 'Готово',         icon: '✅', border: 'border-emerald-600/60',  header: 'bg-emerald-900/20' },
]

export default function ItemList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const load = (params = {}) => {
    const p = { mine: true, ...params }
    itemsAPI.list(p)
      .then(({ data }) => setTasks(data.results || data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const params = {}
    if (search) params.search = search
    if (priorityFilter) params.priority = priorityFilter
    load(params)
  }, [search, priorityFilter])

  const handleMove = (updated) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  const getCol = (key) => tasks.filter(t => t.status === key)

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
    </div>
  )

  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Канбан-доска</h1>
          <p className="text-slate-400 text-sm mt-1">{tasks.length} задач</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск задач..."
            className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 w-48"
          />
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="">Все приоритеты</option>
            <option value="low">🟢 Низкий</option>
            <option value="medium">🔵 Средний</option>
            <option value="high">🟡 Высокий</option>
            <option value="critical">🔴 Критический</option>
          </select>
          <Link to="/items/new" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap`}>
            + Задача
          </Link>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
        {COLUMNS.map(col => {
          const colTasks = getCol(col.key)
          return (
            <div key={col.key} className="kanban-col flex flex-col">
              <div className={`${col.header} border ${col.border} rounded-xl px-3 py-2 mb-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span>{col.icon}</span>
                  <span className="text-sm font-semibold text-slate-200">{col.label}</span>
                </div>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-2">
                {colTasks.map(task => (
                  <ItemCard key={task.id} item={task} onMove={handleMove} />
                ))}
                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-700 rounded-xl">
                    Нет задач
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
