import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function ItemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    itemsAPI.get(id)
      .then(({ data }) => setItem(data))
      .catch(() => navigate('/items'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Удалить этот элемент?')) return
    await itemsAPI.delete(id)
    navigate('/items')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    )
  }
  if (!item) return null

  const isOwner = user?.id === item.owner

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">
        ← Назад к списку
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {item.image_url && (
          <img src={item.image_url} alt={item.title} className="w-full h-72 object-cover"
            onError={(e) => { e.target.style.display = 'none' }} />
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{item.title}</h1>

          <div className="space-y-5">
            {config.entityFields
              .filter((f) => f.name !== 'title' && item[f.name])
              .map((field) => (
                <div key={field.name}>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    {field.label}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item[field.name]}</p>
                </div>
              ))}
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`${s.badge} px-2.5 py-1 rounded-full text-xs font-medium`}>
                {item.owner_username}
              </span>
            </div>
            <span className="text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString('ru')}</span>
          </div>

          {isOwner && (
            <div className="mt-5 pt-5 border-t border-gray-100 flex gap-3">
              <Link to={`/items/${id}/edit`}
                className={`${s.btnPrimary} px-5 py-2.5 rounded-xl transition-colors`}>
                Редактировать
              </Link>
              <button onClick={handleDelete}
                className={`${s.btnDanger} px-5 py-2.5 rounded-xl transition-colors`}>
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
