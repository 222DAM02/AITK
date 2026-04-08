const themeConfig = {
  projectName: "FitTracker",
  projectIcon: "💪",
  projectDescription: "Дневник тренировок с отслеживанием упражнений и прогресса",

  entityName: "Тренировка",
  entityNamePlural: "Тренировки",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название тренировки", type: "text", required: true },
    { name: "description", label: "Описание / заметки", type: "textarea", required: false },
    { name: "workout_type", label: "Тип тренировки", type: "select", required: true, options: [
      { value: "strength", label: "Силовая" },
      { value: "cardio", label: "Кардио" },
      { value: "flexibility", label: "Растяжка" },
      { value: "hiit", label: "HIIT" },
      { value: "crossfit", label: "Кроссфит" },
      { value: "yoga", label: "Йога" },
      { value: "swimming", label: "Плавание" },
      { value: "running", label: "Бег" },
      { value: "cycling", label: "Велосипед" },
      { value: "other", label: "Другое" },
    ]},
    { name: "duration_minutes", label: "Длительность (мин)", type: "number", required: false },
    { name: "calories_burned", label: "Калории", type: "number", required: false },
  ],

  aiFeature: {
    title: "AI Фитнес-тренер",
    description: "Попросите AI составить программу тренировок или подобрать упражнения",
    placeholder: "Например: составь программу тренировок на неделю для набора мышечной массы",
  },

  s: {
    btnPrimary: "bg-lime-500 hover:bg-lime-600 text-slate-900 font-semibold shadow-sm",
    btnSecondary: "bg-slate-800 text-lime-400 border border-slate-700 hover:bg-slate-700 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-slate-900 shadow-lg",
    heroGradient: "bg-slate-900",
    accent: "text-lime-500",
    accentHover: "hover:text-lime-400",
    accentBg: "bg-lime-50",
    accentBgStrong: "bg-lime-100",
    accentBorder: "border-lime-300",
    accentRing: "focus:ring-lime-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-lime-100 text-lime-800",
    link: "text-lime-600 hover:text-lime-700 underline underline-offset-2",
  },
}

export default themeConfig
