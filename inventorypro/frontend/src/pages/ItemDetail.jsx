import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'
const { s } = config

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [movForm, setMovForm] = useState({ movement_type: 'in', quantity: '', note: '' })

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const addMovement = async (e) => {
    e.preventDefault()
    try { await itemsAPI.addMovement(id, { ...movForm, quantity: parseInt(movForm.quantity) }); setMovForm({ movement_type: 'in', quantity: '', note: '' }); load() } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const isLow = item.quantity <= item.min_stock

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            {item.sku && <p className="text-gray-400 text-sm mt-1">SKU: {item.sku}</p>}
          </div>
          <span className={`${isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} text-xs px-3 py-1 rounded-full font-medium`}>
            {isLow ? '⚠ Мало' : '✓ В наличии'}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-orange-600">{item.quantity}</p>
            <p className="text-xs text-gray-500">На складе</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gray-700">{item.min_stock}</p>
            <p className="text-xs text-gray-500">Минимум</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gray-700">{item.price ? `${parseFloat(item.price).toLocaleString('ru')} ₽` : '—'}</p>
            <p className="text-xs text-gray-500">Цена</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gray-700">{item.total_value ? `${parseFloat(item.total_value).toLocaleString('ru')} ₽` : '—'}</p>
            <p className="text-xs text-gray-500">Стоимость</p>
          </div>
        </div>
        {isOwner && <div className="flex gap-2 pt-4 border-t border-gray-100">
          <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">Ред.</Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">Удалить</button>
        </div>}
      </div>

      {/* Add movement */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Движение товара</h3>
        <form onSubmit={addMovement} className="flex flex-col sm:flex-row gap-2">
          <select value={movForm.movement_type} onChange={e => setMovForm({...movForm, movement_type: e.target.value})}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm">
            <option value="in">📥 Приход</option><option value="out">📤 Расход</option><option value="adjustment">🔄 Корректировка</option>
          </select>
          <input type="number" required value={movForm.quantity} onChange={e => setMovForm({...movForm, quantity: e.target.value})}
            placeholder="Кол-во" className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-24" />
          <input value={movForm.note} onChange={e => setMovForm({...movForm, note: e.target.value})}
            placeholder="Примечание" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          <button type="submit" className={`${s.btnPrimary} px-4 py-2 rounded-lg text-sm`}>Добавить</button>
        </form>
      </div>

      {/* Movements history */}
      {item.movements?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3">История движений</h3>
          <div className="space-y-2">
            {item.movements.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${m.movement_type==='in'?'text-emerald-500':m.movement_type==='out'?'text-red-500':'text-amber-500'}`}>
                    {m.movement_type==='in'?'📥':m.movement_type==='out'?'📤':'🔄'}
                  </span>
                  <div>
                    <span className="font-bold text-sm">{m.movement_type==='in'?'+':m.movement_type==='out'?'−':'±'}{m.quantity}</span>
                    {m.note && <p className="text-xs text-gray-400">{m.note}</p>}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{m.username}</p>
                  <p>{new Date(m.created_at).toLocaleString('ru')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
