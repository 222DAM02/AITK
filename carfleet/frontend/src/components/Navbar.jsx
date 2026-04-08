import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) { navigate(`/items?search=${encodeURIComponent(searchQ)}`); setSearchOpen(false); setSearchQ('') }
  }

  const navLink = (to, label, icon) => {
    const active = location.pathname === to || location.pathname.startsWith(to + '/')
    return <Link to={to} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${active ? 'bg-white/20 font-semibold' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>{icon && <span>{icon}</span>}{label}</Link>
  }

  return (
    <nav className={`${s.nav} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="text-lg font-bold flex items-center gap-2">
            <span className="text-xl">{config.projectIcon}</span>
            <span className="hidden sm:inline">{config.projectName}</span>
          </Link>

          {/* Search bar — desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder={`Поиск ${config.entityNamePlural.toLowerCase()}...`}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/5 border-0 text-sm placeholder-current/30 focus:ring-2 focus:ring-current/20 focus:bg-white/20 transition" />
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>

          <button className="md:hidden p-2 rounded-md hover:bg-white/10" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {user ? (<>
              {navLink('/dashboard', 'Дашборд', '📊')}
              {navLink('/items', config.entityNamePlural, '📋')}
              {navLink('/ai', 'AI', '✨')}
              {isAdmin && navLink('/admin', 'Админ', '⚙')}
              <div className="ml-3 pl-3 border-l border-current/10 flex items-center gap-2">
                <span className="text-sm text-white/60">{user.username}</span>
                <button onClick={handleLogout} className="text-sm px-2 py-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white/80">Выход</button>
              </div>
            </>) : (<div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-white/70 hover:text-white px-3 py-1.5">Вход</Link>
              <Link to="/register" className={`text-sm ${s.btnPrimary} px-4 py-1.5 rounded-lg`}>Регистрация</Link>
            </div>)}
          </div>
        </div>

        {menuOpen && (<div className="md:hidden pb-4 pt-2 flex flex-col gap-1 border-t border-current/10">
          <form onSubmit={handleSearch} className="px-2 mb-2">
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Поиск..."
              className="w-full px-3 py-2 rounded-lg bg-black/5 text-sm" />
          </form>
          {user ? (<>
            {[['/dashboard','📊 Дашборд'],['/items',`📋 ${config.entityNamePlural}`],['/ai','✨ AI']].map(([to,l])=>(
              <Link key={to} to={to} onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-white/10">{l}</Link>))}
            {isAdmin&&<Link to="/admin" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-white/10">⚙ Админ</Link>}
            <button onClick={handleLogout} className="text-left px-3 py-2 rounded-md hover:bg-white/10 mt-2 border-t border-current/10 pt-3">Выход</button>
          </>) : (<>
            <Link to="/login" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-white/10">Вход</Link>
            <Link to="/register" onClick={()=>setMenuOpen(false)} className="px-3 py-2 rounded-md hover:bg-white/10">Регистрация</Link>
          </>)}
        </div>)}
      </div>
    </nav>
  )
}
