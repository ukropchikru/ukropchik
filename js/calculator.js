/* Калькулятор ИМТ / калорий и сравнение продуктов */
(function () {
  const { esc } = window.UI;
  const store = DB.store;

  /* ===================== Калькулятор ===================== */

  const form = document.getElementById('calc-form');
  const errorEl = form.querySelector('.form-error');
  const goalBox = document.getElementById('goal');
  let goal = 'maintain';

  const GOALS = {
    lose: { factor: 0.85, protein: 1.8, label: 'похудения' },
    maintain: { factor: 1, protein: 1.4, label: 'поддержания веса' },
    gain: { factor: 1.12, protein: 1.8, label: 'набора массы' },
  };

  function setGoal(value) {
    goal = value;
    goalBox.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.goal === value;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
    });
  }
  goalBox.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-goal]');
    if (btn) setGoal(btn.dataset.goal);
  });

  /* подставляем данные прошлого расчёта */
  const saved = store.get('body', {});
  ['sex', 'age', 'height', 'weight', 'activity'].forEach((key) => {
    if (saved[key] != null) form[key].value = saved[key];
  });
  if (saved.goal) setGoal(saved.goal);

  const RULES = {
    sex: (v) => v === 'male' || v === 'female',
    age: (v) => v >= 14 && v <= 100,
    height: (v) => v >= 100 && v <= 250,
    weight: (v) => v >= 25 && v <= 300,
    activity: (v) => v >= 1.2 && v <= 1.9,
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const values = {
      sex: form.sex.value,
      age: parseFloat(form.age.value),
      height: parseFloat(form.height.value),
      weight: parseFloat(form.weight.value),
      activity: parseFloat(form.activity.value),
    };
    let valid = true;
    for (const [key, check] of Object.entries(RULES)) {
      const ok = check(values[key]);
      form[key].classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    }
    if (!valid) {
      errorEl.textContent = 'Проверьте поля: возраст 14–100 лет, рост 100–250 см, вес 25–300 кг';
      return;
    }
    errorEl.textContent = '';
    store.set('body', { ...values, goal });
    const { bmi, kcal } = showResult(values);
    DB.calcs.add({ ...values, goal, bmi: +bmi.toFixed(1), kcal }).catch((err) => console.warn(err));
  });

  function showResult({ sex, age, height, weight, activity }, scroll = true) {
    const bmi = weight / (height / 100) ** 2;
    const cat = window.bmiCategory(bmi);
    const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
    const tdee = bmr * activity;
    const g = GOALS[goal];
    const kcal = Math.round((tdee * g.factor) / 10) * 10;
    const protein = Math.round(weight * g.protein);
    const fat = Math.round((kcal * 0.3) / 9);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    const waterL = Math.round(weight * 0.03 * 10) / 10;
    const glasses = Math.ceil((waterL * 1000) / 250);
    const minW = 18.5 * (height / 100) ** 2;
    const maxW = 24.9 * (height / 100) ** 2;

    document.getElementById('r-bmi').textContent = bmi.toFixed(1).replace('.', ',');
    const label = document.getElementById('r-bmi-label');
    label.textContent = cat.label;
    label.style.color = cat.color;
    document.getElementById('r-kcal').textContent = kcal.toLocaleString('ru-RU');
    document.getElementById('r-tdee').textContent = `Для ${g.label}. Поддержание: ${Math.round(tdee).toLocaleString('ru-RU')} ккал`;
    document.getElementById('r-water').textContent = waterL.toLocaleString('ru-RU');
    document.getElementById('r-glasses').textContent = `≈ ${glasses} стаканов по 250 мл`;
    document.getElementById('r-ideal').textContent =
      `Нормальный вес при вашем росте: ${minW.toFixed(0)}–${maxW.toFixed(0)} кг`;

    const result = document.getElementById('calc-result');
    result.classList.remove('hidden');

    /* шкала ИМТ: от 15 до 40 */
    const pos = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));
    const marker = document.getElementById('bmi-marker');
    marker.style.left = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => { marker.style.left = pos + '%'; }));

    const macros = [
      ['Белки', protein, '#3c8a3f', protein * 4],
      ['Жиры', fat, '#e8c33c', fat * 9],
      ['Углеводы', carbs, '#6aa9e9', carbs * 4],
    ];
    const bars = document.getElementById('macro-bars');
    bars.innerHTML = macros.map(([name, grams, color, kc]) => `
      <div class="macro-row">
        <span>${name}</span>
        <div class="macro-track"><div class="macro-fill" style="background:${color}" data-w="${(kc / kcal) * 100}"></div></div>
        <span>${grams} г</span>
      </div>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bars.querySelectorAll('.macro-fill').forEach((el) => { el.style.width = el.dataset.w + '%'; });
    }));

    document.getElementById('tips').innerHTML = buildTips(cat.key, goal, waterL).map((t) => `<li>${esc(t)}</li>`).join('');

    store.set('target', { kcal, goal, protein, fat, carbs });
    document.getElementById('to-diet').textContent = `Собрать рацион на ${kcal.toLocaleString('ru-RU')} ккал`;

    renderWater(glasses);
    if (scroll) result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return { bmi, kcal };
  }

  function buildTips(catKey, goalKey, waterL) {
    const tips = [];
    if (catKey === 'severe' || catKey === 'under') {
      tips.push('Ешьте 5–6 раз в день небольшими порциями — так проще получить достаточно энергии.');
      tips.push('Добавляйте полезные калорийные продукты: орехи, авокадо, цельнозерновые крупы, рыбу.');
      tips.push('Совмещайте питание с силовыми тренировками, чтобы набирать мышцы, а не жир.');
      if (catKey === 'severe') tips.push('При выраженном дефиците массы тела обязательно обратитесь к врачу.');
    } else if (catKey === 'normal') {
      tips.push('Ваш вес в норме — поддерживайте разнообразный рацион и регулярную активность.');
      tips.push('Заполняйте половину тарелки овощами, четверть — белком, четверть — сложными углеводами.');
    } else {
      tips.push('Создавайте умеренный дефицит калорий — 10–20% от нормы. Жёсткие диеты приводят к срывам.');
      tips.push('Начните с замены сладких напитков на воду — это самый простой способ снизить калорийность.');
      tips.push('Ешьте больше белка и овощей: они дольше насыщают при меньшей калорийности.');
      tips.push('Добавьте ежедневную ходьбу: 7–10 тысяч шагов заметно увеличивают расход энергии.');
      if (catKey === 'obese2' || catKey === 'obese3') tips.push('При ожирении II–III степени снижать вес лучше под наблюдением врача.');
    }
    if (goalKey === 'gain' && catKey !== 'severe' && catKey !== 'under') tips.push('Для набора мышечной массы получайте белок в каждом приёме пищи и не пропускайте тренировки.');
    if (goalKey === 'lose' && (catKey === 'under' || catKey === 'severe')) tips.push('Ваш ИМТ ниже нормы — снижать вес не рекомендуется. Попробуйте цель «Поддерживать вес».');
    tips.push(`Выпивайте около ${waterL.toLocaleString('ru-RU')} л воды в день, больше — в жару и при тренировках.`);
    return tips;
  }

  /* трекер воды на сегодня */
  function renderWater(total) {
    const today = new Date().toISOString().slice(0, 10);
    const log = store.get('water', {});
    let drunk = log.date === today ? log.count : 0;
    const box = document.getElementById('glasses');
    const count = document.getElementById('water-count');

    const draw = () => {
      box.innerHTML = Array.from({ length: total }, (_, i) =>
        `<button type="button" class="glass${i < drunk ? ' full' : ''}" data-i="${i}" aria-label="Стакан ${i + 1}"></button>`).join('');
      count.textContent = drunk >= total ? '🎉 Норма воды на сегодня выполнена!' : `${drunk} из ${total} стаканов`;
    };
    box.onclick = (e) => {
      const btn = e.target.closest('.glass');
      if (!btn) return;
      const i = Number(btn.dataset.i);
      drunk = i < drunk ? i : i + 1;
      store.set('water', { date: today, count: drunk });
      draw();
    };
    draw();
  }

  // пользователь уже считал — сразу показываем результат без прокрутки
  if (Object.entries(RULES).every(([key, check]) => check(saved[key]))) showResult(saved, false);

  /* ===================== Сравнение продуктов ===================== */

  const swaps = window.SWAPS;
  const select = document.getElementById('bad-select');
  const chips = document.getElementById('swap-chips');
  select.innerHTML = swaps.map((s) => `<option value="${s.id}">${s.bad.emoji} ${esc(s.bad.name)}</option>`).join('');
  chips.innerHTML = swaps.map((s) => `<button type="button" class="chip" data-id="${s.id}">${s.bad.emoji} ${esc(s.bad.name)}</button>`).join('');

  function showSwap(id) {
    const s = swaps.find((x) => x.id === id) || swaps[0];
    select.value = s.id;
    chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('active', c.dataset.id === s.id));
    document.getElementById('good-box').innerHTML = `<span style="font-size:1.5rem">${s.good.emoji}</span> ${esc(s.good.name)}`;
    document.getElementById('leg-bad').textContent = `${s.bad.name}, ${s.bad.portion}`;
    document.getElementById('leg-good').textContent = `${s.good.name}, ${s.good.portion}`;

    const chart = document.getElementById('compare-chart');
    chart.innerHTML = window.SWAP_METRICS.map((m) => {
      const a = s.bad[m.key];
      const b = s.good[m.key];
      const max = Math.max(a, b) || 1;
      const diff = b - a;
      const better = m.lessIsBetter ? diff < 0 : diff > 0;
      const diffText = diff === 0 ? 'без разницы'
        : `${diff > 0 ? '+' : '−'}${fmt(Math.abs(diff))} ${m.unit}`;
      return `
        <div>
          <div class="cmp-metric-head"><span>${m.label}</span><span class="diff" style="color:${diff === 0 ? 'var(--muted)' : better ? 'var(--green-700)' : 'var(--danger)'}">${diffText}</span></div>
          <div class="cmp-bar">
            <div class="cmp-line"><div class="cmp-track"><div class="cmp-fill bad" data-w="${(a / max) * 100}"></div></div><span>${fmt(a)} ${m.unit}</span></div>
            <div class="cmp-line"><div class="cmp-track"><div class="cmp-fill good" data-w="${(b / max) * 100}"></div></div><span>${fmt(b)} ${m.unit}</span></div>
          </div>
        </div>`;
    }).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chart.querySelectorAll('.cmp-fill').forEach((el) => { el.style.width = el.dataset.w + '%'; });
    }));

    const saveKcal = s.bad.kcal - s.good.kcal;
    const kg = (saveKcal * 365) / 7700;
    document.getElementById('cmp-year').textContent = `≈ ${kg.toFixed(1).replace('.', ',')} кг`;
    document.getElementById('cmp-week').textContent = `${(saveKcal * 7).toLocaleString('ru-RU')} ккал`;
    document.getElementById('cmp-tip').innerHTML = `<li>${esc(s.tip)}</li>`;
  }

  function fmt(n) {
    return Number.isInteger(n) ? n.toLocaleString('ru-RU') : n.toLocaleString('ru-RU', { maximumFractionDigits: 1 });
  }

  select.addEventListener('change', () => showSwap(select.value));
  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) showSwap(chip.dataset.id);
  });
  showSwap(swaps[0].id);
})();
