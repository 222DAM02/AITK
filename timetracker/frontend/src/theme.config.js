const themeConfig = {
  projectName: "TimeTracker",
  projectIcon: "⏱️",
  projectDescription: "Учёт рабочего времени по проектам с таймером и отчётами",

  entityName: "Проект",
  entityNamePlural: "Проекты",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название проекта", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: false },
    { name: "status", label: "Статус", type: "select", required: true, options: [
      { value: "active", label: "Активный" },
      { value: "paused", label: "На паузе" },
      { value: "completed", label: "Завершён" },
      { value: "archived", label: "Архив" },
    ]},
    { name: "color", label: "Цвет", type: "select", required: true, options: [
      { value: "blue", label: "🔵 Синий" },
      { value: "green", label: "🟢 Зелёный" },
      { value: "red", label: "🔴 Красный" },
      { value: "purple", label: "🟣 Фиолетовый" },
      { value: "orange", label: "🟠 Оранжевый" },
      { value: "cyan", label: "🩵 Бирюзовый" },
      { value: "pink", label: "🩷 Розовый" },
      { value: "yellow", label: "🟡 Жёлтый" },
    ]},
    { name: "hourly_rate", label: "Ставка (₽/час)", type: "number", required: false },
  ],

  aiFeature: {
    title: "AI-ассистент по тайм-менеджменту",
    description: "Попросите AI проанализировать затраты времени, оптимизировать расписание или составить план дня",
    placeholder: "Например: проанализируй моё время за неделю и предложи как оптимизировать",
  },

  s: {
    btnPrimary: "bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-cyan-700 border border-cyan-200 hover:bg-cyan-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gradient-to-r from-cyan-700 via-teal-600 to-cyan-700 shadow-lg",
    heroGradient: "bg-gradient-to-br from-cyan-600 via-teal-500 to-emerald-500",
    accent: "text-cyan-600",
    accentHover: "hover:text-cyan-700",
    accentBg: "bg-cyan-50",
    accentBgStrong: "bg-cyan-100",
    accentBorder: "border-cyan-200",
    accentRing: "focus:ring-cyan-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-cyan-100 text-cyan-800",
    link: "text-cyan-600 hover:text-cyan-800 underline underline-offset-2",
  },
}

export default themeConfig
