import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import config from '../theme.config'
const { s } = config
export default function Home() {
  const { user } = useAuth()
  return (<div>
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle,white 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
      <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-[100px]"/>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-pop">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>Платформа тестирования</div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[0.9] mb-6">Edu<span className="text-purple-200">Test</span></h1>
            <p className="text-xl text-purple-100/80 mb-10 max-w-md">Создавайте тесты, проходите проверки знаний и получайте вопросы из Open Trivia DB</p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (<><Link to="/dashboard" className="bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold hover:bg-violet-50 transition-all shadow-lg text-center">Дашборд</Link>
                <Link to="/items" className="border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">Тесты</Link></>
              ) : (<><Link to="/register" className="bg-white text-violet-700 px-8 py-4 rounded-2xl font-bold hover:bg-violet-50 transition-all shadow-lg text-center">Начать тестирование</Link>
                <Link to="/login" className="border-2 border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all text-center backdrop-blur-sm">Войти</Link></>)}
            </div></div>
          <div className="hidden md:flex flex-col gap-3">
            {[{q:'Какая планета ближе к Солнцу?',a:'Меркурий',d:'easy'},{q:'Кто написал "Войну и мир"?',a:'Толстой',d:'medium'},{q:'Формула площади круга?',a:'πr²',d:'hard'}].map((c,i)=>(
              <div key={i} className={`bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 animate-pop pop-delay-${i+1}`}>
                <div className="flex justify-between mb-2"><span className={`text-xs px-2 py-0.5 rounded-full difficulty-${c.d}`}>{c.d}</span></div>
                <p className="font-medium">{c.q}</p><p className="text-sm text-white/60 mt-1">✓ {c.a}</p></div>))}
          </div></div></div></section>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">Возможности</h2>
      <div className="grid md:grid-cols-3 gap-6">{[
        {icon:'📝',title:'Создание тестов',desc:'Добавляйте вопросы с 4 вариантами ответа, ставьте сложность и время'},
        {icon:'🏆',title:'Прохождение и результаты',desc:'Проходите тесты, смотрите результаты, сравнивайте со средним баллом'},
        {icon:'🤖',title:'AI + Open Trivia',desc:'90+ вопросов из 9 категорий через Open Trivia DB + RAG'},
      ].map((f,i)=>(<div key={f.title} className={`quiz-card p-7 animate-pop pop-delay-${i+1}`}><span className="text-4xl block mb-4">{f.icon}</span>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p></div>))}
      </div></section></div>)
}
