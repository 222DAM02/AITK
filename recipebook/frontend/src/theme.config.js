const themeConfig = {
  projectName: "RecipeBook",
  projectDescription: "Платформа для хранения и обмена рецептами",

  entityName: "Рецепт",
  entityNamePlural: "Рецепты",
  entityRoute: "items",

  entityFields: [
    { name: "title", label: "Название", type: "text", required: true },
    { name: "description", label: "Описание", type: "textarea", required: true },
    { name: "ingredients", label: "Ингредиенты", type: "textarea", required: false },
    { name: "cooking_time", label: "Время готовки (мин)", type: "number", required: false },
    { name: "image_url", label: "URL изображения", type: "url", required: false },
  ],

  aiFeature: {
    title: "AI-помощник по рецептам",
    description: "Спросите AI о рецептах, ингредиентах или техниках готовки",
    placeholder: "Например: предложи рецепт из курицы и риса на ужин",
  },

  s: {
    btnPrimary: "bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm",
    btnSecondary: "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 font-medium",
    btnDanger: "bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm",
    btnSuccess: "bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm",
    nav: "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 shadow-lg",
    heroGradient: "bg-gradient-to-br from-amber-500 via-orange-400 to-red-400",
    accent: "text-amber-600",
    accentHover: "hover:text-amber-700",
    accentBg: "bg-amber-50",
    accentBgStrong: "bg-amber-100",
    accentBorder: "border-amber-200",
    accentRing: "focus:ring-amber-400 focus:ring-2 focus:ring-offset-1",
    badge: "bg-amber-100 text-amber-800",
    link: "text-amber-600 hover:text-amber-800 underline underline-offset-2",
  },
}

export default themeConfig
