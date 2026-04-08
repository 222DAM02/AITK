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

  useEffect(() => { itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items')) }, [id])
  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isOwner = user && item.owner === user.id
  const typeLabel = config.entityFields.find(f=>f.name==='property_type')?.options?.find(o=>o.value===item.property_type)?.label || ''
  const dealLabel = config.entityFields.find(f=>f.name==='deal_type')?.options?.find(o=>o.value===item.deal_type)?.label || ''

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-stone-800 to-amber-800 text-white px-6 py-8">
          <div className="flex gap-2 mb-2">
            <span className="bg-white/20 text-sm px-3 py-0.5 rounded-full">{typeLabel}</span>
            <span className="bg-white/20 text-sm px-3 py-0.5 rounded-full">{dealLabel}</span>
            <span className="bg-white/20 text-sm px-3 py-0.5 rounded-full">{item.status}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
          {item.address && <p className="text-white/70">📍 {item.address}{item.district ? `, ${item.district}` : ''}</p>}
        </div>
        <div className="p-6">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl font-black text-amber-700">{parseFloat(item.price).toLocaleString('ru')} ₽</span>
            {item.price_per_m2 && <span className="text-sm text-gray-400">{parseFloat(item.price_per_m2).toLocaleString('ru')} ₽/м²</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {item.area && <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-xl font-bold text-amber-700">{item.area} м²</p><p className="text-xs text-gray-500">Площадь</p></div>}
            {item.rooms && <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xl font-bold">{item.rooms}</p><p className="text-xs text-gray-500">Комнат</p></div>}
            {item.floor && <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xl font-bold">{item.floor}{item.total_floors ? `/${item.total_floors}` : ''}</p><p className="text-xs text-gray-500">Этаж</p></div>}
            <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-xl font-bold">{item.owner_username}</p><p className="text-xs text-gray-500">Продавец</p></div>
          </div>
          {item.description && <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>}
          {isOwner && <div className="flex gap-2 pt-4 border-t border-gray-100">
            <Link to={`/items/${id}/edit`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm">Ред.</Link>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm">Удалить</button>
          </div>}
        </div>
      </div>
    </div>
  )
}
