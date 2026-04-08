import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-gray-900 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-count">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-8">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Финансовый контроль
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] mb-6 tracking-tight">
                Budget<span className="text-emerald-400">Flow</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-md leading-relaxed">
                Контролируйте каждый рубль. Планируйте бюджеты. Получайте AI-рекомендации на основе курсов валют и финансовых знаний.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all text-center shadow-lg shadow-emerald-500/20">
                      Дашборд
                    </Link>
                    <Link to="/items" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-center">
                      Транзакции
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-400 transition-all text-center shadow-lg shadow-emerald-500/20">
                      Начать бесплатно
                    </Link>
                    <Link to="/login" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-center">
                      Войти
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mock financial widget */}
            <div className="hidden md:block">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Апрель 2026</span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">+12.4%</span>
                </div>
                {[
                  { label: 'Доходы', amount: '185 000 ₽', color: 'text-emerald-400', bar: 'bg-emerald-500', w: 'w-4/5' },
                  { label: 'Расходы', amount: '142 300 ₽', color: 'text-red-400', bar: 'bg-red-500', w: 'w-3/5' },
                  { label: 'Баланс', amount: '+42 700 ₽', color: 'text-emerald-300', bar: 'bg-emerald-400', w: 'w-1/3' },
                ].map((row, i) => (
                  <div key={row.label} className={`animate-count count-delay-${i + 1}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{row.label}</span>
                      <span className={`font-mono font-bold ${row.color}`}>{row.amount}</span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full ${row.bar} rounded-full ${row.w} transition-all duration-1000`} />
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-700">
                  {['Еда 32%', 'Жильё 28%', 'Транспорт 15%'].map((cat, i) => (
                    <div key={cat} className="text-center p-2 bg-gray-700/30 rounded-lg">
                      <p className="text-xs text-gray-500">{cat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Полный финансовый контроль</h2>
        <p className="text-gray-400 text-center mb-14">Доходы, расходы, бюджеты и AI-аналитика в одном месте</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '📊', title: 'Аналитика', desc: 'Графики доходов и расходов по дням, категориям и месяцам' },
            { icon: '💱', title: 'Курсы валют', desc: 'Актуальные курсы 15+ валют из ExchangeRate API' },
            { icon: '🎯', title: 'Бюджеты', desc: 'Лимиты по категориям с отслеживанием перерасхода' },
            { icon: '🤖', title: 'AI + RAG', desc: 'Финансовые советы на основе курсов и Wikipedia' },
          ].map((f, i) => (
            <div key={f.title} className={`finance-card p-6 animate-count count-delay-${i + 1}`}>
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
