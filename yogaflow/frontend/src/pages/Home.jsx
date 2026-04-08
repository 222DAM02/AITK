import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-green-800 via-green-900 to-emerald-950 text-white min-h-[85vh] flex items-center">
        {/* Soft circles */}
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-green-400/10 animate-breathe" />
        <div className="absolute bottom-32 right-32 w-56 h-56 rounded-full bg-emerald-300/10 animate-breathe" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-green-500/5 animate-breathe" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="animate-gentle">
            <span className="text-7xl block mb-6">🧘</span>
            <h1 className="text-5xl md:text-8xl text-white leading-[0.9] mb-6" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
              Yoga<em className="text-green-300">Flow</em>
            </h1>
            <p className="text-xl text-green-200/70 mb-12 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Karla', sans-serif" }}>
              Практикуйте йогу осознанно. Создавайте последовательности асан. Дышите с AI-инструктором.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full font-medium hover:bg-white/20 transition-all text-center">
                    Мои практики
                  </Link>
                  <Link to="/items" className="bg-green-400 text-green-950 px-10 py-4 rounded-full font-semibold hover:bg-green-300 transition-all shadow-lg shadow-green-500/20 text-center">
                    Все последовательности
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-green-400 text-green-950 px-10 py-4 rounded-full font-semibold hover:bg-green-300 transition-all shadow-lg shadow-green-500/20 text-center">
                    Начать практику
                  </Link>
                  <Link to="/login" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full font-medium hover:bg-white/20 transition-all text-center">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="organic-divider" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl text-gray-800 mb-3" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400 }}>
            Практика с <em className="text-green-700">осознанностью</em>
          </h2>
          <p className="text-gray-400">Всё для вашего йога-путешествия</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🪷', title: 'Библиотека асан', desc: 'Десятки поз из Wikipedia с описаниями, уровнями сложности и вариациями' },
            { icon: '🌊', title: 'Последовательности', desc: 'Создавайте плавные переходы от простых поз к сложным. Режим практики.' },
            { icon: '✨', title: 'AI-инструктор', desc: 'RAG по йога-традициям — Хатха, Виньяса, Аштанга. AI знает каждую асану.' },
          ].map((f, i) => (
            <div key={f.title} className={`zen-card p-8 animate-gentle gentle-delay-${i + 1}`}>
              <span className="text-5xl block mb-5">{f.icon}</span>
              <h3 className="text-xl text-gray-800 mb-3" style={{ fontFamily: "'Fraunces', serif" }}>{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
