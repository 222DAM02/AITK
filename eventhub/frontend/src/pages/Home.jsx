import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Home() {
  const { user } = useAuth()
  return (<div>
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-orange-400 text-white min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'24px 24px'}}/>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"/>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-rise">
            <p className="text-rose-100 uppercase tracking-[0.3em] text-xs font-semibold mb-6">Площадка мероприятий</p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[0.9] mb-6">Event<span className="text-rose-200">Hub</span></h1>
            <p className="text-xl text-white/80 mb-10 max-w-md">Создавайте события, управляйте регистрациями и планируйте с учётом праздников из 10 стран</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (<><Link to="/dashboard" className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-bold hover:bg-rose-50 transition-all shadow-lg text-center">Дашборд</Link>
                <Link to="/items" className="border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">События</Link></>
              ) : (<><Link to="/register" className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-bold hover:bg-rose-50 transition-all shadow-lg text-center">Начать бесплатно</Link>
                <Link to="/login" className="border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">Войти</Link></>)}
            </div></div>
          <div className="hidden md:block"><div className="grid grid-cols-2 gap-3">
            {[{d:'15 мая',t:'Конференция',l:'Москва',c:'bg-white/15'},{d:'22 мая',t:'Хакатон',l:'Онлайн',c:'bg-white/10'},{d:'1 июня',t:'Митап',l:'СПб',c:'bg-white/15'},{d:'10 июня',t:'Воркшоп',l:'Казань',c:'bg-white/10'}].map((e,i)=>(
              <div key={i} className={`${e.c} backdrop-blur-sm rounded-2xl p-5 border border-white/20 animate-rise rise-delay-${Math.min(i+1,3)}`}>
                <p className="text-sm text-white/60">{e.d}</p><p className="font-bold text-lg">{e.t}</p><p className="text-sm text-white/70">{e.l}</p></div>))}
          </div></div></div></div></section>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">Возможности</h2>
      <div className="grid md:grid-cols-3 gap-6">{[
        {icon:'📅',title:'Управление событиями',desc:'Конференции, митапы, хакатоны — все типы мероприятий'},
        {icon:'🎟️',title:'Регистрация',desc:'Участники регистрируются онлайн, лимит мест, списки'},
        {icon:'🤖',title:'AI + праздники',desc:'RAG на базе праздников 10 стран через Nager.Date API'},
      ].map((f,i)=>(<div key={f.title} className={`event-card p-7 animate-rise rise-delay-${i+1}`}><span className="text-4xl block mb-4">{f.icon}</span>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p></div>))}
      </div></section></div>)
}
