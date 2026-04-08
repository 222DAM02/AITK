import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1117] via-[#141724] to-[#0f1117] min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(212, 168, 83, 0.08) 0%, transparent 50%),
                           radial-gradient(ellipse at 70% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)`,
        }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center animate-reveal">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mb-8" />
          <p className="text-amber-400/60 uppercase tracking-[0.4em] text-xs font-semibold mb-6">Образовательная платформа</p>
          <h1 className="text-5xl md:text-8xl font-bold text-white leading-[0.9] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Мир<br /><span className="gold-gradient italic">знаний</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
            Создавайте курсы, изучайте книги из Open Library и получайте рекомендации от AI-ментора
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-4 rounded-lg font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 text-center">
                  Мои курсы
                </Link>
                <Link to="/items" className="border border-amber-500/30 text-amber-300 px-10 py-4 rounded-lg font-semibold hover:bg-amber-500/10 transition-all text-center">
                  Каталог
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-10 py-4 rounded-lg font-semibold hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 text-center">
                  Начать обучение
                </Link>
                <Link to="/login" className="border border-amber-500/30 text-amber-300 px-10 py-4 rounded-lg font-semibold hover:bg-amber-500/10 transition-all text-center">
                  Войти
                </Link>
              </>
            )}
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto mt-16" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Преимущества</h2>
        <p className="text-gray-500 text-center mb-14">Всё, что нужно для эффективного обучения</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📚', title: 'Библиотека', desc: 'Более 100 книг из Open Library по 20 направлениям — от программирования до философии' },
            { icon: '🎓', title: 'Курсы', desc: 'Создавайте структурированные курсы с уроками и отслеживайте прогресс' },
            { icon: '🧠', title: 'AI-ментор', desc: 'RAG-система подбирает ответы на основе реальных книг и учебных материалов' },
          ].map((f, i) => (
            <div key={f.title} className={`luxury-card p-8 animate-reveal reveal-delay-${i + 1}`}>
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{f.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
