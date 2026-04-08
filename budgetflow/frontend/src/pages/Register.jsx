import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault(); if (form.password !== form.password2) { setError('Пароли не совпадают'); return }
    setLoading(true); setError('')
    try { await register(form.username, form.email, form.password, form.password2); navigate('/dashboard') }
    catch (err) { const d = err.response?.data; setError(d ? Object.values(d).flat().join(' ') : 'Ошибка регистрации') }
    setLoading(false)
  }
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">💰</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Регистрация</h1>
        </div>
        <form onSubmit={handleSubmit} className="finance-card p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль</label>
            <input type="password" required value={form.password2} onChange={e => setForm({...form, password2: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400" /></div>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-semibold ${s.btnPrimary} disabled:opacity-50`}>
            {loading ? 'Регистрация...' : 'Создать аккаунт'}</button>
          <p className="text-center text-sm text-gray-500">Уже есть аккаунт? <Link to="/login" className="text-emerald-600 font-medium">Войти</Link></p>
        </form>
      </div>
    </div>
  )
}
