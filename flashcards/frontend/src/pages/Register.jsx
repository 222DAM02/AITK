import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full rounded-xl px-4 py-2.5 ${s.input} ${s.accentRing} focus:border-transparent transition-shadow`

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return }
    if (!form.email.includes('@')) { setError('Введите корректный email'); return }
    setLoading(true)
    try {
      await authAPI.register(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join('. ') : 'Ошибка регистрации')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">{config.projectIcon}</span>
          <h1 className="text-2xl font-bold text-gray-100">Создать аккаунт</h1>
          <p className="text-gray-500 mt-2 text-sm">Присоединяйтесь к {config.projectName}</p>
        </div>
        <div className={`${s.surface} rounded-2xl p-8`}>
          {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-5 text-sm border border-red-500/20">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Имя пользователя</label>
              <input type="text" required value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} placeholder="username" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="email@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Пароль</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Минимум 6 символов" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Повторите пароль</label>
              <input type="password" required value={form.password2} onChange={(e) => setForm({...form, password2: e.target.value})} placeholder="Повторите пароль" className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className={`w-full ${s.btnPrimary} py-3 rounded-xl disabled:opacity-50 transition-colors`}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-gray-500 text-sm">
          Уже есть аккаунт? <Link to="/login" className={`${s.accent} font-semibold ${s.accentHover}`}>Войти</Link>
        </p>
      </div>
    </div>
  )
}