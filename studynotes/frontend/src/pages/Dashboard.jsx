import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-slate-400 ${s.accentRing} focus:border-transparent transition-shadow`

const subjectLabels = {
  math: 'Математика', physics: 'Физика', chemistry: 'Химия', biology: 'Биология',
  history: 'История', literature: 'Литература', cs: 'Информатика',
  languages: 'Языки', philosophy: 'Философия', other: 'Другое',
}
const subjectColors = {
  math: 'bg-blue-100 text-blue-700', physics: 'bg-violet-100 text-violet-700',
  chemistry: 'bg-green-100 text-green-700', biology: 'bg-emerald-100 text-emerald-700',
  history: 'bg-amber-100 text-amber-700', literature: 'bg-rose-100 text-rose-700',
  cs: 'bg-cyan-100 text-cyan-700', languages: 'bg-pink-100 text-pink-700',
  philosophy: 'bg-purple-100 text-purple-700', other: 'bg-slate-100 text-slate-600',
}

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [stats, setStats] = useState(null)
  const [tags, setTags] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    aiAPI.history().then(({ data }) => setAiHistory((data.results || data).slice(0, 5)))
    itemsAPI.myStats().then(({ data }) => setStats(data))
    itemsAPI.allTags().then(({ data }) => setTags(data))
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
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Личный кабинет</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Всего заметок</p>
          <p className="text-2xl font-bold text-sky-600">{stats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Закреплено</p>
          <p className="text-2xl font-bold text-amber-600">{stats?.pinned || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">AI-запросы</p>
          <p className="text-2xl font-bold text-violet-600">{aiHistory.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Роль</p>
          <p className="text-2xl font-bold text-slate-600 capitalize">{user?.role}</p>
        </div>
      </div>

      {/* Subject breakdown + Tags */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {stats?.by_subject && Object.keys(stats.by_subject).length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">По предметам</h2>
            <div className="space-y-2">
              {Object.entries(stats.by_subject).map(([subj, count]) => (
                <div key={subj} className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${subjectColors[subj] || 'bg-slate-100 text-slate-600'}`}>
                    {subjectLabels[subj] || subj}
                  </span>
                  <div className="flex items-center gap-2 flex-1 ml-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-sky-400 h-2 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tags.length > 0 && (
          <div className="bg-white rounded-xl p-5 border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Мои теги</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} to={`/items?tag=${tag}`}
                  className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-full hover:bg-sky-100 transition-colors font-medium">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Профиль</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className={`text-xs ${s.accent} font-semibold ${s.accentHover}`}>
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
              <button onClick={handleProfileSave} className={`${s.btnPrimary} px-5 py-2 rounded-xl text-sm transition-colors`}>Сохранить</button>
              <button onClick={() => setEditing(false)} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-sm hover:bg-slate-200 font-medium">Отмена</button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Пользователь</p>
              <p className="text-slate-900 font-medium text-sm">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-slate-900 font-medium text-sm">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Дата регистрации</p>
              <p className="text-slate-900 font-medium text-sm">{user?.date_joined && new Date(user.date_joined).toLocaleDateString('ru')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent notes */}
      <div className="bg-white rounded-xl border border-slate-100 p-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Последние заметки</h2>
          <Link to="/items/new" className={`${s.btnPrimary} px-3 py-1.5 rounded-lg text-xs transition-colors`}>+ Создать</Link>
        </div>
        {myItems.length === 0 ? (
          <p className="text-slate-400 py-4 text-center text-sm">Пока пусто</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {myItems.slice(0, 5).map((item) => (
              <li key={item.id} className="flex justify-between items-center py-2.5">
                <Link to={`/items/${item.id}`} className={`${s.accent} font-medium text-sm ${s.accentHover}`}>
                  {item.is_pinned && '📌 '}{item.title}
                </Link>
                <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString('ru')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI History */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-900">Последние AI-запросы</h2>
          <Link to="/ai" className={`text-xs ${s.accent} font-semibold ${s.accentHover}`}>Открыть AI →</Link>
        </div>
        {aiHistory.length === 0 ? (
          <p className="text-slate-400 py-4 text-center text-sm">
            Пока нет запросов. <Link to="/ai" className={s.link}>Попробовать AI</Link>
          </p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {aiHistory.map((q) => (
              <li key={q.id} className="py-2.5">
                <p className="text-sm font-medium text-slate-900">{q.prompt}</p>
                <p className="text-xs text-slate-400 mt-0.5">{new Date(q.created_at).toLocaleDateString('ru')}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
