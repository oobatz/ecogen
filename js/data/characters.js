// Персонажи. Внешность зафиксирована палитрой — не менять случайно.
// Имена предварительные (см. DESIGN.md §12).
window.EG = window.EG || {};
EG.data = EG.data || {};

EG.data.characters = [
  {
    id: 'aliya', name: 'Алия', num: 1, preliminaryName: true,
    title: 'Девочка с тёмными волосами',
    traits: ['Длинные тёмные волосы', 'Зелёная куртка', 'Футболка с экологическим символом', 'Дружелюбная и активная'],
    skin: '#f2c9a5', hair: { style: 'long', color: '#2a1b14', shade: '#160e0a' },
    jacket: '#3e9f4c', jacketShade: '#2d7b39', shirt: '#ffffff', shirtIcon: 'eco', extras: []
  },
  {
    id: 'arman', name: 'Арман', num: 2, preliminaryName: true,
    title: 'Мальчик с коричневыми волосами',
    traits: ['Немного растрёпанные коричневые волосы', 'Тёмная одежда', 'Наушники на шее', 'Футболка со значком листа'],
    skin: '#e9b78e', hair: { style: 'messy', color: '#7a4a25', shade: '#5a3418' },
    jacket: '#2f3542', jacketShade: '#1f2430', shirt: '#454c5c', shirtIcon: 'leaf', extras: ['headphones']
  },
  {
    id: 'mira', name: 'Мира', num: 3, preliminaryName: true,
    title: 'Девочка со светлыми волосами',
    traits: ['Светло-русые волосы, собранные назад', 'Светлая футболка с космическим символом', 'Фиолетовая верхняя одежда'],
    skin: '#f6d5b8', hair: { style: 'ponytail', color: '#e6c36d', shade: '#c9a24c' },
    jacket: '#7a4cc2', jacketShade: '#5c3599', shirt: '#f5f3ee', shirtIcon: 'space', extras: []
  },
  {
    id: 'dan', name: 'Дан', num: 4, preliminaryName: true,
    title: 'Мальчик с тёмными волнистыми волосами',
    traits: ['Тёмные волнистые волосы', 'Чёрная или серая одежда', 'Лямки рюкзака'],
    skin: '#d8a078', hair: { style: 'wavy', color: '#1e1612', shade: '#0f0a08' },
    jacket: '#3a3d42', jacketShade: '#26282c', shirt: '#6f737a', shirtIcon: null, extras: ['backpack']
  }
];

EG.data.helpers = {
  eco: { name: 'Профессор Эко', role: 'Научный наставник' },
  bait: { name: 'Байт', role: 'Робот-помощник' }
};
