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
          active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}>
        {label}
      </Link>
    )
  }

  return (
    <nav className={`${s.nav} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-lg">
              {config.projectIcon}
            </div>
            <span className="text-lg font-semibold text-white tracking-wide">{config.projectName}</span>
          </Link>

          <button className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/70"
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
                <div className="ml-3 pl-3 border-l border-white/20 flex items-center gap-3">
                  <span className="text-sm text-white/60">{user.username}</span>
                  <button onClick={handleLogout}
                    className="text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    Выход
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm text-white/70 hover:text-white px-3 py-1.5">Вход</Link>
                <Link to="/register" className="text-sm bg-white text-green-800 px-4 py-1.5 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                  Начать
                </Link>
              </div>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-1 border-t border-white/10">
            {user ? (
              <>
                {[['/dashboard','Кабинет'],['/items',config.entityNamePlural],['/ai','✨ AI']].map(([to, label]) => (
                  <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-white/10 text-white/80">{label}</Link>
                ))}
                {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10 text-white/80">⚙ Админ</Link>}
                <button onClick={handleLogout} className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 border-t border-white/10 mt-1 pt-3">Выход</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10 text-white/80">Вход</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/10 text-white/80">Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
