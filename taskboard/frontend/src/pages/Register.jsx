import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-slate-600 rounded-xl px-4 py-2.5 bg-slate-900/60 text-slate-200 placeholder-slate-500 focus:ring-violet-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:border-transparent transition-shadow`

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">{config.projectIcon}</span>
          <h1 className="text-3xl font-bold text-white">Создать аккаунт</h1>
          <p className="text-slate-400 mt-2">Присоединяйтесь к {config.projectName}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {error && (
            <div className="bg-red-900/40 text-red-300 p-3 rounded-xl mb-5 text-sm border border-red-700/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="block text-sm font-semibold text-slate-300 mb-1.5">Имя пользователя</label>
              <input id="reg-username" type="text" required value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username" className={inputClass} />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-300 mb-1.5">Email</label>
              <input id="reg-email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com" className={inputClass} />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-300 mb-1.5">Пароль</label>
              <input id="reg-password" type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Минимум 6 символов" className={inputClass} />
            </div>
            <div>
              <label htmlFor="reg-password2" className="block text-sm font-semibold text-slate-300 mb-1.5">Повторите пароль</label>
              <input id="reg-password2" type="password" required value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
                placeholder="Повторите пароль" className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className={`w-full ${s.btnPrimary} py-3 rounded-xl disabled:opacity-50 transition-colors text-base`}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-slate-400">
          Уже есть аккаунт?{' '}
          <Link to="/login" className={`${s.accent} font-semibold ${s.accentHover}`}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
