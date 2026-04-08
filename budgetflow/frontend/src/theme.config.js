const themeConfig = {
  projectName: "BudgetFlow",
  projectDescription: "Управление личными финансами: доходы, расходы, бюджеты и аналитика",
  projectIcon: "💰",

  entityName: "Транзакция",
  entityNamePlural: "Транзакции",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название", type: "text", required: true },
    { name: "amount", label: "Сумма", type: "number", required: true },
    { name: "type", label: "Тип", type: "select", required: true, options: [
      { value: "income", label: "Доход" },
      { value: "expense", label: "Расход" },
    ]},
    { name: "category", label: "Категория", type: "select", required: true, options: [
      { value: "salary", label: "Зарплата" }, { value: "freelance", label: "Фриланс" },
      { value: "investment", label: "Инвестиции" }, { value: "other_income", label: "Прочий доход" },
      { value: "food", label: "Еда" }, { value: "transport", label: "Транспорт" },
      { value: "housing", label: "Жильё" }, { value: "utilities", label: "Коммунальные" },
      { value: "health", label: "Здоровье" }, { value: "education", label: "Образование" },
      { value: "entertainment", label: "Развлечения" }, { value: "clothing", label: "Одежда" },
      { value: "savings", label: "Накопления" }, { value: "other_expense", label: "Прочий расход" },
    ]},
    { name: "currency", label: "Валюта", type: "select", options: [
      { value: "RUB", label: "₽ RUB" }, { value: "USD", label: "$ USD" },
      { value: "EUR", label: "€ EUR" }, { value: "GBP", label: "£ GBP" },
    ]},
    { name: "date", label: "Дата", type: "date", required: true },
    { name: "description", label: "Комментарий", type: "textarea" },
  ],

  aiFeature: {
    title: "AI Финансовый консультант",
    description: "Получайте советы по бюджету, инвестициям и финансовому планированию на основе актуальных данных",
    placeholder: "Например: как распределить бюджет 100 000 рублей на месяц?",
  },

  s: {
    btnPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gray-900 shadow-lg",
    heroGradient: "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600",
    accent: "text-emerald-600",
    accentHover: "hover:text-emerald-700",
    accentBg: "bg-emerald-50",
    accentBgStrong: "bg-emerald-100",
    accentBorder: "border-emerald-200",
    accentRing: "focus:ring-emerald-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-emerald-100 text-emerald-800",
    link: "text-emerald-600 hover:text-emerald-800 underline underline-offset-2",
  },
}

export default themeConfig
