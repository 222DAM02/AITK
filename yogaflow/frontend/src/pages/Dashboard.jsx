import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-stone-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`
const levelLabels = { beginner: '🌱 Начинающий', intermediate: '🌿 Средний', advanced: '🌳 Продвинутый' }
const levelClasses = { beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced' }

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [stats, setStats] = useState(null)
  const [aiHistory, setAiHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    itemsAPI.myStats().then(({ data }) => setStats(data))
    aiAPI.history().then(({ data }) => setAiHistory((data.results || data).slice(0, 5)))
  }, [])

  useEffect(() => {
    if (user) setProfileForm({ username: user.username, email: user.email })
  }, [user])

  const handleProfileSave = async () => {
    try {
      await authAPI.updateProfile(profileForm)
      await fetchProfile()
      setEditing(false)
    } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-700 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Намасте, {user?.username} 🙏</h1>
          <p className="text-gray-500 text-sm">Ваши йога-потоки и прогресс</p>
        </div>
        <Link to="/items/new" className={`ml-auto ${s.btnPrimary} px-4 py-2.5 rounded-xl text-sm`}>
          + Новый поток
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-4">Статистика</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Потоков</span>
                <span className="text-2xl font-bold text-green-700">{stats?.total_flows || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Всего поз</span>
                <span className="text-2xl font-bold text-gray-900">{stats?.total_poses || 0}</span>
              </div>
            </div>
            {stats?.by_level && Object.keys(stats.by_level).length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs text-gray-400 mb-2">По уровням</p>
                <div className="space-y-1.5">
                  {Object.entries(stats.by_level).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelClasses[level]}`}>
                        {levelLabels[level]?.split(' ')[0]} {levelLabels[level]?.split(' ')[1]}
                      </span>
                      <span className="text-xs text-gray-500">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Профиль</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className={`text-xs ${s.accent} font-medium`}>
                  Изменить
                </button>
              )}
            </div>
            {editing ? (
              <div className="space-y-2">
                <input
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  className={inputClass}
                  placeholder="Имя"
                />
                <input
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className={inputClass}
                  placeholder="Email"
                />
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleProfileSave}
                    className={`${s.btnPrimary} px-4 py-1.5 rounded-lg text-xs`}
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-stone-100 text-gray-600 px-4 py-1.5 rounded-lg text-xs"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: recent flows + AI */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Мои потоки</h2>
              <Link to="/items" className={`text-xs ${s.accent} font-medium`}>Все →</Link>
            </div>
            {myItems.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl block mb-2">🧘</span>
                <p className="text-gray-400 text-sm">Создайте первый поток!</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {myItems.slice(0, 6).map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3">
                    <div>
                      <Link
                        to={`/items/${item.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-green-700"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-400">{item.poses_count} поз · {item.style}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${levelClasses[item.level]}`}>
                      {levelLabels[item.level]?.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">AI-запросы</h2>
              <Link to="/ai" className={`text-xs ${s.accent} font-medium`}>AI-тренер →</Link>
            </div>
            {aiHistory.length === 0 ? (
              <p className="text-gray-400 text-sm py-2">
                Попробуйте <Link to="/ai" className={s.link}>AI-инструктора</Link>
              </p>
            ) : (
              <ul className="divide-y divide-stone-50">
                {aiHistory.map(q => (
                  <li key={q.id} className="py-2.5">
                    <p className="text-sm text-gray-900">{q.prompt}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(q.created_at).toLocaleDateString('ru')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
