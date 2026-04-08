import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Home() {
  const { user } = useAuth()
  return (<div>
    <section className="relative overflow-hidden bg-slate-900 text-white min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'repeating-linear-gradient(-45deg,transparent,transparent 10px,rgba(255,255,255,.03) 10px,rgba(255,255,255,.03) 20px)'}}/>
      <div className="absolute bottom-0 right-0 w-96 h-64 bg-blue-500/10 rounded-full blur-[100px]"/>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="max-w-2xl animate-drive">
          <div className="flex items-center gap-3 mb-6"><div className="w-1.5 h-10 bg-blue-500"/><span className="text-blue-400/60 uppercase tracking-[0.3em] text-xs font-bold">Fleet Management</span></div>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6">CAR<span className="text-blue-400">FLEET</span></h1>
          <p className="text-xl text-gray-400 mb-10 max-w-md">Контролируйте автопарк: пробег, расход топлива, ТО, страховки. Данные о 20+ марках из NHTSA.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (<><Link to="/dashboard" className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition-all text-center">Дашборд</Link>
              <Link to="/items" className="border border-slate-600 text-gray-300 px-8 py-4 rounded-lg font-bold hover:bg-white/5 transition-all text-center">Автопарк</Link></>
            ) : (<><Link to="/register" className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-400 transition-all text-center">Начать</Link>
              <Link to="/login" className="border border-slate-600 text-gray-300 px-8 py-4 rounded-lg font-bold hover:bg-white/5 transition-all text-center">Войти</Link></>)}
          </div></div></div></section>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="flex items-center gap-3 mb-12"><div className="w-10 h-0.5 bg-blue-500"/><h2 className="text-2xl font-black text-gray-900">ВОЗМОЖНОСТИ</h2></div>
      <div className="grid md:grid-cols-3 gap-6">{[
        {icon:'⛽',title:'Учёт топлива',desc:'Заправки, расход на км, стоимость за литр, полный бак'},
        {icon:'🔧',title:'ТО и страховки',desc:'Напоминания о техосмотре и сроках страховок'},
        {icon:'🤖',title:'AI + NHTSA',desc:'RAG по 20 маркам авто из NHTSA + статьи о ТО'},
      ].map((f,i)=>(<div key={f.title} className={`fleet-card p-7 animate-drive drive-delay-${i+1}`}><span className="text-4xl block mb-4">{f.icon}</span>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p></div>))}
      </div></section></div>)
}
