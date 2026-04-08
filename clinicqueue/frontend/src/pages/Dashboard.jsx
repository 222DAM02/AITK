import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

const specLabels = Object.fromEntries(config.entityFields.find(f => f.name === 'specialization')?.options?.map(o => [o.value, o.label]) || [])
const specIcons = { therapist: '🩺', surgeon: '🔪', dentist: '🦷', cardiologist: '❤️', neurologist: '🧠', ophthalmologist: '👁️', dermatologist: '🧴', pediatrician: '👶', ent: '👂', orthopedist: '🦴' }

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { itemsAPI.myStats().then(({ data }) => { setStats(data); setLoading(false) }) }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" /></div>

  const specs = Object.entries(stats?.by_spec || {}).sort((a, b) => b[1] - a[1])
  const maxSpec = specs.length ? specs[0][1] : 1

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <span className="text-2xl">📋</span>
          <p className="text-3xl font-black text-teal-600 mt-2">{stats?.my_appointments || 0}</p>
          <p className="text-xs text-gray-400">Всего записей</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <span className="text-2xl">🔜</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{stats?.upcoming || 0}</p>
          <p className="text-xs text-gray-400">Предстоящих</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <span className="text-2xl">👨‍⚕️</span>
          <p className="text-3xl font-black text-gray-900 mt-2">{specs.length}</p>
          <p className="text-xs text-gray-400">Специализаций</p>
        </div>
      </div>

      {/* Specializations chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h3 className="font-bold text-gray-900 mb-5">Врачи по специализациям</h3>
        {specs.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">Нет данных</p> : (
          <div className="space-y-4">
            {specs.map(([spec, count]) => (
              <div key={spec} className="flex items-center gap-3">
                <span className="text-2xl w-8 text-center">{specIcons[spec] || '👨‍⚕️'}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{specLabels[spec] || spec}</span>
                    <span className="font-bold text-teal-600">{count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxSpec) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link to="/items" className={`${s.btnPrimary} px-6 py-3 rounded-xl text-sm block text-center`}>Найти врача →</Link>
    </div>
  )
}
