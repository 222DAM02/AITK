import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-stone-200 rounded-xl px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:ring-2 focus:ring-offset-1 focus:border-transparent transition-shadow text-sm`

const levelLabels = { beginner: '🌱 Начинающий', intermediate: '🌿 Средний', advanced: '🌳 Продвинутый' }
const levelClasses = { beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced' }

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [poses, setPoses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newPose, setNewPose] = useState({ pose_name: '', sanskrit_name: '', duration_seconds: 30, instructions: '', order: 0 })

  // Practice mode
  const [practicing, setPracticing] = useState(false)
  const [practiceIdx, setPracticeIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    Promise.all([itemsAPI.get(id), itemsAPI.getPoses(id)])
      .then(([itemRes, posesRes]) => {
        setItem(itemRes.data)
        setPoses(posesRes.data)
      })
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const isOwner = user?.id === item?.owner

  const handleDelete = async () => {
    if (!confirm('Удалить поток?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  const handleAddPose = async (e) => {
    e.preventDefault()
    if (!newPose.pose_name.trim()) return
    const payload = { ...newPose, order: poses.length }
    const { data } = await itemsAPI.addPose(id, payload)
    setPoses(prev => [...prev, data])
    setNewPose({ pose_name: '', sanskrit_name: '', duration_seconds: 30, instructions: '', order: 0 })
    setShowAdd(false)
  }

  const handleDeletePose = async (poseId) => {
    await itemsAPI.deletePose(id, poseId)
    setPoses(prev => prev.filter(p => p.id !== poseId))
  }

  const handleReorder = async (poseId, direction) => {
    const { data } = await itemsAPI.reorderPose(id, poseId, direction)
    setPoses(data)
  }

  const startPractice = () => {
    if (poses.length === 0) return
    setPracticeIdx(0)
    setTimeLeft(poses[0].duration_seconds)
    setPracticing(true)
  }

  const stopPractice = () => {
    setPracticing(false)
    clearInterval(timerRef.current)
  }

  const goToPose = (idx) => {
    setPracticeIdx(idx)
    setTimeLeft(poses[idx].duration_seconds)
  }

  useEffect(() => {
    if (!practicing || poses.length === 0) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const nextIdx = practiceIdx + 1
          if (nextIdx < poses.length) {
            setPracticeIdx(nextIdx)
            setTimeLeft(poses[nextIdx].duration_seconds)
            return poses[nextIdx].duration_seconds
          }
          clearInterval(timerRef.current)
          setPracticing(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [practicing, practiceIdx, poses])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
      </div>
    )
  }
  if (!item) return null

  const totalSeconds = poses.reduce((acc, p) => acc + p.duration_seconds, 0)
  const totalMin = Math.floor(totalSeconds / 60)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">
        ← Назад к потокам
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${levelClasses[item.level]}`}>
                {levelLabels[item.level]}
              </span>
              <span className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                {item.style}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            {item.description && (
              <p className="text-gray-500 text-sm mt-1">{item.description}</p>
            )}
            <div className="flex gap-4 mt-3 text-sm text-gray-400">
              {item.focus && <span>🎯 {item.focus}</span>}
              <span>🧘 {poses.length} поз</span>
              <span>⏱ ~{totalMin} мин</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/items/${id}/edit`} className={`${s.btnSecondary} px-4 py-2 rounded-xl text-sm`}>
                Редактировать
              </Link>
              <button onClick={handleDelete} className={`${s.btnDanger} px-4 py-2 rounded-xl text-sm`}>
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: pose list */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">Последовательность поз</h2>
            {isOwner && !showAdd && (
              <button
                onClick={() => setShowAdd(true)}
                className={`${s.btnPrimary} px-3 py-1.5 rounded-lg text-xs`}
              >
                + Добавить позу
              </button>
            )}
          </div>

          {showAdd && (
            <form onSubmit={handleAddPose} className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
              <div className="space-y-2">
                <input
                  value={newPose.pose_name}
                  onChange={e => setNewPose({ ...newPose, pose_name: e.target.value })}
                  placeholder="Название позы *"
                  className={inputClass}
                  required
                />
                <input
                  value={newPose.sanskrit_name}
                  onChange={e => setNewPose({ ...newPose, sanskrit_name: e.target.value })}
                  placeholder="Название на санскрите"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newPose.duration_seconds}
                    onChange={e => setNewPose({ ...newPose, duration_seconds: Number.parseInt(e.target.value) || 30 })}
                    placeholder="Сек"
                    className={`${inputClass} w-24`}
                    min="5"
                  />
                  <span className="text-sm text-gray-400 self-center">секунд</span>
                </div>
                <textarea
                  value={newPose.instructions}
                  onChange={e => setNewPose({ ...newPose, instructions: e.target.value })}
                  placeholder="Инструкции по выполнению"
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-lg text-xs`}>
                  Добавить
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="bg-white text-gray-600 px-4 py-2 rounded-lg text-xs border border-stone-200"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          {poses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 p-10 text-center">
              <span className="text-4xl block mb-2">🧘</span>
              <p className="text-gray-400 text-sm">Добавьте позы в поток</p>
            </div>
          ) : (
            <div className="space-y-2">
              {poses.map((pose, idx) => (
                <div
                  key={pose.id}
                  className={`bg-white rounded-xl border border-stone-100 p-4 flex items-center gap-3 transition-colors ${
                    practicing && practiceIdx === idx ? 'border-green-300 bg-green-50' : ''
                  }`}
                >
                  <div className="text-xl font-bold text-green-700 w-6 text-center">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{pose.pose_name}</p>
                    {pose.sanskrit_name && (
                      <p className="text-xs text-gray-400 italic">{pose.sanskrit_name}</p>
                    )}
                    <p className="text-xs text-green-600 mt-0.5">{pose.duration_seconds} сек</p>
                  </div>
                  {isOwner && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleReorder(pose.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-400 hover:text-green-700 disabled:opacity-30 text-lg"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(pose.id, 'down')}
                        disabled={idx === poses.length - 1}
                        className="p-1 text-stone-400 hover:text-green-700 disabled:opacity-30 text-lg"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleDeletePose(pose.id)}
                        className="p-1 text-stone-300 hover:text-red-500 text-sm ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Practice panel */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Режим практики</h2>

          {practicing ? (
            <div className="bg-gradient-to-br from-green-900 to-teal-800 rounded-2xl p-8 text-white text-center">
              <div className="text-xs text-white/50 mb-4">
                Поза {practiceIdx + 1} из {poses.length}
              </div>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-white/20 practice-ring"></div>
                <div className="absolute inset-0 rounded-full border-4 border-white/40 flex items-center justify-center">
                  <span className="text-4xl font-black">{timeLeft}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-1">{poses[practiceIdx]?.pose_name}</h3>
              {poses[practiceIdx]?.sanskrit_name && (
                <p className="text-white/50 text-sm italic mb-3">{poses[practiceIdx].sanskrit_name}</p>
              )}
              {poses[practiceIdx]?.instructions && (
                <p className="text-white/70 text-sm mb-5 max-w-xs mx-auto leading-relaxed">
                  {poses[practiceIdx].instructions}
                </p>
              )}
              <div className="flex justify-center gap-3">
                {practiceIdx > 0 && (
                  <button
                    onClick={() => goToPose(practiceIdx - 1)}
                    className="bg-white/15 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/25"
                  >
                    ← Пред
                  </button>
                )}
                {practiceIdx < poses.length - 1 && (
                  <button
                    onClick={() => goToPose(practiceIdx + 1)}
                    className="bg-white/15 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/25"
                  >
                    След →
                  </button>
                )}
                <button
                  onClick={stopPractice}
                  className="bg-red-500/80 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-500"
                >
                  Стоп ■
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-900 to-teal-800 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🧘</div>
              <h3 className="text-xl font-semibold mb-2">Начать практику</h3>
              <p className="text-white/60 text-sm mb-6">
                {poses.length > 0
                  ? `${poses.length} поз · ~${totalMin} минут`
                  : 'Добавьте позы чтобы начать'}
              </p>
              {poses.length > 0 && (
                <button
                  onClick={startPractice}
                  className="bg-white text-green-800 px-8 py-3 rounded-xl font-semibold hover:bg-stone-50 transition-colors shadow-lg"
                >
                  Начать ▶
                </button>
              )}
            </div>
          )}

          {/* Pose preview list during practice */}
          {poses.length > 0 && (
            <div className="mt-4 bg-white rounded-2xl border border-stone-100 p-4">
              <p className="text-xs text-gray-400 mb-2">Все позы</p>
              <div className="space-y-1">
                {poses.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg ${
                      practicing && practiceIdx === idx
                        ? 'bg-green-50 text-green-800 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    <span className="w-4">{idx + 1}.</span>
                    <span className="flex-1">{p.pose_name}</span>
                    <span className="text-stone-400">{p.duration_seconds}с</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
