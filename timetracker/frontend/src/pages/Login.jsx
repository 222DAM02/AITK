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
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch {
      setError('Неверное имя пользователя или пароль')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">⏱️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Вход в {config.projectName}</h1>
          <p className="text-gray-500 mt-1">Управляйте своим временем эффективно</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
            <input type="text" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent" />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-semibold transition ${s.btnPrimary} disabled:opacity-50`}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Нет аккаунта? <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-medium">Регистрация</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
