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
  const [propForm, setPropForm] = useState({ price: '', message: '' })
  const [showProp, setShowProp] = useState(false)

  const load = () => itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items'))
  useEffect(() => { load() }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }
  const submitProposal = async (e) => {
    e.preventDefault()
    try { await itemsAPI.addProposal(id, propForm); setShowProp(false); setPropForm({ price: '', message: '' }); load() }
    catch(e) { alert(e.response?.data?.detail || 'Ошибка') }
  }
  const updateProp = async (propId, status) => {
    try { await itemsAPI.updateProposal(id, propId, { status }); load() } catch {}
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-sky-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const alreadyProposed = item.proposals?.some(p => p.freelancer === user?.id)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`${s.badge} text-xs px-2.5 py-0.5 rounded-full`}>{item.status}</span>
          <span className="text-sm text-gray-400">{item.budget_type === 'fixed' ? 'Фикс' : 'Почасовая'}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
        {item.description && <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>}
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          {item.budget && <span className="text-xl font-black text-sky-600">{parseFloat(item.budget).toLocaleString('ru')} ₽</span>}
          {item.deadline && <span className="text-gray-400">Дедлайн: {item.deadline}</span>}
          <span className="text-gray-400">{item.proposals_count || 0} откликов</span>
        </div>
        {item.skills && (
          <div className="flex flex-wrap gap-1 mb-4">
            {item.skills.split(',').map((sk, i) => <span key={i} className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full">{sk.trim()}</span>)}
          </div>
        )}

        {!isOwner && item.status === 'open' && !alreadyProposed && (
          <button onClick={() => setShowProp(!showProp)} className={`${s.btnPrimary} px-6 py-2.5 rounded-xl text-sm w-full`}>
            {showProp ? 'Отмена' : '✍️ Откликнуться'}
          </button>
        )}
        {alreadyProposed && <p className="text-emerald-600 text-sm font-medium text-center py-2">✓ Вы уже откликнулись</p>}

        {showProp && (
          <form onSubmit={submitProposal} className="mt-4 bg-sky-50 rounded-xl p-4 space-y-3">
            <input type="number" required value={propForm.price} onChange={e => setPropForm({...propForm, price: e.target.value})}
              placeholder="Ваша цена (₽)" className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" />
            <textarea required value={propForm.message} onChange={e => setPropForm({...propForm, message: e.target.value})}
              placeholder="Сопроводительное сообщение..." className="w-full px-3 py-2 rounded-lg border border-sky-200 text-sm" rows={3} />
            <button type="submit" className={`${s.btnPrimary} px-5 py-2 rounded-lg text-sm`}>Отправить отклик</button>
          </form>
        )}

        {isOwner && <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">Ред.</Link>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">Удалить</button>
        </div>}
      </div>

      {/* Proposals */}
      {item.proposals?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-3">Отклики ({item.proposals.length})</h3>
          <div className="space-y-3">
            {item.proposals.map(p => (
              <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-semibold text-sm">{p.freelancer_name}</span>
                    <span className="text-sky-600 font-bold ml-3">{parseFloat(p.price).toLocaleString('ru')} ₽</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status==='accepted'?'bg-emerald-100 text-emerald-700':p.status==='rejected'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{p.status}</span>
                </div>
                <p className="text-sm text-gray-600">{p.message}</p>
                {isOwner && p.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => updateProp(p.id, 'accepted')} className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">Принять</button>
                    <button onClick={() => updateProp(p.id, 'rejected')} className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-lg">Отклонить</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
