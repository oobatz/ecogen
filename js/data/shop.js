// Магазин. Цены предварительные (концепция §12), диапазон → берём нижнюю границу.
// kind: place — ставится на карту; upgrade — улучшение без размещения.
// size: S/L — какое место на карте нужно.
EG.data.shopCategories = [
  { id: 'plants',  name: 'Растения и озеленение' },
  { id: 'infra',   name: 'Городская инфраструктура' },
  { id: 'eco',     name: 'Экологические объекты' },
  { id: 'recycle', name: 'Оборудование для переработки' },
  { id: 'energy',  name: 'Энергетическое оборудование' },
  { id: 'decor',   name: 'Декор' }
];

EG.data.shopItems = [
  // Растения
  { id: 'seeds',     cat: 'plants', name: 'Семена',            price: 50,  kind: 'place', size: 'S', unlockLevel: 4, grows: true,
    desc: 'Посадите — через минуту вырастет молодое дерево.' },
  { id: 'bush',      cat: 'plants', name: 'Куст',              price: 80,  kind: 'place', size: 'S', unlockLevel: 4, green: 1 },
  { id: 'tree',      cat: 'plants', name: 'Дерево',            price: 100, kind: 'place', size: 'S', unlockLevel: 4, green: 2 },
  { id: 'flowerbed', cat: 'plants', name: 'Цветочная клумба',  price: 120, kind: 'place', size: 'S', unlockLevel: 4, green: 2 },
  // Инфраструктура
  { id: 'bin',     cat: 'infra', name: 'Мусорный контейнер', price: 70,  kind: 'place', size: 'S', unlockLevel: 4 },
  { id: 'bench',   cat: 'infra', name: 'Скамейка',           price: 150, kind: 'place', size: 'S', unlockLevel: 4 },
  { id: 'lamp',    cat: 'infra', name: 'Уличный фонарь',     price: 180, kind: 'place', size: 'S', unlockLevel: 4 },
  { id: 'gazebo',  cat: 'infra', name: 'Беседка',            price: 250, kind: 'place', size: 'L', unlockLevel: 4 },
  // Экологические объекты
  { id: 'sepbin',  cat: 'eco', name: 'Контейнер для раздельного сбора', price: 100, priceMax: 180, kind: 'place', size: 'S', unlockLevel: 7 },
  { id: 'station2',cat: 'eco', name: 'Дополнительная станция сортировки', price: null, priceNote: 'цена определяется улучшением', kind: 'place', size: 'L', unlockLevel: 24 },
  { id: 'filter',  cat: 'eco', name: 'Фильтр', price: null, priceNote: 'цена определяется уровнем', kind: 'place', size: 'S', unlockLevel: 15 },
  { id: 'labgear', cat: 'eco', name: 'Лабораторное оборудование', price: 100, priceMax: 350, kind: 'upgrade', unlockLevel: 2,
    effect: { sciBonus: 1 }, desc: '+1 научное очко за каждое исследование.' },
  // Переработка
  { id: 'sortmod',  cat: 'recycle', name: 'Сортировочный модуль', price: 250, priceMax: 400, kind: 'place', size: 'L', unlockLevel: 14 },
  { id: 'conveyor', cat: 'recycle', name: 'Конвейер',             price: 350, priceMax: 500, kind: 'place', size: 'L', unlockLevel: 33 },
  { id: 'press',    cat: 'recycle', name: 'Пресс',                price: 400, priceMax: 600, kind: 'place', size: 'L', unlockLevel: 33 },
  { id: 'compost',  cat: 'recycle', name: 'Компостный модуль',    price: 500, priceMax: 700, kind: 'place', size: 'L', unlockLevel: 30 },
  // Энергетика
  { id: 'battery',  cat: 'energy', name: 'Накопитель энергии', price: 300, priceMax: 500, kind: 'upgrade', unlockLevel: 6,
    effect: { energyCap: 20 }, desc: '+20 к лимиту хранения энергии.' },
  { id: 'solar',    cat: 'energy', name: 'Солнечная панель', price: 300, priceNote: 'базовый вариант', kind: 'place', size: 'S', unlockLevel: 35 },
  { id: 'energysys',cat: 'energy', name: 'Улучшенная энергетическая система', price: 500, priceMax: 900, kind: 'upgrade', unlockLevel: 43 },
  // Декор
  { id: 'sign',    cat: 'decor', name: 'Экологическая табличка', price: 40,  priceMax: 100, kind: 'place', size: 'S', unlockLevel: 4 },
  { id: 'flowers', cat: 'decor', name: 'Декоративные цветы',     price: 50,  priceMax: 150, kind: 'place', size: 'S', unlockLevel: 4, green: 1 },
  { id: 'fountain',cat: 'decor', name: 'Питьевой фонтанчик',     price: 100, priceMax: 250, kind: 'place', size: 'S', unlockLevel: 4,
    desc: 'Небольшой элемент благоустройства.' }
];

// Стартовый набор (ур. 1) — выдаётся бесплатно
EG.data.starterKit = { items: { bin: 2 }, flags: ['gloves'] };
