const themeConfig = { projectName:"HRPortal", projectDescription:"HR-система: сотрудники, отделы, отпуска и аналитика", projectIcon:"👥",
  entityName:"Сотрудник", entityNamePlural:"Сотрудники", entityRoute:"items",
  entityFields: [
    {name:"title",label:"ФИО",type:"text",required:true},{name:"position",label:"Должность",type:"text"},
    {name:"department",label:"Отдел",type:"select",required:true,options:[{value:"dev",label:"Разработка"},{value:"design",label:"Дизайн"},{value:"marketing",label:"Маркетинг"},{value:"hr",label:"HR"},{value:"finance",label:"Финансы"},{value:"sales",label:"Продажи"},{value:"support",label:"Поддержка"},{value:"management",label:"Управление"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"active",label:"Работает"},{value:"vacation",label:"В отпуске"},{value:"sick",label:"На больничном"},{value:"fired",label:"Уволен"}]},
    {name:"salary",label:"Зарплата",type:"number"},{name:"hire_date",label:"Дата найма",type:"date"},
    {name:"email",label:"Email",type:"text"},{name:"phone",label:"Телефон",type:"text"},{name:"description",label:"Заметки",type:"textarea"},
  ],
  aiFeature:{title:"AI HR-ассистент",description:"Рекомендации по управлению персоналом на основе HR-практик",placeholder:"Например: как провести эффективный onboarding нового сотрудника?"},
  s:{btnPrimary:"bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm",btnSecondary:"bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-white border-b border-gray-200 shadow-sm",heroGradient:"bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500",accent:"text-indigo-600",accentBg:"bg-indigo-50",accentBgStrong:"bg-indigo-100",accentBorder:"border-indigo-200",accentRing:"focus:ring-indigo-400 focus:ring-2 focus:ring-offset-1",badge:"bg-indigo-100 text-indigo-800",link:"text-indigo-600 hover:text-indigo-800"},
}; export default themeConfig
