// Карта города: районы, здания, кучи мусора, места для предметов.
// Координаты — в единицах мира (3000 × 1800). Порядок открытия районов [предв.].
EG.data.world = {
  width: 3000, height: 1800,

  districts: [
    { id: 'start',       name: 'Стартовая территория',            x: 40,   y: 580,  w: 960, h: 640, unlockLevel: 1 },
    { id: 'residential', name: 'Жилой район',                     x: 40,   y: 40,   w: 960, h: 520, unlockLevel: 11 },
    { id: 'trade',       name: 'Торговый район',                  x: 40,   y: 1240, w: 960, h: 520, unlockLevel: 21 },
    { id: 'green',       name: 'Зелёный район с парками',         x: 1020, y: 40,   w: 960, h: 520, unlockLevel: 21 },
    { id: 'center',      name: 'Центральный экологический центр', x: 1020, y: 580,  w: 960, h: 640, unlockLevel: 50 },
    { id: 'farm',        name: 'Фермерская территория',           x: 1020, y: 1240, w: 960, h: 520, unlockLevel: 29 },
    { id: 'water',       name: 'Район очистки воды',              x: 2000, y: 40,   w: 960, h: 520, unlockLevel: 25 },
    { id: 'energy',      name: 'Энергетический комплекс',         x: 2000, y: 580,  w: 960, h: 640, unlockLevel: 35 },
    { id: 'industrial',  name: 'Промышленный район',              x: 2000, y: 1240, w: 960, h: 520, unlockLevel: 39 }
  ],

  // Здания стартового района (x — левый край, y — линия «земли», w — ширина)
  buildings: [
    { id: 'lab',     name: 'Лаборатория',               x: 110, y: 830,  w: 190, unlockLevel: 2 },
    { id: 'shop',    name: 'Магазин',                   x: 370, y: 830,  w: 170, unlockLevel: 4 },
    { id: 'station', name: 'Экологическая станция',     x: 690, y: 830,  w: 210, unlockLevel: 7 },
    { id: 'house1',  name: 'Жилой дом №1', house: true, x: 70,  y: 1205, w: 140, restoreCost: 300 },
    { id: 'house2',  name: 'Жилой дом №2', house: true, x: 240, y: 1205, w: 140, restoreCost: 500 },
    { id: 'house3',  name: 'Жилой дом №3', house: true, x: 410, y: 1205, w: 140, restoreCost: 800 },
    { id: 'storage', name: 'Модуль хранения энергии',   x: 650, y: 1205, w: 120, unlockLevel: 6 },
    { id: 'biogas',  name: 'Биогазовая установка',      x: 800, y: 1205, w: 160, unlockLevel: 5 }
  ],

  // Кучи мусора: kind — mixed (смешанный) или organic (органика)
  piles: [
    { id: 'p1', x: 455, y: 895,  kind: 'mixed' },
    { id: 'p2', x: 400, y: 940,  kind: 'mixed' },
    { id: 'p3', x: 870, y: 895,  kind: 'mixed' },
    { id: 'p4', x: 180, y: 935,  kind: 'mixed' },
    { id: 'p5', x: 760, y: 945,  kind: 'mixed' },
    { id: 'p6', x: 455, y: 1050, kind: 'mixed' },
    { id: 'p7', x: 225, y: 1205, kind: 'mixed' },
    { id: 'p8', x: 785, y: 1205, kind: 'mixed' },
    { id: 'o1', x: 90,  y: 1020, kind: 'organic' },
    { id: 'o2', x: 310, y: 1050, kind: 'organic' },
    { id: 'o3', x: 700, y: 1010, kind: 'organic' },
    { id: 'o4', x: 835, y: 1005, kind: 'organic' },
    { id: 'o5', x: 960, y: 1010, kind: 'organic' },
    { id: 'o6', x: 385, y: 1000, kind: 'organic' }
  ],

  // Места для размещения купленных предметов (size: S — малые, L — крупные)
  slots: [
    { id: 's1',  x: 75,  y: 895,  size: 'S' }, { id: 's2',  x: 560, y: 865,  size: 'S' },
    { id: 's3',  x: 650, y: 865,  size: 'S' }, { id: 's4',  x: 965, y: 870,  size: 'S' },
    { id: 's5',  x: 165, y: 1050, size: 'S' }, { id: 's6',  x: 240, y: 1005, size: 'S' },
    { id: 's7',  x: 770, y: 1055, size: 'S' }, { id: 's8',  x: 900, y: 1055, size: 'S' },
    { id: 's9',  x: 600, y: 1205, size: 'S' }, { id: 's10', x: 395, y: 1205, size: 'S' },
    { id: 's11', x: 985, y: 1205, size: 'S' }, { id: 's12', x: 35,  y: 1205, size: 'S' },
    { id: 'L1',  x: 585, y: 1060, size: 'L' }
  ],

  // Дорога через район (полоса по y)
  road: { y1: 905, y2: 952 },

  viewpoint: { x: 520, y: 990 },     // «осмотреть территорию» (ур. 1)
  helpersPos: { x: 335, y: 900 },     // где стоят профессор и Байт
  camera: { x: 520, y: 900 }          // стартовый центр камеры
};
