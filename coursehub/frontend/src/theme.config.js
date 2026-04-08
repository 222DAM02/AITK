// === ЕДИНАЯ ТОЧКА НАСТРОЙКИ ТЕМЫ ===

const themeConfig = {
  projectName: "CourseHub",
  projectDescription: "Платформа онлайн-курсов — учитесь и делитесь знаниями",
  projectIcon: "🎓",

  entityName: "Курс",
  entityNamePlural: "Курсы",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название курса", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: true },
    { name: "category", label: "Категория", type: "text", required: false },
    { name: "level", label: "Уровень", type: "select", required: false, options: [
      { value: "beginner", label: "Начальный" },
      { value: "intermediate", label: "Средний" },
      { value: "advanced", label: "Продвинутый" },
    ]},
    { name: "duration_hours", label: "Длительность (часов)", type: "number", required: false },
    { name: "lessons_count", label: "Количество уроков", type: "number", required: false },
    { name: "image_url", label: "Обложка (URL)", type: "url", required: false },
  ],

  aiFeature: {
    title: "AI-наставник",
    description: "Получите персональные рекомендации по обучению и помощь с выбором курсов",
    placeholder: "Например: составь план изучения Python для начинающего на 3 месяца",
  },

  // Полные Tailwind-классы — индиго/фиолетовая тема
  s: {
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-white border-b border-gray-200",
    heroGradient: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500",
    accent: "text-indigo-600",
    accentHover: "hover:text-indigo-800",
    accentBg: "bg-indigo-50",
    accentBgStrong: "bg-indigo-100",
    accentBorder: "border-indigo-200",
    accentRing: "focus:ring-indigo-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-indigo-100 text-indigo-800",
    link: "text-indigo-600 hover:text-indigo-800 underline underline-offset-2",
  },
}

export default themeConfig
