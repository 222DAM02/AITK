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
  const [enrollments, setEnrollments] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    itemsAPI.myEnrollments().then(({ data }) => setEnrollments(data.results || data)).catch(() => {})
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Привет, {user?.username}!
          </h1>
          <p className="text-gray-500 mt-1">Ваша панель обучения</p>
        </div>
        <Link to="/items" className={`${s.btnPrimary} px-5 py-2.5 rounded-xl transition-colors`}>
          Каталог курсов
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Создано курсов', value: myItems.length, color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
          { label: 'Записи', value: enrollments.length, color: 'bg-purple-50 border-purple-200 text-purple-600' },
          { label: 'AI-запросы', value: aiHistory.length, color: 'bg-pink-50 border-pink-200 text-pink-600' },
          { label: 'Роль', value: user?.role === 'admin' ? 'Админ' : 'Студент', color: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-2xl p-5 border`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Enrollments — уникальная фича */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Мои записи на курсы</h2>
          {enrollments.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl block mb-2">📚</span>
              <p className="text-gray-400 text-sm">Вы ещё не записались ни на один курс</p>
              <Link to="/items" className={`inline-block mt-3 text-sm ${s.accent} font-semibold`}>
                Найти курсы →
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {enrollments.slice(0, 5).map((e) => (
                <li key={e.id}>
                  <Link to={`/items/${e.course}`} className="block">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{e.course_title}</span>
                      <span className="text-xs text-indigo-600 font-semibold">{e.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${e.progress}%` }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Профиль</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className={`text-sm ${s.accent} font-semibold`}>
                Изменить
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
              <div className="flex gap-2">
                <button onClick={handleProfileSave}
                  className={`${s.btnPrimary} px-5 py-2 rounded-xl`}>Сохранить</button>
                <button onClick={() => setEditing(false)}
                  className="bg-gray-100 text-gray-700 px-5 py-2 rounded-xl font-medium">Отмена</button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                Зарегистрирован: {user?.date_joined && new Date(user.date_joined).toLocaleDateString('ru')}
              </div>
            </div>
          )}
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Мои курсы</h2>
            <Link to="/items/new" className={`text-sm ${s.accent} font-semibold`}>+ Создать</Link>
          </div>
          {myItems.length === 0 ? (
            <p className="text-gray-400 py-4 text-center text-sm">Вы ещё не создали ни одного курса</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {myItems.slice(0, 5).map((item) => (
                <li key={item.id} className="flex justify-between items-center py-2.5">
                  <Link to={`/items/${item.id}`} className={`text-sm ${s.accent} font-medium ${s.accentHover}`}>
                    {item.title}
                  </Link>
                  <span className="text-xs text-gray-400">{item.enrolled_count || 0} студ.</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">AI-наставник</h2>
            <Link to="/ai" className={`text-sm ${s.accent} font-semibold`}>Открыть →</Link>
          </div>
          {aiHistory.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-3xl block mb-2">🤖</span>
              <p className="text-gray-400 text-sm">Спросите AI о чём-нибудь</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {aiHistory.map((q) => (
                <li key={q.id} className="py-2.5">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{q.prompt}</p>
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
