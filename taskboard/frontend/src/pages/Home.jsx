import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0c0a1a] to-indigo-950" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-float-in">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[0.95] mb-6">
                Task<span className="text-violet-400">Board</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-md leading-relaxed">
                Канбан-доска для управления задачами. Перетаскивайте, приоритизируйте, контролируйте.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/board" className="glass bg-violet-500/20 text-white px-8 py-4 font-semibold text-center hover:bg-violet-500/30 border-violet-500/30">
                      Открыть доску
                    </Link>
                    <Link to="/dashboard" className="glass text-gray-300 px-8 py-4 font-semibold text-center">
                      Дашборд
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="glass bg-violet-500/20 text-white px-8 py-4 font-semibold text-center hover:bg-violet-500/30 border-violet-500/30">
                      Начать бесплатно
                    </Link>
                    <Link to="/login" className="glass text-gray-300 px-8 py-4 font-semibold text-center">
                      Войти
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mini kanban preview */}
            <div className="hidden md:grid grid-cols-3 gap-3">
              {[
                { title: 'К выполнению', items: ['Дизайн', 'API'], color: 'bg-violet-500/60' },
                { title: 'В работе', items: ['Фронтенд'], color: 'bg-blue-500/60' },
                { title: 'Готово', items: ['Бэкенд', 'Тесты'], color: 'bg-emerald-500/60' },
              ].map((col, i) => (
                <div key={col.title} className={`glass rounded-xl p-4 animate-float-in float-delay-${i + 1}`}>
                  <div className={`${col.color} w-full h-1 rounded mb-3`} />
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">{col.title}</p>
                  {col.items.map(item => (
                    <div key={item} className="glass rounded-lg p-3 mb-2 text-sm text-white/80">{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-14">Возможности</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Канбан-доска', desc: 'Четыре колонки: К выполнению, В работе, На проверке, Готово' },
              { icon: '🏷️', title: 'Приоритеты и дедлайны', desc: 'Отмечайте критические задачи, ставьте сроки, отслеживайте просрочки' },
              { icon: '🤖', title: 'AI менеджер', desc: 'RAG на базе Scrum, Kanban и Agile — AI знает лучшие практики' },
            ].map((f, i) => (
              <div key={f.title} className={`glass p-7 animate-float-in float-delay-${i + 1}`}>
                <span className="text-4xl block mb-4">{f.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
