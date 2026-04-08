import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(form.username, form.password); navigate('/dashboard')
    } catch { setError('Неверное имя пользователя или пароль')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">{config.projectIcon}</span>
          <h1 className="text-2xl font-bold text-gray-900">Вход</h1>
          <p className="text-gray-500 mt-1 text-sm">Войдите в {config.projectName}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {location.state?.registered && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl mb-5 text-sm border border-emerald-100">Регистрация успешна!</div>}
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Имя пользователя</label>
              <input type="text" required value={form.username} onChange={(e) => setForm({...form,username:e.target.value})} placeholder="username" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form,password:e.target.value})} placeholder="Ваш пароль" className={inputClass} />
            </div>
            <button type="submit" disabled={loading} className={`w-full ${s.btnPrimary} py-3 rounded-xl disabled:opacity-50 text-base`}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
        <p className="text-center mt-5 text-gray-500 text-sm">Нет аккаунта? <Link to="/register" className={`${s.accent} font-semibold`}>Зарегистрироваться</Link></p>
      </div>
    </div>
  )
}
