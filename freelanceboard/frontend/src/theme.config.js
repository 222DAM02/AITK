const themeConfig = { projectName:"FreelanceBoard", projectDescription:"Биржа фрилансеров: заказы, отклики и портфолио", projectIcon:"💼",
  entityName:"Заказ", entityNamePlural:"Заказы", entityRoute:"items",
  entityFields: [
    {name:"title",label:"Название проекта",type:"text",required:true},{name:"description",label:"Описание",type:"textarea"},
    {name:"category",label:"Категория",type:"select",required:true,options:[{value:"web",label:"Веб-разработка"},{value:"mobile",label:"Мобильная"},{value:"design",label:"Дизайн"},{value:"marketing",label:"Маркетинг"},{value:"writing",label:"Копирайтинг"},{value:"video",label:"Видео"},{value:"data",label:"Данные/ML"},{value:"devops",label:"DevOps"},{value:"other",label:"Другое"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"open",label:"Открыт"},{value:"in_progress",label:"В работе"},{value:"review",label:"На проверке"},{value:"completed",label:"Завершён"},{value:"cancelled",label:"Отменён"}]},
    {name:"budget_type",label:"Тип бюджета",type:"select",options:[{value:"fixed",label:"Фиксированный"},{value:"hourly",label:"Почасовой"}]},
    {name:"budget",label:"Бюджет (₽)",type:"number"},{name:"deadline",label:"Дедлайн",type:"date"},{name:"skills",label:"Навыки (через запятую)",type:"text"},
  ],
  aiFeature:{title:"AI-карьерный консультант",description:"Советы по фрилансу, оценке проектов и развитию навыков",placeholder:"Например: как оценить стоимость проекта на React?"},
  s:{btnPrimary:"bg-sky-600 hover:bg-sky-700 text-white font-medium shadow-sm",btnSecondary:"bg-white text-sky-700 border border-sky-200 hover:bg-sky-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-sky-700 shadow-lg",heroGradient:"bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600",accent:"text-sky-600",accentBg:"bg-sky-50",accentBgStrong:"bg-sky-100",accentBorder:"border-sky-200",accentRing:"focus:ring-sky-400 focus:ring-2 focus:ring-offset-1",badge:"bg-sky-100 text-sky-800",link:"text-sky-600 hover:text-sky-800"},
}; export default themeConfig
