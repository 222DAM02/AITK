import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try { await login(form.username, form.password); navigate('/dashboard') }
    catch { setError('Неверное имя пользователя или пароль') }
    setLoading(false)
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">💰</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Вход в {config.projectName}</h1>
        </div>
        <form onSubmit={handleSubmit} className="finance-card p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-semibold ${s.btnPrimary} disabled:opacity-50`}>
            {loading ? 'Вход...' : 'Войти'}</button>
          <p className="text-center text-sm text-gray-500">Нет аккаунта? <Link to="/register" className="text-emerald-600 font-medium">Регистрация</Link></p>
        </form>
      </div>
    </div>
  )
}
