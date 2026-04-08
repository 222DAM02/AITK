import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

const typeLabels = {
  strength: 'Силовая', cardio: 'Кардио', flexibility: 'Растяжка', hiit: 'HIIT',
  crossfit: 'Кроссфит', yoga: 'Йога', swimming: 'Плавание', running: 'Бег',
  cycling: 'Велосипед', other: 'Другое',
}

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    aiAPI.history().then(({ data }) => setAiHistory((data.results || data).slice(0, 5)))
    itemsAPI.myStats().then(({ data }) => setStats(data))
  }, [])

  useEffect(() => { if (user) setProfileForm({ username: user.username, email: user.email }) }, [user])

  const handleProfileSave = async () => {
    try { await authAPI.updateProfile(profileForm); await fetchProfile(); setEditing(false) } catch {}
  }

  return (
    <div>
      {/* Dark stats banner */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">Мой прогресс</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-lime-400">{stats?.streak || 0}</p>
              <p className="text-xs text-slate-400 mt-1">🔥 Серия дней</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white">{stats?.total_workouts || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Тренировок</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white">{stats?.total_exercises || 0}</p>
              <p className="text-xs text-slate-400 mt-1">Упражнений</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white">{stats?.total_duration || 0}</p>
              <p className="text-xs text-slate-400 mt-1">⏱ Минут</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-orange-400">{stats?.total_calories || 0}</p>
              <p className="text-xs text-slate-400 mt-1">🔥 Калорий</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* By type + Profile */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {stats?.by_type && Object.keys(stats.by_type).length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">По типам тренировок</h2>
              <div className="space-y-2">
                {Object.entries(stats.by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{typeLabels[type] || type}</span>
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-lime-500 h-2 rounded-full" style={{ width: `${(count / stats.total_workouts) * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Профиль</h2>
              {!editing && <button onClick={() => setEditing(true)} className={`text-xs ${s.accent} font-semibold ${s.accentHover}`}>Редактировать</button>}
            </div>
            {editing ? (
              <div className="space-y-3">
                <input value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} className={inputClass} placeholder="Имя" />
                <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={inputClass} placeholder="Email" />
                <div className="flex gap-2">
                  <button onClick={handleProfileSave} className={`${s.btnPrimary} px-5 py-2 rounded-xl text-sm`}>Сохранить</button>
                  <button onClick={() => setEditing(false)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl text-sm hover:bg-gray-200 font-medium">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div><p className="text-xs text-gray-400">Пользователь</p><p className="text-sm font-medium text-gray-900">{user?.username}</p></div>
                <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-900">{user?.email}</p></div>
                <div><p className="text-xs text-gray-400">Роль</p><p className="text-sm font-medium text-gray-900 capitalize">{user?.role}</p></div>
              </div>
            )}
          </div>
        </div>

        {/* Recent workouts */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Последние тренировки</h2>
            <Link to="/items/new" className={`${s.btnPrimary} px-3 py-1.5 rounded-lg text-xs`}>+ Новая</Link>
          </div>
          {myItems.length === 0 ? (
            <p className="text-gray-400 py-4 text-center text-sm">Пока пусто. Начните тренироваться!</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {myItems.slice(0, 5).map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2.5">
                  <Link to={`/items/${item.id}`} className={`${s.accent} font-medium text-sm ${s.accentHover}`}>{item.title}</Link>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {item.duration_minutes && <span>⏱ {item.duration_minutes}м</span>}
                    <span>{new Date(item.created_at).toLocaleDateString('ru')}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI History */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-900">AI-запросы</h2>
            <Link to="/ai" className={`text-xs ${s.accent} font-semibold ${s.accentHover}`}>AI-тренер →</Link>
          </div>
          {aiHistory.length === 0 ? (
            <p className="text-gray-400 py-4 text-center text-sm">Попробуйте <Link to="/ai" className={s.link}>AI-тренера</Link></p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {aiHistory.map((q) => (
                <li key={q.id} className="py-2.5">
                  <p className="text-sm font-medium text-gray-900">{q.prompt}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(q.created_at).toLocaleDateString('ru')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
