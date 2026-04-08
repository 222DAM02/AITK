import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="max-w-2xl animate-fade-slide">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Безопасное хранение медданных
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Контролируйте<br />
              <span className="text-blue-200">своё здоровье</span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-10 leading-relaxed max-w-lg">
              Отслеживайте приём лекарств, контролируйте дозировки и получайте информацию о препаратах из базы FDA
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg text-center">
                    Мой трекер
                  </Link>
                  <Link to="/items" className="border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all text-center">
                    Мои лекарства
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg text-center">
                    Начать бесплатно
                  </Link>
                  <Link to="/login" className="border-2 border-white/30 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all text-center">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="trust-line" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Надёжный медицинский трекер</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Данные из официального API FDA, AI-ассистент и персональный контроль</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '💊', title: 'Трекинг лекарств', desc: 'График приёма, дозировки и напоминания. Всё в одном месте.' },
            { icon: '🔬', title: 'База OpenFDA', desc: '40+ препаратов с официальными данными о побочных эффектах и дозировках.' },
            { icon: '🤖', title: 'AI-консультант', desc: 'Ответы на основе реальных медицинских данных через RAG.' },
          ].map((f, i) => (
            <div key={f.title} className={`clinical-card p-7 animate-fade-slide fade-delay-${i + 1}`}>
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
