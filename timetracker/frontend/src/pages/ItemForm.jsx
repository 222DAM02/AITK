import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/endpoints'
import config from '../theme.config'
import DynamicForm from '../components/DynamicForm'

const { s } = config

export default function ItemForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(id).then(r => { setData(r.data); setLoading(false) }).catch(() => navigate('/items'))
    }
  }, [id])

  const handleSubmit = async (formData) => {
    setSaving(true)
    try {
      if (isEdit) { await api.update(id, formData) } else { await api.create(formData) }
      navigate('/items')
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-cyan-500 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`${s.heroGradient} px-6 py-5`}>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⏱️</span> {isEdit ? 'Редактировать проект' : 'Новый проект'}
          </h1>
        </div>
        <div className="p-6">
          <DynamicForm fields={config.entityFields} initial={data} onSubmit={handleSubmit} saving={saving} />
        </div>
      </div>
    </div>
  )
}
