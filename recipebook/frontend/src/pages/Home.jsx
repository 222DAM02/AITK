import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero — Editorial Magazine Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-800 via-orange-700 to-amber-900 text-white">
        {/* Decorative grain */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <p className="text-amber-200/80 uppercase tracking-[0.3em] text-xs font-semibold mb-6">Кулинарная платформа</p>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[0.95] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ваша<br />
                <span className="italic font-semibold text-amber-200">книга</span><br />
                рецептов
              </h1>
              <div className="w-16 h-0.5 bg-amber-300/60 mb-6" />
              <p className="text-lg text-white/80 mb-10 max-w-md leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
                Собирайте любимые рецепты, открывайте новые блюда с AI-ассистентом и делитесь кулинарными шедеврами
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="bg-white text-amber-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-all shadow-xl hover:shadow-2xl text-center">
                      Мои рецепты
                    </Link>
                    <Link to="/items" className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all text-center backdrop-blur-sm">
                      Все рецепты
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="bg-white text-amber-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-all shadow-xl hover:shadow-2xl text-center">
                      Начать готовить
                    </Link>
                    <Link to="/login" className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all text-center backdrop-blur-sm">
                      Уже есть аккаунт
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Decorative food illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-full border-2 border-amber-300/30 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full border border-amber-200/20 flex items-center justify-center bg-amber-600/20 backdrop-blur-sm">
                    <span className="text-8xl">🍳</span>
                  </div>
                </div>
                {/* Floating ingredients */}
                <span className="absolute -top-4 right-4 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🌿</span>
                <span className="absolute top-1/2 -right-8 text-3xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>🍅</span>
                <span className="absolute -bottom-2 right-1/4 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>🧄</span>
                <span className="absolute top-8 -left-6 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>🫒</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <p className="text-amber-600 uppercase tracking-[0.2em] text-xs font-semibold mb-3">Возможности</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Всё для вашей кухни
          </h2>
          <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📖', title: 'Коллекция рецептов', desc: 'Сохраняйте рецепты с ингредиентами, временем готовки и пошаговыми инструкциями' },
            { icon: '🤖', title: 'AI-шеф', desc: 'Спросите AI о рецептах из любых ингредиентов, он подскажет лучшие варианты из базы знаний' },
            { icon: '🌍', title: 'База рецептов мира', desc: 'Более 100 рецептов из TheMealDB — от итальянской пасты до японских суши' },
          ].map((f, i) => (
            <div key={f.title} className={`recipe-card bg-white rounded-2xl p-8 shadow-sm border border-amber-100/60 animate-fade-up animate-fade-up-delay-${i + 1}`}>
              <span className="text-5xl block mb-5">{f.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
