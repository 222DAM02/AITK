// === ЕДИНАЯ ТОЧКА НАСТРОЙКИ ТЕМЫ ===

const themeConfig = {
  projectName: "FlashCards",
  projectDescription: "Создавайте карточки и запоминайте что угодно",
  projectIcon: "🧠",

  entityName: "Колода",
  entityNamePlural: "Колоды",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название колоды", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: true },
    { name: "category", label: "Категория", type: "select", required: false, options: [
      { value: "languages", label: "Иностранные языки" },
      { value: "science", label: "Наука" },
      { value: "history", label: "История" },
      { value: "programming", label: "Программирование" },
      { value: "math", label: "Математика" },
      { value: "other", label: "Другое" },
    ]},
    { name: "image_url", label: "Обложка (URL)", type: "url", required: false },
  ],

  aiFeature: {
    title: "AI-генератор карточек",
    description: "AI создаст набор карточек по любой теме для запоминания",
    placeholder: "Например: создай 10 карточек по неправильным глаголам английского языка",
  },

  // Тёмная тема с teal/cyan акцентами
  s: {
    btnPrimary: "bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm",
    btnSecondary: "bg-gray-800 text-teal-400 border border-gray-700 hover:bg-gray-700 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gray-900 border-b border-gray-800",
    heroGradient: "bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900",
    accent: "text-teal-400",
    accentHover: "hover:text-teal-300",
    accentBg: "bg-gray-800",
    accentBgStrong: "bg-gray-700",
    accentBorder: "border-gray-700",
    accentRing: "focus:ring-teal-400 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900",
    badge: "bg-teal-900/50 text-teal-300",
    link: "text-teal-400 hover:text-teal-300 underline underline-offset-2",
    // Dark theme specific
    card: "bg-gray-800 border-gray-700",
    cardHover: "hover:border-teal-500/50 hover:shadow-teal-500/10 hover:shadow-lg",
    text: "text-gray-100",
    textMuted: "text-gray-400",
    textDimmed: "text-gray-500",
    surface: "bg-gray-800 border border-gray-700",
    input: "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500",
  },
}

export default themeConfig
