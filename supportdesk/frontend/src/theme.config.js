const themeConfig = { projectName:"SupportDesk", projectDescription:"Тикет-система: приоритеты, SLA, назначение и эскалация", projectIcon:"🎫",
  entityName:"Тикет", entityNamePlural:"Тикеты", entityRoute:"items",
  entityFields: [
    {name:"title",label:"Тема тикета",type:"text",required:true},{name:"description",label:"Описание",type:"textarea"},
    {name:"priority",label:"Приоритет",type:"select",required:true,options:[{value:"low",label:"Низкий"},{value:"medium",label:"Средний"},{value:"high",label:"Высокий"},{value:"critical",label:"Критический"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"open",label:"Открыт"},{value:"in_progress",label:"В работе"},{value:"waiting",label:"Ожидание"},{value:"resolved",label:"Решён"},{value:"closed",label:"Закрыт"}]},
    {name:"category",label:"Категория",type:"select",options:[{value:"bug",label:"Баг"},{value:"feature",label:"Фича"},{value:"question",label:"Вопрос"},{value:"incident",label:"Инцидент"},{value:"task",label:"Задача"}]},
    {name:"sla_hours",label:"SLA (часов)",type:"number"},
  ],
  aiFeature:{title:"AI-поддержка",description:"Помощь с решением тикетов на основе ITIL и ITSM практик",placeholder:"Например: как правильно эскалировать критический инцидент?"},
  s:{btnPrimary:"bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm",btnSecondary:"bg-white text-red-700 border border-red-200 hover:bg-red-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-gray-900 shadow-lg",heroGradient:"bg-gradient-to-br from-gray-900 via-red-900 to-gray-900",accent:"text-red-600",accentBg:"bg-red-50",accentBgStrong:"bg-red-100",accentBorder:"border-red-200",accentRing:"focus:ring-red-400 focus:ring-2 focus:ring-offset-1",badge:"bg-red-100 text-red-800",link:"text-red-600 hover:text-red-800"},
}; export default themeConfig
