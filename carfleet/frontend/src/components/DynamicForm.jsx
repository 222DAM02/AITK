import { useState } from 'react'
import config from '../theme.config'

const { s } = config

const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

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
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {config.entityFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Введите ${field.label.toLowerCase()}`}
              className={inputClass}
              rows={4}
            />
          ) : field.type === 'select' && field.options ? (
            <select
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={inputClass}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Введите ${field.label.toLowerCase()}`}
              className={inputClass}
            />
          )}
          {errors[field.name] && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors[field.name]}
            </p>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${s.btnPrimary} py-3 px-4 rounded-xl disabled:opacity-50 text-base transition-colors`}
      >
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  )
}
