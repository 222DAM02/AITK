import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    aiAPI.history().then(({ data }) => setAiHistory((data.results || data).slice(0, 5)))
  }, [])

  useEffect(() => {
    if (user) {
      setProfileForm({ username: user.username, email: user.email })
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className={`${s.accentBg} rounded-2xl p-6 border ${s.accentBorder}`}>
          <p className="text-sm text-gray-500 mb-1">Мои {config.entityNamePlural.toLowerCase()}</p>
          <p className={`text-3xl font-bold ${s.accent}`}>{myItems.length}</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <p className="text-sm text-gray-500 mb-1">AI-запросы</p>
          <p className="text-3xl font-bold text-purple-600">{aiHistory.length}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <p className="text-sm text-gray-500 mb-1">Роль</p>
          <p className="text-3xl font-bold text-emerald-600 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Профиль</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className={`text-sm ${s.accent} font-semibold ${s.accentHover}`}>
              Редактировать
            </button>
          )}
        </div>
        {editing ? (
          <div className="space-y-3">
            <input value={profileForm.username}
              onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
              className={inputClass} placeholder="Имя пользователя" />
            <input value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className={inputClass} placeholder="Email" />
            <div className="flex gap-2 pt-1">
              <button onClick={handleProfileSave}
                className={`${s.btnPrimary} px-5 py-2 rounded-xl transition-colors`}>Сохранить</button>
              <button onClick={() => setEditing(false)}
                className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl hover:bg-gray-200 font-medium">Отмена</button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Пользователь</p>
              <p className="text-gray-900 font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Дата регистрации</p>
              <p className="text-gray-900 font-medium">{user?.date_joined && new Date(user.date_joined).toLocaleDateString('ru')}</p>
            </div>
          </div>
        )}
      </div>

      {/* My Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Мои {config.entityNamePlural.toLowerCase()}
          </h2>
          <Link to="/items/new" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm transition-colors`}>
            + Создать
          </Link>
        </div>
        {myItems.length === 0 ? (
          <p className="text-gray-400 py-4 text-center">Пока пусто. Создайте первый {config.entityName.toLowerCase()}!</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {myItems.slice(0, 5).map((item) => (
              <li key={item.id} className="flex justify-between items-center py-3">
                <Link to={`/items/${item.id}`} className={`${s.accent} font-medium ${s.accentHover}`}>
                  {item.title}
                </Link>
                <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('ru')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Последние AI-запросы</h2>
          <Link to="/ai" className={`text-sm ${s.accent} font-semibold ${s.accentHover}`}>Открыть AI →</Link>
        </div>
        {aiHistory.length === 0 ? (
          <p className="text-gray-400 py-4 text-center">
            Пока нет запросов. <Link to="/ai" className={s.link}>Попробовать AI</Link>
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {aiHistory.map((q) => (
              <li key={q.id} className="py-3">
                <p className="text-sm font-medium text-gray-900">{q.prompt}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(q.created_at).toLocaleDateString('ru')}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
