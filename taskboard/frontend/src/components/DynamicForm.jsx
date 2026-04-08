import { useState } from 'react'
import config from '../theme.config'

const { s } = config

const inputClass = `w-full border border-slate-600 rounded-xl px-4 py-2.5 bg-slate-900/60 text-slate-200 placeholder-slate-500 focus:ring-violet-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:border-transparent transition-shadow`

export default function DynamicForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState(() => {
    const data = {}
    config.entityFields.forEach((field) => {
      data[field.name] = initialData[field.name] ?? ''
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {config.entityFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-slate-300 mb-1.5">
            {field.label} {field.required && <span className="text-red-400">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Введите ${field.label.toLowerCase()}`}
              className={inputClass}
              rows={4}
            />
          ) : field.type === 'select' ? (
            <select
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={inputClass}
            >
              <option value="">— Выберите —</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={formData[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.type !== 'date' ? `Введите ${field.label.toLowerCase()}` : undefined}
              className={inputClass}
            />
          )}
          {errors[field.name] && (
            <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
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
