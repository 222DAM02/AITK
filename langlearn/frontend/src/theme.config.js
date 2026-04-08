const themeConfig = {
  projectName: "LangLearn",
  projectIcon: "🌍",
  projectDescription: "Платформа для изучения иностранных слов с квизами и AI-помощником",

  entityName: "Словарь",
  entityNamePlural: "Словари",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название словаря", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: true },
    { name: "language", label: "Язык", type: "select", required: true, options: [
      { value: "en", label: "Английский" },
      { value: "de", label: "Немецкий" },
      { value: "fr", label: "Французский" },
      { value: "es", label: "Испанский" },
      { value: "ja", label: "Японский" },
      { value: "zh", label: "Китайский" },
      { value: "ko", label: "Корейский" },
      { value: "other", label: "Другой" },
    ]},
    { name: "category", label: "Категория", type: "select", required: false, options: [
      { value: "general", label: "Общее" },
      { value: "travel", label: "Путешествия" },
      { value: "business", label: "Бизнес" },
      { value: "tech", label: "Технологии" },
      { value: "food", label: "Еда" },
      { value: "medicine", label: "Медицина" },
    ]},
  ],

  aiFeature: {
    title: "AI-генератор слов",
    description: "Попросите AI составить список слов по любой теме на любом языке",
    placeholder: "Например: 20 слов на тему путешествий на английском с переводом",
  },

  s: {
    btnPrimary: "bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gradient-to-r from-rose-600 via-pink-500 to-fuchsia-500 shadow-lg",
    heroGradient: "bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500",
    accent: "text-rose-600",
    accentHover: "hover:text-rose-700",
    accentBg: "bg-rose-50",
    accentBgStrong: "bg-rose-100",
    accentBorder: "border-rose-200",
    accentRing: "focus:ring-rose-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-rose-100 text-rose-800",
    link: "text-rose-600 hover:text-rose-800 underline underline-offset-2",
  },
}

export default themeConfig
