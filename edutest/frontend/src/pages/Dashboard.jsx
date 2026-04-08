import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [stats, setStats] = useState(null)
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      itemsAPI.myStats().then(({ data }) => setStats(data)),
      itemsAPI.myList().then(({ data }) => setMyItems(data.results || data)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" /></div>

  const cats = Object.entries(stats?.by_category || {})
  const maxCat = cats.length ? Math.max(...cats.map(([,v]) => v)) : 1

  // Donut chart for score
  const score = stats?.avg_score || 0
  const pct = Math.min(100, Math.round(score * 10))
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Дашборд</h1><p className="text-sm text-gray-400">Привет, {user?.username}!</p></div>
        <Link to="/items/new" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl text-sm`}>+ Новый тест</Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Тестов создано', value: stats?.tests_created || 0, icon: '📝', color: 'bg-violet-50 text-violet-600' },
          { label: 'Тестов пройдено', value: stats?.tests_taken || 0, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Средний балл', value: stats?.avg_score || 0, icon: '📊', color: 'bg-amber-50 text-amber-600' },
          { label: 'Роль', value: user?.role === 'admin' ? 'Админ' : 'Студент', icon: '👤', color: 'bg-blue-50 text-blue-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <span className="text-2xl">{card.icon}</span>
            <p className={`text-2xl font-black mt-2 ${card.color.split(' ')[1]}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Donut chart — avg score */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center">
          <h3 className="font-bold text-gray-900 mb-4 self-start">Средний результат</h3>
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={pct >= 70 ? '#8b5cf6' : pct >= 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-black text-gray-900">{score}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-3">{pct >= 70 ? 'Отлично!' : pct >= 40 ? 'Неплохо' : 'Нужно подтянуть'}</p>
        </div>

        {/* Bar chart — by category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Тесты по категориям</h3>
          {cats.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Нет данных</p> : (
            <div className="space-y-3">
              {cats.map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className="font-bold text-gray-900">{val}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
                      style={{ width: `${(val / maxCat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent tests */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900">Мои тесты</h3>
          <Link to="/items" className={`text-sm ${s.accent} font-medium`}>Все →</Link>
        </div>
        {myItems.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">Нет тестов</p> : (
          <div className="space-y-2">
            {myItems.slice(0, 5).map(item => (
              <Link key={item.id} to={`/items/${item.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.questions_count} вопросов · {item.difficulty}</p>
                </div>
                <span className={`${s.badge} text-xs px-2 py-0.5 rounded-full`}>{item.category}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
