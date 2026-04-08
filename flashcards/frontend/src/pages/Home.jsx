import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-[#09090b] min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-neon-in">
              <div className="inline-block mb-6 px-3 py-1 border border-teal-500/30 rounded text-teal-400 text-xs uppercase tracking-[0.3em] font-mono">
                {'>'} система запоминания v2.0
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] mb-6">
                FLASH<br /><span className="text-teal-400 neon-teal">CARDS</span>
              </h1>
              <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
                Интервальное повторение. Глоссарии из Wikipedia. AI генерирует карточки из базы знаний.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="bg-teal-500 text-black px-8 py-4 font-bold hover:bg-teal-400 transition-all text-center rounded">
                      ОТКРЫТЬ КОЛОДЫ
                    </Link>
                    <Link to="/items" className="border border-teal-500/30 text-teal-400 px-8 py-4 font-bold hover:bg-teal-500/10 transition-all text-center rounded">
                      ВСЕ КАРТОЧКИ
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="bg-teal-500 text-black px-8 py-4 font-bold hover:bg-teal-400 transition-all text-center rounded">
                      НАЧАТЬ УЧИТЬ
                    </Link>
                    <Link to="/login" className="border border-teal-500/30 text-teal-400 px-8 py-4 font-bold hover:bg-teal-500/10 transition-all text-center rounded">
                      ВОЙТИ
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Neon card preview */}
            <div className="hidden md:flex flex-col gap-4">
              {[
                { q: 'Algorithm', a: 'Конечная последовательность инструкций', glow: 'teal' },
                { q: 'Recursion', a: 'Функция, вызывающая сама себя', glow: 'pink' },
                { q: 'Big O', a: 'Асимптотическая сложность', glow: 'teal' },
              ].map((card, i) => (
                <div key={card.q} className={`glow-border-teal rounded-lg p-5 animate-neon-in neon-delay-${i + 1} animate-glitch`}>
                  <p className="font-mono text-teal-400 text-sm mb-1">Q:</p>
                  <p className="text-white font-bold text-lg">{card.q}</p>
                  <div className="w-full h-px bg-teal-500/20 my-3" />
                  <p className="font-mono text-gray-500 text-sm mb-1">A:</p>
                  <p className="text-gray-300">{card.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#09090b] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-white text-center mb-14">
            <span className="text-teal-400">{'// '}</span>FEATURES
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🃏', title: 'Колоды карточек', desc: 'Создавайте тематические колоды с вопросами и ответами для запоминания' },
              { icon: '🌐', title: 'Парсинг глоссариев', desc: '6 глоссариев из Wikipedia — CS, математика, физика, биология и другие' },
              { icon: '🧠', title: 'AI + RAG', desc: 'Embeddings + cosine similarity. AI знает определения из спарсенных данных' },
            ].map((f, i) => (
              <div key={f.title} className={`cyber-card rounded-lg p-7 animate-neon-in neon-delay-${i + 1}`}>
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
