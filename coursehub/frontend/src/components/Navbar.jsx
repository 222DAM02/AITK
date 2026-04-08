import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
import { useState } from 'react'

const { s } = config

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLink = (to, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className={`${s.nav} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
            <span className="text-2xl">{config.projectIcon}</span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {config.projectName}
            </span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {navLink('/dashboard', 'Кабинет')}
                {navLink('/items', config.entityNamePlural)}
                {navLink('/ai', 'AI-наставник')}
                {isAdmin && navLink('/admin', 'Админ')}
                <div className="ml-3 pl-3 border-l border-gray-200 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <button onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Выход
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2">
                  Вход
                </Link>
                <Link to="/register"
                  className={`text-sm ${s.btnPrimary} px-4 py-2 rounded-lg transition-colors`}>
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-1 border-t border-gray-100">
            {user ? (
              <>
                {[
                  ['/dashboard', 'Кабинет'],
                  ['/items', config.entityNamePlural],
                  ['/ai', 'AI-наставник'],
                ].map(([to, label]) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">{label}</Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Админ</Link>
                )}
                <button onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 mt-2 border-t border-gray-100 pt-3">
                  Выход ({user.username})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Вход</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
