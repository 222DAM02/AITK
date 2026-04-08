import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()
  const flags = ['🇬🇧', '🇫🇷', '🇩🇪', '🇪🇸', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳']

  return (
    <div>
      {/* Hero — Playful & Bouncy */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-300/20 blob" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-300/20 blob-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200/10 blob" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Floating flags */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {flags.map((f, i) => (
              <span key={i} className="text-3xl animate-bounce-in" style={{ animationDelay: `${i * 0.08}s` }}>
                {f}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
            Учите языки{' '}
            <span className="gradient-text">играючи</span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Создавайте словарные коллекции, проходите квизы и используйте AI для мгновенных объяснений слов
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {user ? (
              <>
                <Link to="/dashboard" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-200 transition-all hover:-translate-y-1">
                  Мой словарь 📚
                </Link>
                <Link to="/items" className="bg-white text-purple-700 border-2 border-purple-200 px-10 py-4 rounded-2xl font-bold text-lg hover:border-purple-400 hover:shadow-lg transition-all hover:-translate-y-1">
                  Все коллекции
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-200 transition-all hover:-translate-y-1">
                  Начать бесплатно 🎉
                </Link>
                <Link to="/login" className="bg-white text-purple-700 border-2 border-purple-200 px-10 py-4 rounded-2xl font-bold text-lg hover:border-purple-400 hover:shadow-lg transition-all hover:-translate-y-1">
                  Войти
                </Link>
              </>
            )}
          </div>

          {/* Fun word cards preview */}
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { word: 'Serendipity', tr: 'Счастливая случайность', color: 'from-pink-400 to-rose-500' },
              { word: 'Ephemeral', tr: 'Мимолётный', color: 'from-purple-400 to-indigo-500' },
              { word: 'Luminous', tr: 'Светящийся', color: 'from-teal-400 to-cyan-500' },
            ].map((card, i) => (
              <div key={card.word} className={`fun-card bg-gradient-to-br ${card.color} text-white px-6 py-5 shadow-lg animate-bounce-in bounce-delay-${i + 1}`}>
                <p className="text-lg font-bold">{card.word}</p>
                <p className="text-white/80 text-sm mt-1">{card.tr}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wavy-line" />

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Почему <span className="gradient-text">LangLearn</span>?
        </h2>
        <p className="text-gray-400 text-center mb-14 text-lg">Учить слова ещё никогда не было так весело</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🎯', title: 'Умные квизы', desc: 'Проверяйте знания с адаптивными тестами по каждой коллекции', bg: 'bg-pink-50 border-pink-100' },
            { icon: '🤖', title: 'AI-репетитор', desc: 'Получайте определения, примеры и контекст на основе реального словаря', bg: 'bg-purple-50 border-purple-100' },
            { icon: '📊', title: 'Прогресс', desc: 'Отслеживайте уровень владения каждым словом от новичка до мастера', bg: 'bg-teal-50 border-teal-100' },
          ].map((f, i) => (
            <div key={f.title} className={`fun-card ${f.bg} border p-8 animate-bounce-in bounce-delay-${i + 1}`}>
              <span className="text-5xl block mb-4">{f.icon}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
