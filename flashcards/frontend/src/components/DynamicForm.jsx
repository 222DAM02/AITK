import { useState } from 'react'
import config from '../theme.config'

const { s } = config

const inputClass = `w-full rounded-xl px-4 py-2.5 ${s.input} ${s.accentRing} focus:border-transparent transition-shadow`

export default function DynamicForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState(() => {
    const data = {}
    config.entityFields.forEach((field) => {
      data[field.name] = initialData[field.name] || (field.type === 'select' && field.options?.length ? field.options[0].value : '')
    })
    return data
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    config.entityFields.forEach((field) => {
      if (field.required && !formData[field.name]?.toString().trim()) {
        newErrors[field.name] = 'Обязательное поле'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit(formData)
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const renderField = (field) => {
    if (field.type === 'textarea')
      return <textarea value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={`Введите ${field.label.toLowerCase()}`} className={inputClass} rows={3} />
    if (field.type === 'select' && field.options)
      return <select value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} className={inputClass}>
        <option value="">Выберите...</option>
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    return <input type={field.type} value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}
      placeholder={`Введите ${field.label.toLowerCase()}`} className={inputClass} />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.entityFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>}
        </div>
      ))}
      <button type="submit" disabled={loading}
        className={`w-full ${s.btnPrimary} py-3 px-4 rounded-xl disabled:opacity-50 text-base transition-colors`}>
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  )
}
