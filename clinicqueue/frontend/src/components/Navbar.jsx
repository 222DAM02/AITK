import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/')

  const bottomItem = (to, icon, label) => (
    <Link to={to} className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all text-xs ${
      isActive(to) ? `${s.accent} font-bold` : 'opacity-40 hover:opacity-70'
    }`}>
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  )

  // Desktop: minimal top bar. Mobile: bottom nav
  return (<>
    {/* Desktop top bar — minimal */}
    <nav className={`hidden md:block ${s.nav} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">{config.projectIcon}</span>
            {config.projectName}
          </Link>
          <div className="flex items-center gap-1">
            {user ? (<>
              {['/dashboard', '/items', '/ai'].map((to, i) => {
                const labels = ['Дашборд', config.entityNamePlural, 'AI']
                return <Link key={to} to={to} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive(to) ? 'bg-black/10' : 'opacity-60 hover:opacity-100 hover:bg-black/5'}`}>{labels[i]}</Link>
              })}
              {isAdmin && <Link to="/admin" className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive('/admin') ? 'bg-black/10' : 'opacity-60 hover:opacity-100'}`}>Админ</Link>}
              <div className="ml-3 pl-3 border-l border-current/10 flex items-center gap-2">
                <span className="text-sm opacity-50">{user.username}</span>
                <button onClick={handleLogout} className="text-sm opacity-40 hover:opacity-70 px-2 py-1 rounded-lg hover:bg-black/5">Выход</button>
              </div>
            </>) : (<>
              <Link to="/login" className="text-sm opacity-70 px-3 py-1.5">Вход</Link>
              <Link to="/register" className={`text-sm ${s.btnPrimary} px-4 py-1.5 rounded-lg`}>Регистрация</Link>
            </>)}
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile bottom nav */}
    {user && (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-2 py-1 safe-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {bottomItem('/', '🏠', 'Главная')}
          {bottomItem('/dashboard', '📊', 'Дашборд')}
          {bottomItem('/items', '📋', config.entityNamePlural.slice(0, 6))}
          {bottomItem('/ai', '✨', 'AI')}
          <button onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl text-xs ${moreOpen ? s.accent + ' font-bold' : 'opacity-40'}`}>
            <span className="text-xl">⋯</span>
            <span>Ещё</span>
          </button>
        </div>
      </nav>
    )}

    {/* Mobile: "More" drawer */}
    {moreOpen && (
      <div className="md:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/20" onClick={() => setMoreOpen(false)} />
        <div className="absolute bottom-16 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 space-y-2">
          {isAdmin && <Link to="/admin" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium">⚙️ Админ-панель</Link>}
          <Link to="/items/new" onClick={() => setMoreOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium">➕ Создать</Link>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="px-3 py-1 text-xs opacity-30">{user?.username} · {user?.role}</div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-500 w-full">🚪 Выход</button>
          </div>
        </div>
      </div>
    )}

    {/* Mobile top bar — simple, only logo + menu for non-auth */}
    {!user && (
      <nav className="md:hidden flex items-center justify-between h-14 px-4 border-b border-gray-100 sticky top-0 z-50 bg-white">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span>{config.projectIcon}</span>{config.projectName}
        </Link>
        <div className="flex gap-2">
          <Link to="/login" className="text-sm opacity-60 px-3 py-1.5">Вход</Link>
          <Link to="/register" className={`text-sm ${s.btnPrimary} px-3 py-1.5 rounded-lg`}>Регистрация</Link>
        </div>
      </nav>
    )}

    {/* Spacer for bottom nav on mobile */}
    {user && <div className="md:hidden h-16" />}
  </>)
}
