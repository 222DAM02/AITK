import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Home() {
  const { user } = useAuth()
  return (<div>
    <section className={`${s.heroGradient} text-white py-20 md:py-32`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-6xl mb-4 block">{config.projectIcon}</span>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">{config.projectName}</h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">{config.projectDescription}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (<>
            <Link to="/dashboard" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg">Дашборд</Link>
            <Link to="/items" className="bg-white/20 backdrop-blur text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30">{config.entityNamePlural}</Link>
          </>) : (<>
            <Link to="/register" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition shadow-lg">Начать бесплатно</Link>
            <Link to="/login" className="bg-white/20 backdrop-blur text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30">Войти</Link>
          </>)}
        </div></div></section>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Возможности</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: '📦', title: 'Учёт товаров', desc: 'SKU, категории, поставщики и минимальные остатки' },
          { icon: '📊', title: 'Движение товаров', desc: 'Приход, расход, корректировки с историей' },
          { icon: '🤖', title: 'AI + RAG', desc: config.aiFeature.description },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
            <span className="text-4xl block mb-4">{f.icon}</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed">{f.desc}</p>
          </div>))}
      </div></section></div>)
}
