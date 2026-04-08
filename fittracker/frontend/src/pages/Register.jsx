import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/endpoints'
import config from '../theme.config'

const { s } = config
const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder-gray-400 ${s.accentRing} focus:border-transparent transition-shadow`

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.password2) { setError('Пароли не совпадают'); return }
    if (form.password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return }
    if (!form.email.includes('@')) { setError('Введите корректный email'); return }
    setLoading(true)
    try { await authAPI.register(form); navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data; setError(data ? Object.values(data).flat().join('. ') : 'Ошибка регистрации')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">{config.projectIcon}</span>
          <h1 className="text-3xl font-bold text-gray-900">Создать аккаунт</h1>
          <p className="text-gray-500 mt-2">Присоединяйтесь к {config.projectName}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-5 text-sm border border-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'username', label: 'Имя пользователя', type: 'text', ph: 'username' },
              { name: 'email', label: 'Email', type: 'email', ph: 'email@example.com' },
              { name: 'password', label: 'Пароль', type: 'password', ph: 'Минимум 6 символов' },
              { name: 'password2', label: 'Повторите пароль', type: 'password', ph: 'Повторите пароль' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} required value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  placeholder={f.ph} className={inputClass} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className={`w-full ${s.btnPrimary} py-3 rounded-xl disabled:opacity-50 transition-colors text-base`}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-gray-500">
          Уже есть аккаунт? <Link to="/login" className={`${s.accent} font-semibold ${s.accentHover}`}>Войти</Link>
        </p>
      </div>
    </div>
  )
}
