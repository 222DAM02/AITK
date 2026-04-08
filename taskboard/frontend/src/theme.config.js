const themeConfig = {
  projectName: "TaskBoard",
  projectIcon: "📋",
  projectDescription: "Канбан-доска для управления задачами с приоритетами и дедлайнами",

  entityName: "Задача",
  entityNamePlural: "Задачи",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название задачи", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: false },
    { name: "priority", label: "Приоритет", type: "select", required: true, options: [
      { value: "low", label: "🟢 Низкий" },
      { value: "medium", label: "🔵 Средний" },
      { value: "high", label: "🟡 Высокий" },
      { value: "critical", label: "🔴 Критический" },
    ]},
    { name: "status", label: "Статус", type: "select", required: true, options: [
      { value: "todo", label: "К выполнению" },
      { value: "in_progress", label: "В работе" },
      { value: "review", label: "На проверке" },
      { value: "done", label: "Готово" },
    ]},
    { name: "due_date", label: "Дедлайн", type: "date", required: false },
  ],

  aiFeature: {
    title: "AI-менеджер задач",
    description: "Попросите AI разбить задачу на подзадачи, предложить план или помочь с приоритетами",
    placeholder: "Например: помоги разбить запуск продукта на задачи с приоритетами",
  },

  s: {
    btnPrimary: "bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600 font-medium",
    btnDanger: "bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm",
    nav: "bg-slate-900 border-b border-slate-700 shadow-lg",
    heroGradient: "bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950",
    accent: "text-violet-400",
    accentHover: "hover:text-violet-300",
    accentBg: "bg-violet-900/30",
    accentBgStrong: "bg-violet-800/40",
    accentBorder: "border-violet-700",
    accentRing: "focus:ring-violet-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900",
    badge: "bg-violet-900/50 text-violet-300",
    link: "text-violet-400 hover:text-violet-300 underline underline-offset-2",
  },
}

export default themeConfig
