import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { itemsAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const catLabels = Object.fromEntries(config.entityFields.find(f => f.name === 'category')?.options?.map(o => [o.value, o.label]) || [])

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { itemsAPI.get(id).then(({ data }) => { setItem(data); setLoading(false) }).catch(() => navigate('/items')) }, [id])

  const handleDelete = async () => { if (confirm('Удалить?')) { await itemsAPI.delete(id); navigate('/items') } }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>
  if (!item) return null
  const isIncome = item.type === 'income'
  const isOwner = user && item.owner === user.id

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="finance-card p-8">
        <div className="flex items-center justify-between mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isIncome ? 'income-tag' : 'expense-tag'}`}>
            {isIncome ? 'Доход' : 'Расход'}
          </span>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/items/${id}/edit`} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">Редактировать</Link>
              <button onClick={handleDelete} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">Удалить</button>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
        <p className={`text-3xl font-bold mono ${isIncome ? 'text-emerald-600' : 'text-red-500'} mb-6`}>
          {isIncome ? '+' : '−'}{parseFloat(item.amount).toLocaleString('ru')} {item.currency === 'RUB' ? '₽' : item.currency}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-400">Категория</span><p className="font-medium text-gray-900">{catLabels[item.category] || item.category}</p></div>
          <div><span className="text-gray-400">Дата</span><p className="font-medium text-gray-900">{item.date}</p></div>
          <div><span className="text-gray-400">Валюта</span><p className="font-medium text-gray-900">{item.currency}</p></div>
          <div><span className="text-gray-400">Автор</span><p className="font-medium text-gray-900">{item.owner_username}</p></div>
        </div>
        {item.description && <div className="mt-6 pt-6 border-t border-gray-100"><p className="text-gray-600">{item.description}</p></div>}
      </div>
    </div>
  )
}
