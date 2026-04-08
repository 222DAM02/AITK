import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import DynamicForm from '../components/DynamicForm'
import config from '../theme.config'

const { s } = config

export default function ItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) { itemsAPI.get(id).then(({ data }) => setInitialData(data)) }
    else { setInitialData({}) }
  }, [id])

  const handleSubmit = async (formData) => {
    setLoading(true); setError('')
    try {
      if (isEdit) { await itemsAPI.update(id, formData); navigate(`/items/${id}`) }
      else { const { data } = await itemsAPI.create(formData); navigate(`/items/${data.id}`) }
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join('. ') : 'Ошибка сохранения')
    } finally { setLoading(false) }
  }

  if (!initialData) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div></div>

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-600 hover:text-gray-400 text-sm mb-4 inline-block">← Назад</Link>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        {isEdit ? 'Редактировать колоду' : 'Новая колода'}
      </h1>
      {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-5 text-sm border border-red-500/20">{error}</div>}
      <div className={`${s.surface} rounded-2xl p-6`}>
        <DynamicForm initialData={initialData} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}