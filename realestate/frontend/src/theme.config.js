const themeConfig = { projectName:"RealEstate", projectDescription:"Каталог недвижимости: поиск, сравнение и аналитика объектов", projectIcon:"🏠",
  entityName:"Объект", entityNamePlural:"Объекты", entityRoute:"items",
  entityFields: [
    {name:"title",label:"Заголовок",type:"text",required:true},{name:"description",label:"Описание",type:"textarea"},
    {name:"property_type",label:"Тип",type:"select",required:true,options:[{value:"apartment",label:"Квартира"},{value:"house",label:"Дом"},{value:"studio",label:"Студия"},{value:"room",label:"Комната"},{value:"commercial",label:"Коммерция"},{value:"land",label:"Участок"}]},
    {name:"deal_type",label:"Сделка",type:"select",options:[{value:"sale",label:"Продажа"},{value:"rent",label:"Аренда"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"active",label:"Активно"},{value:"reserved",label:"Забронировано"},{value:"sold",label:"Продано"},{value:"rented",label:"Сдано"}]},
    {name:"price",label:"Цена (₽)",type:"number",required:true},{name:"area",label:"Площадь (м²)",type:"number"},
    {name:"rooms",label:"Комнат",type:"number"},{name:"floor",label:"Этаж",type:"number"},{name:"total_floors",label:"Этажей в доме",type:"number"},
    {name:"address",label:"Адрес",type:"text"},{name:"district",label:"Район",type:"text"},
  ],
  aiFeature:{title:"AI-риелтор",description:"Консультации по недвижимости на основе рыночных данных",placeholder:"Например: на что обратить внимание при покупке квартиры?"},
  s:{btnPrimary:"bg-amber-700 hover:bg-amber-800 text-white font-medium shadow-sm",btnSecondary:"bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-stone-900 shadow-lg",heroGradient:"bg-gradient-to-br from-stone-800 via-stone-700 to-amber-800",accent:"text-amber-700",accentBg:"bg-amber-50",accentBgStrong:"bg-amber-100",accentBorder:"border-amber-200",accentRing:"focus:ring-amber-400 focus:ring-2 focus:ring-offset-1",badge:"bg-amber-100 text-amber-800",link:"text-amber-700 hover:text-amber-900"},
}; export default themeConfig
