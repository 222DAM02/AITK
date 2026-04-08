const themeConfig = { projectName:"ClinicQueue", projectDescription:"Электронная очередь: врачи, расписание и запись на приём", projectIcon:"🏥",
  entityName:"Врач", entityNamePlural:"Врачи", entityRoute:"items",
  entityFields: [
    {name:"title",label:"ФИО врача",type:"text",required:true},{name:"description",label:"О враче",type:"textarea"},
    {name:"specialization",label:"Специализация",type:"select",required:true,options:[{value:"therapist",label:"Терапевт"},{value:"surgeon",label:"Хирург"},{value:"dentist",label:"Стоматолог"},{value:"cardiologist",label:"Кардиолог"},{value:"neurologist",label:"Невролог"},{value:"ophthalmologist",label:"Офтальмолог"},{value:"dermatologist",label:"Дерматолог"},{value:"pediatrician",label:"Педиатр"},{value:"ent",label:"ЛОР"},{value:"orthopedist",label:"Ортопед"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"available",label:"Принимает"},{value:"busy",label:"Занят"},{value:"day_off",label:"Выходной"},{value:"vacation",label:"Отпуск"}]},
    {name:"cabinet",label:"Кабинет",type:"text"},{name:"experience_years",label:"Стаж (лет)",type:"number"},{name:"reception_time",label:"Время приёма",type:"text"},
  ],
  aiFeature:{title:"AI-регистратура",description:"Подбор врача и консультации на основе медицинских данных",placeholder:"Например: к какому врачу обратиться с головной болью?"},
  s:{btnPrimary:"bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm",btnSecondary:"bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-white border-b border-gray-200 shadow-sm",heroGradient:"bg-gradient-to-br from-teal-500 via-emerald-500 to-green-400",accent:"text-teal-600",accentBg:"bg-teal-50",accentBgStrong:"bg-teal-100",accentBorder:"border-teal-200",accentRing:"focus:ring-teal-400 focus:ring-2 focus:ring-offset-1",badge:"bg-teal-100 text-teal-800",link:"text-teal-600 hover:text-teal-800"},
}; export default themeConfig
