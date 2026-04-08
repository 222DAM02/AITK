import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full rounded-xl px-4 py-2.5 ${s.input} ${s.accentRing} focus:border-transparent transition-shadow`

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [stats, setStats] = useState([])
  const [aiHistory, setAiHistory] = useState([])
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })

  useEffect(() => {
    itemsAPI.myList().then(({ data }) => setMyItems(data.results || data))
    itemsAPI.myStats().then(({ data }) => setStats(data.results || data)).catch(() => {})
    aiAPI.history().then(({ data }) => setAiHistory((data.results || data).slice(0, 5)))
  }, [])

  useEffect(() => {
    if (user) setProfileForm({ username: user.username, email: user.email })
  }, [user])

  const handleProfileSave = async () => {
    try { await authAPI.updateProfile(profileForm); await fetchProfile(); setEditing(false) } catch {}
  }

  const totalCards = myItems.reduce((sum, d) => sum + (d.cards_count || 0), 0)
  const avgScore = stats.length > 0
    ? Math.round(stats.reduce((s, x) => s + (x.score_percent || 0), 0) / stats.length)
    : 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Привет, {user?.username}!</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Колод', value: myItems.length, color: 'text-teal-400' },
          { label: 'Карточек', value: totalCards, color: 'text-cyan-400' },
          { label: 'Сессий', value: stats.length, color: 'text-purple-400' },
          { label: 'Ср. балл', value: `${avgScore}%`, color: 'text-emerald-400' },
        ].map((st) => (
          <div key={st.label} className={`${s.surface} rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{st.label}</p>
            <p className={`text-2xl font-bold ${st.color}`}>{st.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Study History */}
        <div className={`${s.surface} rounded-xl p-5`}>
          <h2 className="text-base font-bold text-gray-200 mb-4">Последние сессии</h2>
          {stats.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">Ещё не изучали карточки</p>
          ) : (
            <ul className="space-y-2">
              {stats.slice(0, 5).map((ss) => (
                <li key={ss.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{ss.deck_title}</span>
                  <span className={`font-bold ${ss.score_percent >= 70 ? 'text-emerald-400' : ss.score_percent >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {ss.score_percent}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile */}
        <div className={`${s.surface} rounded-xl p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-200">Профиль</h2>
            {!editing && <button onClick={() => setEditing(true)} className={`text-xs ${s.accent}`}>Изменить</button>}
          </div>
          {editing ? (
            <div className="space-y-3">
              <input value={profileForm.username} onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} className={inputClass} />
              <input value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className={inputClass} />
              <div className="flex gap-2">
                <button onClick={handleProfileSave} className={`${s.btnPrimary} px-4 py-2 rounded-lg text-sm`}>Сохранить</button>
                <button onClick={() => setEditing(false)} className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm">Отмена</button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Имя:</span> <span className="text-gray-200">{user?.username}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="text-gray-200">{user?.email}</span></p>
              <p><span className="text-gray-500">Роль:</span> <span className="text-gray-200">{user?.role}</span></p>
            </div>
          )}
        </div>

        {/* My Decks */}
        <div className={`${s.surface} rounded-xl p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-200">Мои колоды</h2>
            <Link to="/items/new" className={`text-xs ${s.accent}`}>+ Создать</Link>
          </div>
          {myItems.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">Создайте первую колоду</p>
          ) : (
            <ul className="space-y-2">
              {myItems.slice(0, 5).map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <Link to={`/items/${item.id}`} className={`${s.accent} ${s.accentHover}`}>{item.title}</Link>
                  <span className="text-gray-600">{item.cards_count || 0} карт.</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI */}
        <div className={`${s.surface} rounded-xl p-5`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-gray-200">AI-запросы</h2>
            <Link to="/ai" className={`text-xs ${s.accent}`}>Открыть →</Link>
          </div>
          {aiHistory.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">Попробуйте <Link to="/ai" className={s.link}>AI-генератор</Link></p>
          ) : (
            <ul className="space-y-2">
              {aiHistory.map((q) => (
                <li key={q.id} className="text-sm">
                  <p className="text-gray-300 line-clamp-1">{q.prompt}</p>
                  <p className="text-gray-600 text-xs">{new Date(q.created_at).toLocaleDateString('ru')}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}