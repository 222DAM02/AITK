import { useState } from 'react'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

const TIME_OPTIONS = [
  { value: 'morning', label: '🌅 Утро (~08:00)' },
  { value: 'afternoon', label: '☀️ День (~13:00)' },
  { value: 'evening', label: '🌆 Вечер (~19:00)' },
  { value: 'night', label: '🌙 Ночь (~22:00)' },
]

export default function DynamicForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState(() => {
    const data = {}
    config.entityFields.forEach((field) => { data[field.name] = initialData[field.name] || (field.type === 'select' && field.options?.length ? field.options[0].value : '') })
    return data
  })
  const [scheduleTimes, setScheduleTimes] = useState(() => {
    return (initialData.schedules || []).map(s => s.time_of_day)
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    config.entityFields.forEach((field) => {
      if (field.required && !formData[field.name]?.toString().trim()) newErrors[field.name] = 'Обязательное поле'
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const toggleTime = (val) => {
    setScheduleTimes(prev => prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSubmit({ ...formData, schedule_times: scheduleTimes })
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {config.entityFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Введите ${field.label.toLowerCase()}`} className={inputClass} rows={3} />
          ) : field.type === 'select' ? (
            <select value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)} className={inputClass}>
              <option value="">Выберите...</option>
              {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          ) : (
            <input type={field.type} value={formData[field.name]} onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.type !== 'date' ? `Введите ${field.label.toLowerCase()}` : ''} className={inputClass} />
          )}
          {errors[field.name] && <p className="text-red-500 text-sm mt-1.5">⚠ {errors[field.name]}</p>}
        </div>
      ))}

      {/* Schedule times */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Расписание приёма</label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => toggleTime(opt.value)}
              className={`p-3 rounded-xl text-sm font-medium border-2 transition-colors text-left ${
                scheduleTimes.includes(opt.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className={`w-full ${s.btnPrimary} py-3 px-4 rounded-xl disabled:opacity-50 text-base transition-colors`}>
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  )
}
