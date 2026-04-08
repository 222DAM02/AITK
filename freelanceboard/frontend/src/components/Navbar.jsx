import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) { navigate(`/items?search=${encodeURIComponent(searchQ)}`); setSearchQ('') }
  }

  const navItem = (to, label, icon) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return (
      <Link to={to} onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active ? s.btnPrimary : 'opacity-60 hover:opacity-100 hover:bg-black/5'
        }`}>
        <span className="text-lg">{icon}</span><span>{label}</span>
      </Link>
    )
  }

  const sideContent = (
    <div className="flex flex-col h-full w-60">
      <div className="px-4 py-4 flex items-center gap-2">
        <span className="text-2xl">{config.projectIcon}</span>
        <span className="font-bold text-lg">{config.projectName}</span>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="px-3 mb-4">
        <div className="relative">
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-8 pr-3 py-2 rounded-lg bg-black/5 border-0 text-sm placeholder-current/30 focus:ring-2 focus:ring-current/20" />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </form>

      <div className="flex-1 px-2 space-y-1">
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

      {user && (
        <div className="px-3 pb-4 mt-auto space-y-2">
          <div className="px-3 py-2.5 rounded-xl bg-black/5">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs opacity-40">{user.role}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm opacity-50 hover:opacity-80 hover:bg-red-50 hover:text-red-600 transition">
            <span>🚪</span>Выход
          </button>
        </div>
      )}
    </div>
  )

  return (<>
    <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-current/10 sticky top-0 z-50 bg-sky-50">
      <Link to="/" className="flex items-center gap-2 font-bold">
        <span className="text-xl">{config.projectIcon}</span>{config.projectName}
      </Link>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-black/5">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
      </button>
    </div>
    {mobileOpen && (
      <div className="lg:hidden fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
        <div className="relative w-60 shadow-2xl border-r" >{sideContent}</div>
      </div>
    )}
    <div className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 border-r border-current/10 z-40 bg-sky-50">
      {sideContent}
    </div>
    <div className="hidden lg:block w-60 shrink-0" />
  </>)
}
