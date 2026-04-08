import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const navItem = (to, label, icon) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link to={to} onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active ? s.btnPrimary : 'opacity-60 hover:opacity-100 hover:bg-black/5'
        }`}>
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    )
  }

  const sidebar = (
    <div className={`flex flex-col h-full ${collapsed ? 'w-16' : 'w-56'} transition-all duration-200`}>
      {/* Logo */}
      <div className="px-3 py-4 flex items-center gap-2">
        <span className="text-2xl">{config.projectIcon}</span>
        {!collapsed && <span className="font-bold text-lg">{config.projectName}</span>}
      </div>

      {/* Nav items */}
      <div className="flex-1 px-2 space-y-1 mt-4">
        {user ? (<>
          {navItem('/', 'Главная', '🏠')}
          {navItem('/dashboard', 'Дашборд', '📊')}
          {navItem('/items', config.entityNamePlural, '📋')}
          {navItem('/ai', 'AI-ассистент', '✨')}
          {isAdmin && navItem('/admin', 'Админ', '⚙️')}
        </>) : (<>
          {navItem('/login', 'Вход', '🔑')}
          {navItem('/register', 'Регистрация', '📝')}
        </>)}
      </div>

      {/* User / Collapse */}
      {user && (
        <div className="px-2 pb-4 mt-auto space-y-2">
          <div className={`px-3 py-2 rounded-xl bg-black/5 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? (
              <span className="text-lg">👤</span>
            ) : (
              <><p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs opacity-40">{user.role}</p></>
            )}
          </div>
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm opacity-50 hover:opacity-80 hover:bg-red-50 hover:text-red-600 transition ${collapsed ? 'justify-center' : ''}`}>
            <span>🚪</span>{!collapsed && <span>Выход</span>}
          </button>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center py-2 border-t border-current/5 opacity-30 hover:opacity-60 text-xs">
        {collapsed ? '→' : '← Свернуть'}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-current/10 sticky top-0 z-50 bg-gray-900 text-gray-200">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">{config.projectIcon}</span>
          {config.projectName}
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-black/5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white w-64 shadow-2xl border-r border-gray-100" >
            {sidebar}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen border-r border-current/10 z-40 bg-gray-900 text-gray-200 ${collapsed ? 'w-16' : 'w-56'} transition-all`}>
        {sidebar}
      </div>

      {/* Spacer for content */}
      <div className={`hidden lg:block ${collapsed ? 'w-16' : 'w-56'} shrink-0 transition-all`} />
    </>
  )
}
