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

  const handleLogout = () => { logout(); navigate('/login') }

  const navLink = (to, label) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link to={to}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          active ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}>
        {label}
      </Link>
    )
  }

  return (
    <nav className={`${s.nav} text-white sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2">
            <span className="text-2xl">{config.projectIcon}</span>
            <span className="text-lime-400">{config.projectName}</span>
          </Link>

          <button className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            onClick={() => setMenuOpen(!menuOpen)}>
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
                {navLink('/ai', '✨ AI')}
                {isAdmin && navLink('/admin', '⚙ Админ')}
                <div className="ml-3 pl-3 border-l border-slate-700 flex items-center gap-3">
                  <span className="text-sm text-slate-500">{user.username}</span>
                  <button onClick={handleLogout}
                    className="text-sm px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    Выход
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-slate-400 hover:text-white px-3 py-1.5">Вход</Link>
                <Link to="/register" className={`text-sm ${s.btnPrimary} px-4 py-1.5 rounded-lg transition-colors`}>
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-1 border-t border-slate-800">
            {user ? (
              <>
                {[['/dashboard', 'Кабинет'], ['/items', config.entityNamePlural], ['/ai', '✨ AI']].map(([to, label]) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300">{label}</Link>
                ))}
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300">⚙ Админ</Link>}
                <button onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-400 mt-2 border-t border-slate-800 pt-3">
                  Выход ({user.username})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300">Вход</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300">Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
