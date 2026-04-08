const themeConfig = {
  projectName: "EduTest",
  projectDescription: "Платформа тестирования: создавайте тесты, проверяйте знания и анализируйте результаты",
  projectIcon: "🎓",
  entityName: "Тест",
  entityNamePlural: "Тесты",
  entityRoute: "items",
  entityFields: [
    { name: "title", label: "Название теста", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea" },
    { name: "category", label: "Категория", type: "select", required: true, options: [
      { value: "general", label: "Общие знания" }, { value: "science", label: "Наука" },
      { value: "history", label: "История" }, { value: "geography", label: "География" },
      { value: "math", label: "Математика" }, { value: "literature", label: "Литература" },
      { value: "computers", label: "IT и компьютеры" }, { value: "sports", label: "Спорт" }, { value: "art", label: "Искусство" },
    ]},
    { name: "difficulty", label: "Сложность", type: "select", options: [
      { value: "easy", label: "Лёгкий" }, { value: "medium", label: "Средний" }, { value: "hard", label: "Сложный" },
    ]},
    { name: "time_limit", label: "Время (мин)", type: "number" },
  ],
  aiFeature: {
    title: "AI-генератор тестов",
    description: "Создавайте вопросы на основе базы из Open Trivia DB",
    placeholder: "Например: создай 5 вопросов по истории средней сложности",
  },
  s: {
    btnPrimary: "bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-violet-700 border border-violet-200 hover:bg-violet-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 text-white shadow-lg",
    heroGradient: "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700",
    accent: "text-violet-600",
    accentBg: "bg-violet-50",
    accentBgStrong: "bg-violet-100",
    accentBorder: "border-violet-200",
    accentRing: "focus:ring-violet-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-violet-100 text-violet-800",
    link: "text-violet-600 hover:text-violet-800",
  },
}
export default themeConfig
