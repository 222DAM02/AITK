import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/endpoints'
import config from '../theme.config'

const { s } = config

function fmt(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}ч ${m}м` : `${m}м`
}

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [desc, setDesc] = useState('')
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [manualStart, setManualStart] = useState('')
  const [manualEnd, setManualEnd] = useState('')
  const [manualDesc, setManualDesc] = useState('')
  const [manualBillable, setManualBillable] = useState(true)

  const load = async () => {
    try {
      const r = await api.get(id)
      setItem(r.data)
      setEntries(r.data.entries || [])
    } catch { navigate('/items') }
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const startTimer = async () => {
    setAdding(true)
    try {
      await api.startTimer(id, desc)
      setDesc('')
      load()
    } catch {}
    setAdding(false)
  }

  const deleteEntry = async (eid) => {
    if (!confirm('Удалить запись?')) return
    try {
      await api.deleteEntry(id, eid)
      load()
    } catch {}
  }

  const toggleBillable = async (eid, val) => {
    try {
      await api.updateEntry(id, eid, { is_billable: !val })
      load()
    } catch {}
  }

  const addManual = async (e) => {
    e.preventDefault()
    try {
      await api.addEntry(id, {
        start_time: new Date(manualStart).toISOString(),
        end_time: new Date(manualEnd).toISOString(),
        description: manualDesc,
        is_billable: manualBillable,
      })
      setShowForm(false)
      setManualStart('')
      setManualEnd('')
      setManualDesc('')
      setManualBillable(true)
      load()
    } catch {}
  }

  const handleDelete = async () => {
    if (!confirm('Удалить проект?')) return
    try {
      await api.delete(id)
      navigate('/items')
    } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" /></div>
  if (!item) return null

  const isOwner = user && item.owner === user.id
  const colorClass = `color-${item.color}`
  const totalMins = item.total_minutes || 0
  const billableMins = entries.filter(e => e.is_billable && e.end_time).reduce((s, e) => s + (e.duration_minutes || 0), 0)
  const earnings = item.hourly_rate ? (billableMins / 60 * parseFloat(item.hourly_rate)).toFixed(2) : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-4 h-4 rounded-full ${colorClass}`} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.status === 'active' ? 'bg-green-100 text-green-700' :
                item.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                item.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {config.entityFields.find(f => f.name === 'status')?.options?.find(o => o.value === item.status)?.label || item.status}
              </span>
              {item.hourly_rate && <span className="text-sm text-gray-500">{item.hourly_rate} ₽/ч</span>}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">Редактировать</Link>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition">Удалить</button>
          </div>
        )}
      </div>

      {item.description && <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Всего записей</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{entries.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Общее время</p>
          <p className="text-2xl font-bold text-cyan-600 mt-1">{fmt(totalMins)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Оплачиваемое</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{fmt(billableMins)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Заработок</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{earnings ? `${earnings} ₽` : '—'}</p>
        </div>
      </div>

      {/* Quick timer */}
      {item.status === 'active' && (
        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl p-5 border border-cyan-100 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Быстрый таймер</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Описание задачи..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-cyan-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
            />
            <button
              onClick={startTimer}
              disabled={adding}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <span className="text-lg">▶</span> Старт
            </button>
          </div>
        </div>
      )}

      {/* Entries */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Записи времени</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
          {showForm ? 'Отмена' : '+ Добавить вручную'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addManual} className="bg-white rounded-xl p-5 border border-gray-200 mb-4 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
              <input type="datetime-local" required value={manualStart} onChange={e => setManualStart(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Конец</label>
              <input type="datetime-local" required value={manualEnd} onChange={e => setManualEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-cyan-400" />
            </div>
          </div>
          <input type="text" placeholder="Описание" value={manualDesc} onChange={e => setManualDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 focus:ring-2 focus:ring-cyan-400" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={manualBillable} onChange={e => setManualBillable(e.target.checked)}
                className="rounded text-cyan-600 focus:ring-cyan-400" /> Оплачиваемое
            </label>
            <button type="submit" className="px-5 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition">Добавить</button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {entries.length === 0 && <p className="text-gray-400 text-center py-8">Записей пока нет. Запустите таймер!</p>}
        {entries.map(e => (
          <div key={e.id} className={`bg-white rounded-xl p-4 border ${!e.end_time ? 'border-cyan-300 bg-cyan-50/30' : 'border-gray-100'} shadow-sm flex items-center gap-4`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {!e.end_time && <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 timer-pulse" />}
                <p className="text-sm font-medium text-gray-900 truncate">{e.description || 'Без описания'}</p>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {fmtDate(e.start_time)} → {e.end_time ? fmtDate(e.end_time) : 'В процессе...'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {e.is_billable && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">₽</span>}
              <button onClick={() => toggleBillable(e.id, e.is_billable)} className="text-xs text-gray-400 hover:text-cyan-600">
                {e.is_billable ? '💰' : '⊘'}
              </button>
              <span className="text-sm font-mono font-semibold text-gray-700 w-16 text-right">
                {e.end_time ? fmt(e.duration_minutes) : '⏱️'}
              </span>
              {isOwner && (
                <button onClick={() => deleteEntry(e.id)} className="text-gray-300 hover:text-red-500 transition">✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
