import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'

const { s } = config

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white py-24 md:py-36">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,255,255,0.3) 31px, rgba(255,255,255,0.3) 32px)',
        }} />
        <div className="absolute top-10 right-10 opacity-20 text-9xl transform rotate-12 select-none">📝</div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl animate-write">
            <h1 className="text-6xl md:text-8xl mb-6 leading-[0.9]" style={{ fontFamily: "'Caveat', cursive" }}>
              Заметки,<br />которые <span className="pencil-underline" style={{ textDecorationColor: '#fdd835' }}>работают</span>
            </h1>
            <p className="text-xl text-sky-100/80 mb-10 leading-relaxed max-w-lg">
              Создавайте конспекты, структурируйте знания и спрашивайте AI — он ответит на основе Wikipedia
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="bg-white text-sky-700 px-8 py-4 rounded-xl font-bold hover:bg-sky-50 transition-all shadow-lg text-center">
                    📒 Мои заметки
                  </Link>
                  <Link to="/items" className="border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">
                    Все конспекты
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-sky-700 px-8 py-4 rounded-xl font-bold hover:bg-sky-50 transition-all shadow-lg text-center">
                    ✏️ Начать записывать
                  </Link>
                  <Link to="/login" className="border-2 border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-4xl text-center text-gray-900 mb-4" style={{ fontFamily: "'Caveat', cursive" }}>Что внутри?</h2>
        <p className="text-gray-400 text-center mb-14">Три причины полюбить StudyNotes</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Удобные заметки', desc: 'Теги, закрепление, поиск. Всё как в настоящем блокноте, только лучше.', cls: 'sticky-note' },
            { title: 'База Wikipedia', desc: '25 статей по ключевым темам — от Python до квантовой физики.', cls: 'sticky-blue' },
            { title: 'AI из конспектов', desc: 'RAG-система ищет ответы в ваших заметках и Wikipedia.', cls: 'sticky-pink' },
          ].map((f, i) => (
            <div key={f.title} className={`${f.cls} rounded-lg p-7 animate-write write-delay-${i + 1}`}>
              <h3 className="text-2xl text-gray-900 mb-2" style={{ fontFamily: "'Caveat', cursive" }}>{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
