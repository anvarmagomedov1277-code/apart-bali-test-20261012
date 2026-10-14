// Только публичные сведения. Источники — во внутренней библиотеке.
export const siteConfig = {
  mode: 'public-test', updatedAt: '2026-10-14', name: 'БАЛИ', location: 'Зеленоморск, Дагестан',
  assetVersion: '20261014-media13',
  publicUrl: 'https://anvarmagomedov1277-code.github.io/apart-bali-test-20261012/',
  offer: { firstPayment: 500000, ownPercent: 70 },
  contact: { whatsapp: '79887760404', phoneDisplay: '+7 988 776-04-04', instagram: 'apart_bali' },
  project: { buildings: 18, floors: '8–12', apartments: 2244, area: 76000 },
  investment: { monthlyMin: 80000, monthlyMax: 150000, resaleGrowth: 2000000, status: 'forecast' },
  pricing: { cashPerSquare:85000, installmentPerSquare:95000 },
  gallery: [
    { id:'overview', title:'Архитектура в масштабе', caption:'Корпуса, благоустройство и первая береговая линия.', width:2752, height:1536 },
    { id:'pool', title:'Курорт внутри комплекса', caption:'Бассейны и пространства для отдыха.', width:2752, height:1536 },
    { id:'evening', title:'Другая сторона вечера', caption:'Вечерняя подсветка и панорама комплекса.', width:2098, height:750 },
    { id:'balcony', title:'Своя точка притяжения', caption:'Вид с балкона на территорию комплекса.', width:2752, height:1536 },
    { id:'sunset', title:'В свете заката', caption:'Фасады и курортное настроение.', width:2752, height:1536 },
    { id:'beach', title:'Прогулка у воды', caption:'Пляжная инфраструктура в концепции проекта.', width:941, height:1672 }
  ],
  apartments: [
    { area:'25,9', areaHundredths:2590, width:793, height:1984, features:['Открытая планировка','Кухонная зона','Балкон'] },
    { area:'29,04', areaHundredths:2904, width:750, height:2097, features:['Зал-кухня','Прихожая','Скруглённый балкон'] },
    { area:'29,4', areaHundredths:2940, width:736, height:2135, features:['Зал-кухня','Прихожая','Балкон'] },
    { area:'29,41', areaHundredths:2941, width:725, height:2170, features:['Зал-кухня','Прихожая','Балкон'] },
    { area:'31,82', areaHundredths:3182, width:1053, height:1494, features:['Открытая планировка','Прихожая','Без балкона'] },
    { area:'32,23', areaHundredths:3223, width:725, height:2170, features:['Зал-кухня','Прихожая','Балкон'] },
    { area:'32,47', areaHundredths:3247, width:903, height:1742, features:['Зал-кухня','Прихожая','Балкон'] },
    { area:'42,57', areaHundredths:4257, width:889, height:1770, features:['Отдельная спальня','Зал-кухня','Балкон вдоль фасада'] },
    { area:'42,61', areaHundredths:4261, width:1383, height:1137, features:['Отдельная спальня','Кухонная зона','Без балкона'] },
    { id:'plan-triangle', image:'assets/media/plan-triangle.webp', area:'50,69', areaHundredths:5069, width:1237, height:1272, features:['Отдельная спальня','Зал-кухня','Угловой балкон'] },
    { area:'55,44', areaHundredths:5544, width:1045, height:1505, features:['Отдельная спальня','Отдельная кухня','Балкон'] },
    { area:'60,4', areaHundredths:6040, width:1041, height:1510, features:['Отдельная спальня','Гардеробная','Балкон'] },
    { area:'63,69', areaHundredths:6369, width:1031, height:1526, features:['Отдельная спальня','Гардеробная','Балкон'] }
  ].map(plan=>({ ...plan, id:plan.id||'plan-'+plan.areaHundredths,
    image:plan.image||'assets/media/plan-'+(plan.areaHundredths||'triangle')+'.webp',
    title:plan.area?'Апартамент '+plan.area+' м²':'Апартамент с угловым балконом',
    description:plan.features[0]==='Отдельная спальня'?'Личное пространство для отдыха и отдельная зона для встреч.':'Открытое пространство для отдыха с удобной кухонной зоной.',
    status:plan.id==='plan-triangle'?'Площадь включает балкон. Наличие и условия уточняются в предложении.':'Площадь указана на планировке. Наличие и условия уточняются в предложении.'
  }))
};
