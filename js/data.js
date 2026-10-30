/* Справочные данные. Значения приблизительные, по открытым таблицам пищевой ценности. */

/* Продукты для конструктора рациона: ккал, белки, жиры, углеводы на 100 г; portion — порция по умолчанию, г */
window.FOODS = [
  { id: 'oat', cat: 'Каши и гарниры', name: 'Овсяная каша на воде', kcal: 88, p: 3, f: 1.7, c: 15, portion: 250 },
  { id: 'buck', cat: 'Каши и гарниры', name: 'Гречка отварная', kcal: 110, p: 4.2, f: 1.1, c: 21.3, portion: 150 },
  { id: 'rice', cat: 'Каши и гарниры', name: 'Рис бурый отварной', kcal: 111, p: 2.6, f: 0.9, c: 23, portion: 150 },
  { id: 'quinoa', cat: 'Каши и гарниры', name: 'Киноа отварная', kcal: 120, p: 4.4, f: 1.9, c: 21.3, portion: 150 },
  { id: 'pasta', cat: 'Каши и гарниры', name: 'Паста из твёрдых сортов', kcal: 140, p: 5, f: 1.1, c: 28, portion: 150 },
  { id: 'potato', cat: 'Каши и гарниры', name: 'Картофель запечённый', kcal: 93, p: 2.5, f: 0.1, c: 21, portion: 150 },
  { id: 'bread', cat: 'Каши и гарниры', name: 'Цельнозерновой хлеб', kcal: 247, p: 13, f: 3.4, c: 41, portion: 40 },

  { id: 'chicken', cat: 'Мясо, рыба, яйца', name: 'Куриная грудка запечённая', kcal: 165, p: 31, f: 3.6, c: 0, portion: 150 },
  { id: 'turkey', cat: 'Мясо, рыба, яйца', name: 'Индейка тушёная', kcal: 150, p: 29, f: 3, c: 0, portion: 150 },
  { id: 'beef', cat: 'Мясо, рыба, яйца', name: 'Говядина постная тушёная', kcal: 190, p: 27, f: 9, c: 0, portion: 120 },
  { id: 'salmon', cat: 'Мясо, рыба, яйца', name: 'Лосось запечённый', kcal: 206, p: 22, f: 13, c: 0, portion: 120 },
  { id: 'cod', cat: 'Мясо, рыба, яйца', name: 'Треска запечённая', kcal: 105, p: 23, f: 0.9, c: 0, portion: 150 },
  { id: 'egg', cat: 'Мясо, рыба, яйца', name: 'Яйца куриные (1 шт ≈ 55 г)', kcal: 155, p: 13, f: 11, c: 1.1, portion: 110 },

  { id: 'cottage', cat: 'Молочные', name: 'Творог 5%', kcal: 121, p: 17, f: 5, c: 1.8, portion: 150 },
  { id: 'yogurt', cat: 'Молочные', name: 'Греческий йогурт 2%', kcal: 73, p: 10, f: 2, c: 3.6, portion: 150 },
  { id: 'kefir', cat: 'Молочные', name: 'Кефир 1%', kcal: 40, p: 3, f: 1, c: 4, portion: 250 },
  { id: 'cheese', cat: 'Молочные', name: 'Сыр твёрдый', kcal: 350, p: 25, f: 27, c: 0, portion: 30 },
  { id: 'syrniki', cat: 'Молочные', name: 'Сырники запечённые', kcal: 200, p: 15, f: 8, c: 18, portion: 150 },

  { id: 'broccoli', cat: 'Овощи', name: 'Брокколи на пару', kcal: 35, p: 2.4, f: 0.4, c: 7, portion: 150 },
  { id: 'salad', cat: 'Овощи', name: 'Салат из свежих овощей', kcal: 25, p: 1.2, f: 0.2, c: 4.5, portion: 200 },
  { id: 'tomato', cat: 'Овощи', name: 'Помидоры', kcal: 18, p: 0.9, f: 0.2, c: 3.9, portion: 120 },
  { id: 'cucumber', cat: 'Овощи', name: 'Огурцы', kcal: 15, p: 0.7, f: 0.1, c: 3.6, portion: 150 },
  { id: 'vegstew', cat: 'Овощи', name: 'Овощное рагу', kcal: 60, p: 1.8, f: 2.5, c: 8, portion: 200 },
  { id: 'avocado', cat: 'Овощи', name: 'Авокадо', kcal: 160, p: 2, f: 15, c: 9, portion: 70 },

  { id: 'apple', cat: 'Фрукты и ягоды', name: 'Яблоко', kcal: 52, p: 0.3, f: 0.2, c: 14, portion: 150 },
  { id: 'banana', cat: 'Фрукты и ягоды', name: 'Банан', kcal: 89, p: 1.1, f: 0.3, c: 23, portion: 120 },
  { id: 'berries', cat: 'Фрукты и ягоды', name: 'Ягоды (смесь)', kcal: 50, p: 1, f: 0.4, c: 11, portion: 100 },
  { id: 'orange', cat: 'Фрукты и ягоды', name: 'Апельсин', kcal: 47, p: 0.9, f: 0.1, c: 12, portion: 150 },

  { id: 'walnut', cat: 'Орехи, масла, сладкое', name: 'Грецкие орехи', kcal: 654, p: 15, f: 65, c: 14, portion: 20 },
  { id: 'almond', cat: 'Орехи, масла, сладкое', name: 'Миндаль', kcal: 579, p: 21, f: 50, c: 22, portion: 20 },
  { id: 'oil', cat: 'Орехи, масла, сладкое', name: 'Оливковое масло', kcal: 884, p: 0, f: 100, c: 0, portion: 10 },
  { id: 'pbutter', cat: 'Орехи, масла, сладкое', name: 'Арахисовая паста', kcal: 588, p: 25, f: 50, c: 20, portion: 20 },
  { id: 'honey', cat: 'Орехи, масла, сладкое', name: 'Мёд', kcal: 304, p: 0.3, f: 0, c: 82, portion: 15 },
  { id: 'darkchoc', cat: 'Орехи, масла, сладкое', name: 'Горький шоколад 70%', kcal: 600, p: 8, f: 43, c: 46, portion: 20 },

  { id: 'borsch', cat: 'Готовые блюда', name: 'Борщ', kcal: 50, p: 2, f: 2, c: 6, portion: 300 },
  { id: 'lentil', cat: 'Готовые блюда', name: 'Чечевичный суп', kcal: 70, p: 4.5, f: 1.5, c: 10, portion: 300 },
  { id: 'hummus', cat: 'Готовые блюда', name: 'Хумус', kcal: 166, p: 8, f: 9.6, c: 14, portion: 60 },
  { id: 'tea', cat: 'Готовые блюда', name: 'Чай или кофе без сахара', kcal: 1, p: 0, f: 0, c: 0, portion: 250 },
];

/* Шаблоны для автоподбора меню: [id продукта, граммы] — затем масштабируются под норму калорий */
window.MEAL_TEMPLATES = {
  breakfast: [
    [['oat', 250], ['berries', 100], ['walnut', 15]],
    [['egg', 110], ['bread', 40], ['tomato', 120], ['tea', 250]],
    [['cottage', 150], ['banana', 120], ['honey', 10]],
    [['syrniki', 150], ['yogurt', 100], ['berries', 80]],
  ],
  lunch: [
    [['buck', 150], ['chicken', 150], ['salad', 200], ['oil', 10]],
    [['borsch', 300], ['bread', 40], ['turkey', 100]],
    [['quinoa', 150], ['salmon', 120], ['broccoli', 150]],
    [['rice', 150], ['beef', 120], ['vegstew', 200]],
    [['lentil', 300], ['bread', 40], ['salad', 150]],
  ],
  dinner: [
    [['cod', 150], ['broccoli', 200], ['oil', 10]],
    [['turkey', 150], ['vegstew', 200]],
    [['egg', 110], ['salad', 200], ['avocado', 50]],
    [['salmon', 120], ['potato', 150], ['cucumber', 150]],
  ],
  snack: [
    [['yogurt', 150], ['berries', 80]],
    [['apple', 150], ['almond', 20]],
    [['kefir', 250], ['banana', 120]],
    [['hummus', 60], ['cucumber', 150], ['bread', 30]],
  ],
};

/* Пары «вредный продукт → полезная альтернатива», значения на порцию */
window.SWAPS = [
  {
    id: 'cola',
    bad: { emoji: '🥤', name: 'Сладкая газировка', portion: '0,33 л', kcal: 139, sugar: 35, fat: 0, salt: 0.03, fiber: 0 },
    good: { emoji: '🍋', name: 'Вода с лимоном и мятой', portion: '0,33 л', kcal: 5, sugar: 1, fat: 0, salt: 0, fiber: 0 },
    tip: 'В одной банке газировки — около 9 чайных ложек сахара. Это почти вся дневная норма добавленного сахара по рекомендации ВОЗ.',
  },
  {
    id: 'fries',
    bad: { emoji: '🍟', name: 'Картофель фри', portion: '120 г', kcal: 365, sugar: 0.3, fat: 17, salt: 0.6, fiber: 3.8 },
    good: { emoji: '🥔', name: 'Запечённый картофель с травами', portion: '150 г', kcal: 140, sugar: 1.2, fat: 3, salt: 0.2, fiber: 3.3 },
    tip: 'Запекание вместо фритюра убирает лишний жир, а хрустящую корочку даёт духовка с ложкой масла.',
  },
  {
    id: 'chips',
    bad: { emoji: '🥔', name: 'Чипсы', portion: '50 г', kcal: 270, sugar: 0.5, fat: 17, salt: 0.8, fiber: 2 },
    good: { emoji: '🫘', name: 'Запечённый нут со специями', portion: '50 г', kcal: 180, sugar: 2, fat: 4, salt: 0.3, fiber: 6 },
    tip: 'Нут хрустит не хуже чипсов, но содержит растительный белок и клетчатку, поэтому дольше насыщает.',
  },
  {
    id: 'choc',
    bad: { emoji: '🍫', name: 'Молочный шоколад', portion: '50 г', kcal: 270, sugar: 26, fat: 15, salt: 0.1, fiber: 1 },
    good: { emoji: '🍫', name: 'Горький шоколад 70%', portion: '25 г', kcal: 150, sugar: 6, fat: 10, salt: 0, fiber: 2.7 },
    tip: 'Горький шоколад насыщеннее по вкусу — хватает меньшей порции, а сахара в нём в несколько раз меньше.',
  },
  {
    id: 'yogurt',
    bad: { emoji: '🍓', name: 'Сладкий йогурт с наполнителем', portion: '150 г', kcal: 150, sugar: 20, fat: 4, salt: 0.1, fiber: 0 },
    good: { emoji: '🫐', name: 'Греческий йогурт с ягодами', portion: '150 г', kcal: 110, sugar: 7, fat: 3, salt: 0.1, fiber: 1.5 },
    tip: 'Добавляйте в натуральный йогурт свежие или замороженные ягоды — сладость без добавленного сахара.',
  },
  {
    id: 'sausage',
    bad: { emoji: '🌭', name: 'Сосиски', portion: '100 г', kcal: 270, sugar: 1, fat: 24, salt: 2, fiber: 0 },
    good: { emoji: '🍗', name: 'Запечённая куриная грудка', portion: '100 г', kcal: 165, sugar: 0, fat: 3.6, salt: 0.2, fiber: 0 },
    tip: 'В переработанном мясе много соли и насыщенных жиров. Запеките грудку заранее — её удобно брать с собой.',
  },
  {
    id: 'mayo',
    bad: { emoji: '🥫', name: 'Майонез', portion: '30 г', kcal: 190, sugar: 0.4, fat: 20, salt: 0.4, fiber: 0 },
    good: { emoji: '🥣', name: 'Йогурт с зеленью и чесноком', portion: '30 г', kcal: 22, sugar: 1, fat: 0.6, salt: 0.1, fiber: 0.2 },
    tip: 'Соус на основе йогурта отлично подходит для салатов и шаурмы — в нём почти в 9 раз меньше калорий.',
  },
  {
    id: 'donut',
    bad: { emoji: '🍩', name: 'Пончик в глазури', portion: '75 г', kcal: 300, sugar: 15, fat: 17, salt: 0.4, fiber: 1 },
    good: { emoji: '🍌', name: 'Банан с горстью орехов', portion: '140 г', kcal: 220, sugar: 14, fat: 13, salt: 0, fiber: 4 },
    tip: 'Перекус из фрукта и орехов даёт энергию постепенно, без резкого скачка сахара в крови.',
  },
  {
    id: 'juice',
    bad: { emoji: '🧃', name: 'Пакетированный сок', portion: '250 мл', kcal: 115, sugar: 25, fat: 0, salt: 0, fiber: 0 },
    good: { emoji: '🍊', name: 'Апельсин целиком', portion: '150 г', kcal: 70, sugar: 13, fat: 0.2, salt: 0, fiber: 3.6 },
    tip: 'В целом фрукте сохраняется клетчатка, которая замедляет усвоение сахара и даёт чувство сытости.',
  },
  {
    id: 'noodles',
    bad: { emoji: '🍜', name: 'Лапша быстрого приготовления', portion: '75 г', kcal: 340, sugar: 2, fat: 14, salt: 4, fiber: 2 },
    good: { emoji: '🍲', name: 'Гречка с овощами', portion: '250 г', kcal: 230, sugar: 3, fat: 5, salt: 0.5, fiber: 6 },
    tip: 'В пачке «быстрой» лапши — до 4 г соли, это почти вся суточная норма. Гречку можно сварить заранее на 2–3 дня.',
  },
];

window.SWAP_METRICS = [
  { key: 'kcal', label: 'Калории', unit: 'ккал', lessIsBetter: true },
  { key: 'sugar', label: 'Сахар', unit: 'г', lessIsBetter: true },
  { key: 'fat', label: 'Жиры', unit: 'г', lessIsBetter: true },
  { key: 'salt', label: 'Соль', unit: 'г', lessIsBetter: true },
  { key: 'fiber', label: 'Клетчатка', unit: 'г', lessIsBetter: false },
];

/* Категории ИМТ по классификации ВОЗ */
window.BMI_CATEGORIES = [
  { max: 16, key: 'severe', label: 'Выраженный дефицит массы тела', color: '#3d7fc4' },
  { max: 18.5, key: 'under', label: 'Недостаточная масса тела', color: '#3d7fc4' },
  { max: 25, key: 'normal', label: 'Нормальная масса тела', color: '#3c8a3f' },
  { max: 30, key: 'over', label: 'Избыточная масса тела', color: '#b98a00' },
  { max: 35, key: 'obese1', label: 'Ожирение I степени', color: '#d9701f' },
  { max: 40, key: 'obese2', label: 'Ожирение II степени', color: '#d9483b' },
  { max: Infinity, key: 'obese3', label: 'Ожирение III степени', color: '#b5281c' },
];

window.bmiCategory = function (bmi) {
  return window.BMI_CATEGORIES.find((c) => bmi < c.max);
};

/* Свойства продуктов для фильтров рецептов */
window.FOOD_FLAGS = {
  meat: ['chicken', 'turkey', 'beef', 'salmon', 'cod', 'borsch'],
  gluten: ['bread', 'pasta', 'oat', 'syrniki'],
  dairy: ['cottage', 'yogurt', 'kefir', 'cheese', 'syrniki'],
  animal: ['chicken', 'turkey', 'beef', 'salmon', 'cod', 'borsch', 'egg', 'cottage', 'yogurt', 'kefir', 'cheese', 'syrniki', 'honey'],
};

/*
 * Как превратить готовое блюдо в покупку: [что купить, коэффициент к весу готового].
 * Например, из 100 г сухой гречки получается ~250 г отварной → коэффициент 0,4.
 * null — не включать в список покупок.
 */
window.FOOD_BUY = {
  oat: ['Овсяные хлопья', 0.2],
  buck: ['Гречневая крупа', 0.4],
  rice: ['Рис бурый', 0.4],
  quinoa: ['Киноа', 0.4],
  pasta: ['Паста из твёрдых сортов', 0.45],
  potato: ['Картофель', 1.1],
  chicken: ['Куриное филе', 1.3],
  turkey: ['Филе индейки', 1.3],
  beef: ['Говядина постная', 1.4],
  salmon: ['Лосось (филе)', 1.2],
  cod: ['Треска (филе)', 1.2],
  syrniki: ['Творог 5% (для сырников)', 0.85],
  salad: ['Свежие овощи для салата', 1],
  vegstew: ['Овощи для рагу (кабачок, перец, морковь)', 1.1],
  borsch: ['Овощи для борща (свёкла, капуста, морковь)', 0.5],
  lentil: ['Красная чечевица', 0.2],
  tea: null,
};

window.MEAL_NAMES = { breakfast: 'Завтрак', lunch: 'Обед', dinner: 'Ужин', snack: 'Перекус' };
