import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-white border-b-4 border-cyan-500 min-h-[85vh] flex items-center">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-cyan-500" />
        <div className="absolute top-0 right-0 w-1/3 h-full flex items-center justify-center">
          <span className="text-[12rem] text-white/20 font-black select-none mono">:00</span>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-xl animate-precise">
            <div className="swiss-accent pl-4 mb-8">
              <p className="mono text-cyan-600 text-sm uppercase tracking-[0.2em]">Time Tracker</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] mb-6 tracking-tight">
              Время —<br />деньги.
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-md leading-relaxed">
              Запускайте таймер. Отслеживайте проекты. Считайте заработок. Всё точно.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="bg-cyan-500 text-white px-8 py-4 font-bold hover:bg-cyan-600 transition-all text-center">
                    Дашборд
                  </Link>
                  <Link to="/items" className="border-2 border-gray-900 text-gray-900 px-8 py-4 font-bold hover:bg-gray-900 hover:text-white transition-all text-center">
                    Проекты
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-cyan-500 text-white px-8 py-4 font-bold hover:bg-cyan-600 transition-all text-center">
                    Начать
                  </Link>
                  <Link to="/login" className="border-2 border-gray-900 text-gray-900 px-8 py-4 font-bold hover:bg-gray-900 hover:text-white transition-all text-center">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="swiss-accent pl-4 mb-12">
          <h2 className="text-2xl font-black text-gray-900">Возможности</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: '01', title: 'Таймер', desc: 'Старт/стоп в один клик. Текущий таймер виден в навбаре.' },
            { num: '02', title: 'Аналитика', desc: 'Недельные графики, разбивка по проектам, почасовые ставки.' },
            { num: '03', title: 'AI + RAG', desc: 'Спарсенные техники — Pomodoro, GTD, Deep Work. AI советует.' },
          ].map((f, i) => (
            <div key={f.num} className={`swiss-card p-7 rounded-none animate-precise precise-delay-${i + 1}`}>
              <span className="mono text-4xl font-bold text-cyan-500 block mb-4">{f.num}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
