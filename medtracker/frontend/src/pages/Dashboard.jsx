import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI, aiAPI, authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

const timeLabels = { morning: '🌅 Утро', afternoon: '☀️ День', evening: '🌆 Вечер', night: '🌙 Ночь' }

export default function Dashboard() {
  const { user, fetchProfile } = useAuth()
  const [todaySchedule, setTodaySchedule] = useState([])
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })
  const [loadingDose, setLoadingDose] = useState({})

  useEffect(() => {
    itemsAPI.today().then(({ data }) => setTodaySchedule(data))
    itemsAPI.myStats().then(({ data }) => setStats(data))
  }, [])

  useEffect(() => { if (user) setProfileForm({ username: user.username, email: user.email }) }, [user])

  const handleProfileSave = async () => {
    try { await authAPI.updateProfile(profileForm); await fetchProfile(); setEditing(false) } catch {}
  }

  const handleDoseLog = async (item, doseStatus) => {
    const key = `${item.medication_id}-${item.time_of_day}`
    setLoadingDose(prev => ({ ...prev, [key]: true }))
    try {
      await itemsAPI.logDose(item.medication_id, {
        time_of_day: item.time_of_day,
        status: doseStatus,
        date: item.date,
      })
      setTodaySchedule(prev => prev.map(d =>
        d.medication_id === item.medication_id && d.time_of_day === item.time_of_day
          ? { ...d, status: doseStatus }
          : d
      ))
    } finally {
      setLoadingDose(prev => ({ ...prev, [key]: false }))
    }
  }

  const taken = todaySchedule.filter(d => d.status === 'taken').length
  const total = todaySchedule.length
  const percent = total > 0 ? Math.round((taken / total) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Расписание на сегодня</h1>
          <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('ru', {weekday:'long', day:'numeric', month:'long'})}</p>
        </div>
        <Link to="/items/new" className={`${s.btnPrimary} px-4 py-2 rounded-xl text-sm`}>+ Добавить лекарство</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Today's progress */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">Приёмы сегодня</h2>
            <span className={`text-sm font-bold ${percent === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
              {taken}/{total} принято
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
            <div className={`h-2 rounded-full transition-all ${percent === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${percent}%` }}></div>
          </div>

          {todaySchedule.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-2">📋</span>
              <p className="text-gray-400 text-sm">Нет активных лекарств с расписанием</p>
              <Link to="/items/new" className={`inline-block mt-2 text-sm ${s.accent} font-medium`}>Добавить лекарство →</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySchedule.map((item) => {
                const key = `${item.medication_id}-${item.time_of_day}`
                const isTaken = item.status === 'taken'
                return (
                  <div key={key} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isTaken ? 'bg-emerald-50' : 'bg-gray-50 hover:bg-blue-50'}`}>
                    <button
                      onClick={() => handleDoseLog(item, isTaken ? 'missed' : 'taken')}
                      disabled={loadingDose[key]}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isTaken ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 hover:border-blue-400'
                      }`}>
                      {isTaken && <span className="text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isTaken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.medication_title}
                      </p>
                      <p className="text-xs text-gray-400">{item.dosage || ''} · {timeLabels[item.time_of_day]}</p>
                    </div>
                    {item.status === 'missed' && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Пропущено</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats card */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Статистика</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Активных</span>
                <span className="text-lg font-bold text-blue-600">{stats?.active_medications || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Всего лекарств</span>
                <span className="text-lg font-bold text-gray-900">{stats?.total_medications || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Соблюдение</span>
                <span className={`text-lg font-bold ${(stats?.adherence_percent || 0) >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {stats?.adherence_percent || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-gray-900 text-sm">Профиль</h2>
              {!editing && <button onClick={() => setEditing(true)} className={`text-xs ${s.accent} font-medium`}>Изменить</button>}
            </div>
            {editing ? (
              <div className="space-y-2">
                <input value={profileForm.username} onChange={(e) => setProfileForm({...profileForm, username: e.target.value})} className={inputClass} placeholder="Имя" />
                <input value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} className={inputClass} placeholder="Email" />
                <div className="flex gap-2 pt-1">
                  <button onClick={handleProfileSave} className={`${s.btnPrimary} px-4 py-1.5 rounded-lg text-xs`}>Сохранить</button>
                  <button onClick={() => setEditing(false)} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-xs">Отмена</button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-gray-900 font-medium">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
