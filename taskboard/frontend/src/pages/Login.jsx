import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-slate-600 rounded-xl px-4 py-2.5 bg-slate-900/60 text-slate-200 placeholder-slate-500 focus:ring-violet-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-800 focus:border-transparent transition-shadow`

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/board')
    } catch {
      setError('Неверное имя пользователя или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">{config.projectIcon}</span>
          <h1 className="text-3xl font-bold text-white">Вход</h1>
          <p className="text-slate-400 mt-2">Войдите в {config.projectName}</p>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
          {location.state?.registered && (
            <div className="bg-emerald-900/40 text-emerald-300 p-3 rounded-xl mb-5 text-sm border border-emerald-700/50">
              Регистрация успешна! Теперь войдите.
            </div>
          )}
          {error && (
            <div className="bg-red-900/40 text-red-300 p-3 rounded-xl mb-5 text-sm border border-red-700/50">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Имя пользователя</label>
              <input type="text" required value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">Пароль</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Ваш пароль" className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className={`w-full ${s.btnPrimary} py-3 rounded-xl disabled:opacity-50 transition-colors text-base`}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-slate-400">
          Нет аккаунта?{' '}
          <Link to="/register" className={`${s.accent} font-semibold ${s.accentHover}`}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
