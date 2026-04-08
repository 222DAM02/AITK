const themeConfig = {
  projectName: "MedTracker",
  projectIcon: "💊",
  projectDescription: "Трекер приёма лекарств с расписанием и напоминаниями",

  entityName: "Лекарство",
  entityNamePlural: "Лекарства",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название препарата", type: "text", required: true },
    { name: "dosage", label: "Дозировка (например: 500мг)", type: "text", required: false },
    { name: "description", label: "Заметки / назначение", type: "textarea", required: false },
    { name: "category", label: "Форма выпуска", type: "select", required: true, options: [
      { value: "tablet", label: "Таблетки" },
      { value: "capsule", label: "Капсулы" },
      { value: "syrup", label: "Сироп" },
      { value: "injection", label: "Инъекция" },
      { value: "drops", label: "Капли" },
      { value: "spray", label: "Спрей" },
      { value: "patch", label: "Пластырь" },
      { value: "other", label: "Другое" },
    ]},
    { name: "frequency", label: "Частота приёма", type: "select", required: true, options: [
      { value: "once", label: "1 раз в день" },
      { value: "twice", label: "2 раза в день" },
      { value: "three", label: "3 раза в день" },
      { value: "four", label: "4 раза в день" },
      { value: "weekly", label: "1 раз в неделю" },
      { value: "as_needed", label: "По необходимости" },
    ]},
    { name: "start_date", label: "Дата начала", type: "date", required: false },
    { name: "end_date", label: "Дата окончания", type: "date", required: false },
  ],

  aiFeature: {
    title: "AI Медицинский ассистент",
    description: "Узнайте о лекарствах, взаимодействиях и правилах приёма (не заменяет врача)",
    placeholder: "Например: можно ли принимать ибупрофен вместе с парацетамолом?",
  },

  s: {
    btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-white border-b border-gray-200 shadow-sm",
    heroGradient: "bg-blue-50",
    accent: "text-blue-600",
    accentHover: "hover:text-blue-700",
    accentBg: "bg-blue-50",
    accentBgStrong: "bg-blue-100",
    accentBorder: "border-blue-200",
    accentRing: "focus:ring-blue-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-blue-100 text-blue-800",
    link: "text-blue-600 hover:text-blue-800 underline underline-offset-2",
  },
}

export default themeConfig
