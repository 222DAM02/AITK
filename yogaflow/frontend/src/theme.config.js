const themeConfig = {
  projectName: "YogaFlow",
  projectIcon: "🧘",
  projectDescription: "Библиотека йога-последовательностей с практикой и AI-инструктором",

  entityName: "Поток",
  entityNamePlural: "Потоки",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название потока", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: false },
    { name: "level", label: "Уровень", type: "select", required: true, options: [
      { value: "beginner", label: "🌱 Начинающий" },
      { value: "intermediate", label: "🌿 Средний" },
      { value: "advanced", label: "🌳 Продвинутый" },
    ]},
    { name: "style", label: "Стиль йоги", type: "select", required: true, options: [
      { value: "vinyasa", label: "Виньяса" },
      { value: "hatha", label: "Хатха" },
      { value: "yin", label: "Инь" },
      { value: "power", label: "Силовая" },
      { value: "restorative", label: "Восстановительная" },
      { value: "ashtanga", label: "Аштанга" },
      { value: "kundalini", label: "Кундалини" },
      { value: "other", label: "Другое" },
    ]},
    { name: "duration_minutes", label: "Длительность (мин)", type: "number", required: false },
    { name: "focus", label: "Фокус (бёдра, спина, баланс...)", type: "text", required: false },
  ],

  aiFeature: {
    title: "AI Инструктор йоги",
    description: "Попросите AI составить последовательность поз или объяснить технику асаны",
    placeholder: "Например: составь 20-минутный утренний поток для начинающих с фокусом на растяжку",
  },

  s: {
    btnPrimary: "bg-green-700 hover:bg-green-800 text-white font-medium shadow-sm",
    btnSecondary: "bg-stone-100 text-green-800 border border-stone-300 hover:bg-stone-200 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm",
    nav: "bg-gradient-to-r from-green-900 to-teal-800 shadow-md",
    heroGradient: "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700",
    accent: "text-green-700",
    accentHover: "hover:text-green-800",
    accentBg: "bg-green-50",
    accentBgStrong: "bg-green-100",
    accentBorder: "border-green-200",
    accentRing: "focus:ring-green-500 focus:ring-2 focus:ring-offset-1",
    badge: "bg-green-100 text-green-800",
    link: "text-green-700 hover:text-green-900 underline underline-offset-2",
  },
}

export default themeConfig
