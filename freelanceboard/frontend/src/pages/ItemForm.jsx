import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { itemsAPI } from '../api/endpoints'
import DynamicForm from '../components/DynamicForm'
import config from '../theme.config'

export default function ItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      itemsAPI.get(id).then(({ data }) => setInitialData(data))
    } else {
      setInitialData({})
    }
  }, [id])

  const handleSubmit = async (rawData) => {
    setLoading(true)
    setError('')
    // Clean empty strings to null for optional fields
    const formData = Object.fromEntries(
      Object.entries(rawData).map(([k, v]) => [k, v === '' ? null : v])
    )
    try {
      if (isEdit) {
        await itemsAPI.update(id, formData)
        navigate(`/items/${id}`)
      } else {
        const { data } = await itemsAPI.create(formData)
        navigate(`/items/${data.id}`)
      }
    } catch (err) {
      const data = err.response?.data
      if (data) {
        const messages = Object.values(data).flat().join('. ')
        setError(messages)
      } else {
        setError('Ошибка сохранения')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!initialData) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/items" className="text-gray-400 hover:text-gray-600 text-sm mb-4 inline-block">
        ← Назад к списку
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {isEdit ? `Редактировать ${config.entityName.toLowerCase()}` : `Новый ${config.entityName.toLowerCase()}`}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <DynamicForm initialData={initialData} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
