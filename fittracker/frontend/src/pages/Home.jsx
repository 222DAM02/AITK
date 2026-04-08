import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero — Dark Brutalist */}
      <section className="relative overflow-hidden bg-black min-h-[85vh] flex items-center">
        {/* Diagonal stripes bg */}
        <div className="absolute inset-0 stripe-accent" />
        {/* Large text watermark */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[18rem] font-black text-white/[0.02] leading-none select-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
          FIT
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-12 bg-lime-400" />
                <span className="text-lime-400/60 uppercase tracking-[0.3em] text-xs font-bold">Фитнес трекер</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
                ТРЕНИРУЙСЯ<br />
                <span className="text-lime-400 neon-glow">ЖЁСТЧЕ</span>
              </h1>
              <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Отслеживай каждую тренировку. Анализируй прогресс. Получай рекомендации от AI-тренера на основе базы из 150+ упражнений.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="bg-lime-400 text-black px-10 py-4 font-bold uppercase tracking-wider hover:bg-lime-300 transition-all text-center">
                      Мои тренировки
                    </Link>
                    <Link to="/items" className="border-2 border-lime-400/30 text-lime-400 px-10 py-4 font-bold uppercase tracking-wider hover:border-lime-400 hover:bg-lime-400/5 transition-all text-center">
                      Каталог
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="bg-lime-400 text-black px-10 py-4 font-bold uppercase tracking-wider hover:bg-lime-300 transition-all text-center">
                      Начать сейчас
                    </Link>
                    <Link to="/login" className="border-2 border-lime-400/30 text-lime-400 px-10 py-4 font-bold uppercase tracking-wider hover:border-lime-400 hover:bg-lime-400/5 transition-all text-center">
                      Войти
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats display */}
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '150+', label: 'Упражнений', icon: '💪' },
                  { num: 'AI', label: 'Тренер', icon: '🤖' },
                  { num: '24/7', label: 'Доступ', icon: '⚡' },
                  { num: 'RAG', label: 'База знаний', icon: '🧠' },
                ].map((stat, i) => (
                  <div key={stat.label} className={`brutal-card p-6 text-center animate-slide-in slide-delay-${Math.min(i + 1, 3)}`}>
                    <span className="text-3xl block mb-2">{stat.icon}</span>
                    <p className="text-2xl font-black text-lime-400" style={{ fontFamily: "'Oswald', sans-serif" }}>{stat.num}</p>
                    <p className="text-gray-500 text-sm uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-black py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-0.5 bg-lime-400" />
            <h2 className="text-2xl font-black text-white uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>Возможности</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏋️', title: 'Дневник тренировок', desc: 'Записывай подходы, веса, повторения. Всё структурировано.' },
              { icon: '📊', title: 'Аналитика', desc: 'Графики прогресса, статистика по группам мышц и динамика.' },
              { icon: '🤖', title: 'AI + Wger API', desc: 'RAG на базе 150+ упражнений. AI знает каждое движение.' },
            ].map((f, i) => (
              <div key={f.title} className={`brutal-card p-8 animate-slide-in slide-delay-${i + 1}`}>
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-lg font-black text-white uppercase mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
