const themeConfig = { projectName:"InventoryPro", projectDescription:"Складской учёт: товары, движение, остатки и аналитика", projectIcon:"📦",
  entityName:"Товар", entityNamePlural:"Товары", entityRoute:"items",
  entityFields: [
    {name:"title",label:"Название",type:"text",required:true},{name:"description",label:"Описание",type:"textarea"},
    {name:"sku",label:"Артикул (SKU)",type:"text"},
    {name:"category",label:"Категория",type:"select",required:true,options:[{value:"electronics",label:"Электроника"},{value:"food",label:"Продукты"},{value:"clothing",label:"Одежда"},{value:"tools",label:"Инструменты"},{value:"office",label:"Офис"},{value:"raw",label:"Сырьё"},{value:"other",label:"Прочее"}]},
    {name:"status",label:"Статус",type:"select",options:[{value:"in_stock",label:"В наличии"},{value:"low_stock",label:"Мало"},{value:"out_of_stock",label:"Нет в наличии"},{value:"discontinued",label:"Снят"}]},
    {name:"quantity",label:"Количество",type:"number",required:true},{name:"price",label:"Цена",type:"number"},
    {name:"supplier",label:"Поставщик",type:"text"},{name:"min_stock",label:"Мин. остаток",type:"number"},
  ],
  aiFeature:{title:"AI-логист",description:"Рекомендации по управлению запасами из базы знаний",placeholder:"Например: как рассчитать оптимальный объём заказа?"},
  s:{btnPrimary:"bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm",btnSecondary:"bg-white text-orange-700 border border-orange-200 hover:bg-orange-50 font-medium",btnDanger:"bg-red-500 hover:bg-red-600 text-white font-medium",btnSuccess:"bg-emerald-500 hover:bg-emerald-600 text-white font-medium",nav:"bg-orange-700 shadow-lg",heroGradient:"bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400",accent:"text-orange-600",accentBg:"bg-orange-50",accentBgStrong:"bg-orange-100",accentBorder:"border-orange-200",accentRing:"focus:ring-orange-400 focus:ring-2 focus:ring-offset-1",badge:"bg-orange-100 text-orange-800",link:"text-orange-600 hover:text-orange-800"},
}; export default themeConfig
