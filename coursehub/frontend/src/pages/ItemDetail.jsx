import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

const levelLabels = { beginner: 'Начальный', intermediate: 'Средний', advanced: 'Продвинутый' }

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [enrolling, setEnrolling] = useState(false)

  useEffect(() => {
    itemsAPI.get(id)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))

    // Check if enrolled
    itemsAPI.myEnrollments().then(({ data }) => {
      const list = data.results || data
      const found = list.find((e) => e.course === parseInt(id))
      if (found) {
        setEnrolled(true)
        setProgress(found.progress)
      }
    }).catch(() => {})
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await itemsAPI.enroll(id)
      setEnrolled(true)
      setProgress(0)
    } catch {}
    setEnrolling(false)
  }

  const handleProgress = async (val) => {
    const newVal = Math.min(100, Math.max(0, val))
    setProgress(newVal)
    await itemsAPI.updateProgress(id, newVal)
  }

  const handleDelete = async () => {
    if (!confirm('Удалить этот курс?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    )
  }
  if (!item) return null

  const isOwner = user?.id === item.owner

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">
        ← Каталог курсов
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {item.image_url && (
            <img src={item.image_url} alt={item.title} className="w-full h-56 object-cover"
              onError={(e) => { e.target.style.display = 'none' }} />
          )}
          <div className="p-8">
            {item.category && (
              <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wider">
                {item.category}
              </span>
            )}
            <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-4">{item.title}</h1>

            <div className="space-y-5">
              {config.entityFields
                .filter((f) => f.name !== 'title' && f.name !== 'category' && f.name !== 'image_url' && item[f.name])
                .map((field) => (
                  <div key={field.name}>
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                      {field.label}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {field.name === 'level' ? (levelLabels[item[field.name]] || item[field.name]) : item[field.name]}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Enroll card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">Студентов</p>
              <p className="text-3xl font-bold text-indigo-600">{item.enrolled_count || 0}</p>
            </div>

            {!isOwner && !enrolled && (
              <button onClick={handleEnroll} disabled={enrolling}
                className={`w-full ${s.btnPrimary} py-3 rounded-xl text-base transition-colors disabled:opacity-50`}>
                {enrolling ? 'Запись...' : 'Записаться на курс'}
              </button>
            )}

            {enrolled && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Ваш прогресс</span>
                  <span className="font-bold text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleProgress(progress + 10)}
                    className={`flex-1 ${s.btnSecondary} py-2 rounded-lg text-sm`}>
                    +10%
                  </button>
                  <button onClick={() => handleProgress(100)}
                    className={`flex-1 ${s.btnSuccess} py-2 rounded-lg text-sm`}>
                    Завершить
                  </button>
                </div>
                {progress >= 100 && (
                  <div className="mt-3 text-center text-emerald-600 font-semibold text-sm">
                    Курс завершён!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            {item.lessons_count > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Уроков</span>
                <span className="font-medium text-gray-900">{item.lessons_count}</span>
              </div>
            )}
            {item.duration_hours > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Часов</span>
                <span className="font-medium text-gray-900">{item.duration_hours}</span>
              </div>
            )}
            {item.level && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Уровень</span>
                <span className="font-medium text-gray-900">{levelLabels[item.level]}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Автор</span>
              <span className={`${s.badge} px-2 py-0.5 rounded-full text-xs font-medium`}>
                {item.owner_username}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Создан</span>
              <span className="text-gray-900">{new Date(item.created_at).toLocaleDateString('ru')}</span>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`}
                className={`flex-1 text-center ${s.btnPrimary} py-2.5 rounded-xl text-sm`}>
                Редактировать
              </Link>
              <button onClick={handleDelete}
                className={`flex-1 ${s.btnDanger} py-2.5 rounded-xl text-sm`}>
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
