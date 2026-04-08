const themeConfig = {
  projectName: "StudyNotes",
  projectIcon: "📝",
  projectDescription: "Платформа для создания конспектов и заметок с AI-помощником",

  entityName: "Заметка",
  entityNamePlural: "Заметки",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Заголовок", type: "text", required: true },
    { name: "description", label: "Содержание", type: "textarea", required: true },
    { name: "subject", label: "Предмет", type: "select", required: true, options: [
      { value: "math", label: "Математика" },
      { value: "physics", label: "Физика" },
      { value: "chemistry", label: "Химия" },
      { value: "biology", label: "Биология" },
      { value: "history", label: "История" },
      { value: "literature", label: "Литература" },
      { value: "cs", label: "Информатика" },
      { value: "languages", label: "Языки" },
      { value: "philosophy", label: "Философия" },
      { value: "other", label: "Другое" },
    ]},
    { name: "tags", label: "Теги (через запятую)", type: "text", required: false },
  ],

  aiFeature: {
    title: "AI-помощник для учёбы",
    description: "Попросите AI объяснить тему, составить конспект или подготовить шпаргалку",
    placeholder: "Например: объясни теорему Пифагора простыми словами с примерами",
  },

  s: {
    btnPrimary: "bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-sky-700 border border-sky-200 hover:bg-sky-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-white border-b border-gray-200 shadow-sm",
    heroGradient: "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50",
    accent: "text-sky-600",
    accentHover: "hover:text-sky-700",
    accentBg: "bg-sky-50",
    accentBgStrong: "bg-sky-100",
    accentBorder: "border-sky-200",
    accentRing: "focus:ring-sky-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-sky-100 text-sky-800",
    link: "text-sky-600 hover:text-sky-800 underline underline-offset-2",
  },
}

export default themeConfig
