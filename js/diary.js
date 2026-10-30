/* Дневник питания: записи по дням, сравнение с нормой, график за неделю */
(function () {
  const { esc, toast, userReady } = window.UI;
  const { MEALS, DAYS, FOOD, getDraft, isoDate, weekdayIndex, diaryEntry } = window.PLAN;

  const dateInput = document.getElementById('date');
  const mealsEl = document.getElementById('meals');
  let date = isoDate();
  let entries = [];

  const target = DB.store.get('target') || {};
  const kcalTarget = target.kcal || 2000;
  const macroTarget = {
    protein: target.protein || Math.round((kcalTarget * 0.2) / 4),
    fat: target.fat || Math.round((kcalTarget * 0.3) / 9),
    carbs: target.carbs || Math.round((kcalTarget * 0.5) / 4),
  };

  const parse = (iso) => new Date(iso + 'T12:00:00');
  const shift = (iso, days) => { const d = parse(iso); d.setDate(d.getDate() + days); return isoDate(d); };

  const foodOptions = (() => {
    const groups = {};
    window.FOODS.forEach((f) => { (groups[f.cat] = groups[f.cat] || []).push(f); });
    return '<option value="" disabled selected>Выберите продукт</option>' + Object.entries(groups).map(([cat, list]) =>
      `<optgroup label="${esc(cat)}">${list.map((f) => `<option value="${f.id}">${esc(f.name)} — ${f.kcal} ккал/100 г</option>`).join('')}</optgroup>`
    ).join('');
  })();

  async function load() {
    dateInput.value = date;
    const today = isoDate();
    document.getElementById('sum-title').textContent = date === today ? 'Итог за сегодня'
      : `Итог за ${parse(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
    try {
      entries = await DB.diary.list(date);
    } catch (err) {
      mealsEl.innerHTML = `<p class="form-error">${esc(err.message)}</p>`;
      return;
    }
    render();
    renderWeek();
  }

  function render() {
    mealsEl.innerHTML = MEALS.map(([key, title]) => {
      const items = entries.filter((e) => e.meal === key);
      const kcal = items.reduce((s, e) => s + Number(e.kcal), 0);
      return `
        <section class="card meal">
          <div class="meal-head"><h3>${title}</h3><span class="meal-kcal">${Math.round(kcal)} ккал</span></div>
          ${items.length ? `<ul class="meal-items">${items.map((e) => `
            <li class="meal-item">
              <span class="name">${esc(e.name)}</span>
              <span class="grams small muted" style="text-align:right">${Number(e.grams)} г</span>
              <span class="kcal">${Math.round(e.kcal)} ккал</span>
              <button class="icon-btn" type="button" data-del="${e.id}" aria-label="Удалить">✕</button>
            </li>`).join('')}</ul>` : '<p class="meal-empty">Ничего не записано</p>'}
          <form class="meal-add" data-meal="${key}" novalidate>
            <select class="select" name="food" aria-label="Продукт: ${title}">${foodOptions}</select>
            <input class="input" name="grams" type="number" min="1" max="5000" step="5" placeholder="г" aria-label="Граммы">
            <button class="btn btn-lime" type="submit">Добавить</button>
          </form>
          <button class="link-btn" type="button" data-custom="${key}" style="margin-top:10px">+ Свой продукт (например, отсканированный)</button>
          <form class="custom-food hidden" data-custom-form="${key}" novalidate>
            <input class="input wide" name="name" maxlength="200" placeholder="Название" aria-label="Название">
            <input class="input" name="grams" type="number" min="1" placeholder="Граммы" aria-label="Граммы">
            <input class="input" name="kcal" type="number" min="0" placeholder="Ккал/100 г" aria-label="Ккал на 100 г">
            <input class="input" name="p" type="number" min="0" step="0.1" placeholder="Белки/100 г" aria-label="Белки на 100 г">
            <input class="input" name="f" type="number" min="0" step="0.1" placeholder="Жиры/100 г" aria-label="Жиры на 100 г">
            <input class="input" name="c" type="number" min="0" step="0.1" placeholder="Углев./100 г" aria-label="Углеводы на 100 г">
            <button class="btn btn-primary btn-sm" type="submit">Записать</button>
          </form>
        </section>`;
    }).join('');
    renderSummary();
  }

  function renderSummary() {
    const sum = entries.reduce((s, e) => ({
      kcal: s.kcal + Number(e.kcal), protein: s.protein + Number(e.protein),
      fat: s.fat + Number(e.fat), carbs: s.carbs + Number(e.carbs),
    }), { kcal: 0, protein: 0, fat: 0, carbs: 0 });

    document.getElementById('sum-kcal').textContent = Math.round(sum.kcal).toLocaleString('ru-RU');
    document.getElementById('sum-target').textContent = kcalTarget.toLocaleString('ru-RU');
    const ratio = sum.kcal / kcalTarget;
    const bar = document.getElementById('sum-progress');
    bar.firstElementChild.style.width = Math.min(100, ratio * 100) + '%';
    bar.classList.toggle('over', ratio > 1.1);
    const left = Math.round(kcalTarget - sum.kcal);
    document.getElementById('sum-hint').textContent = !sum.kcal ? 'Добавьте первый приём пищи.'
      : Math.abs(left) <= kcalTarget * 0.05 ? '👍 Норма выполнена.'
        : left > 0 ? `Осталось ~${left} ккал.` : `Превышение нормы на ${-left} ккал.`;

    document.getElementById('macros').innerHTML = [
      ['Белки', 'protein', '#3c8a3f'], ['Жиры', 'fat', '#e8c33c'], ['Углеводы', 'carbs', '#6aa9e9'],
    ].map(([label, key, color]) => `
      <div class="macro-row">
        <span>${label}</span>
        <div class="macro-track"><div class="macro-fill" style="background:${color};width:${Math.min(100, (sum[key] / macroTarget[key]) * 100)}%"></div></div>
        <span>${Math.round(sum[key])}/${macroTarget[key]} г</span>
      </div>`).join('');
  }

  async function renderWeek() {
    const from = shift(date, -6);
    let rows = [];
    try {
      rows = await DB.diary.list(from, date);
    } catch {
      return;
    }
    const days = Array.from({ length: 7 }, (_, i) => shift(from, i));
    const kcals = days.map((d) => rows.filter((r) => r.date === d).reduce((s, r) => s + Number(r.kcal), 0));
    const max = Math.max(kcalTarget * 1.25, ...kcals);
    document.getElementById('week-chart').innerHTML =
      `<div class="target-line" style="bottom:${22 + (kcalTarget / max) * 130}px" title="Норма"></div>` +
      days.map((d, i) => `
        <div class="week-col${d === date ? ' active' : ''}" data-date="${d}" title="${parse(d).toLocaleDateString('ru-RU')}: ${Math.round(kcals[i])} ккал">
          <div style="height:${(kcals[i] / max) * 130}px"></div><span>${DAYS[weekdayIndex(parse(d))]}</span>
        </div>`).join('');
  }

  async function add(list) {
    try {
      await DB.diary.add(list);
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function copyFromPlan() {
    const draft = getDraft();
    const day = draft.days[draft.mode === 'week' ? weekdayIndex(parse(date)) : 0];
    const list = [];
    MEALS.forEach(([key]) => day[key].forEach((it) => { if (FOOD[it.id]) list.push(diaryEntry(it.id, it.g, key, date)); }));
    if (!list.length) {
      toast('В конструкторе рациона на этот день пока пусто', 'error');
      return;
    }
    await add(list);
    toast(`Перенесено продуктов: ${list.length}`);
  }

  /* ---------- события ---------- */

  mealsEl.addEventListener('change', (e) => {
    if (e.target.matches('.meal-add select')) {
      const f = FOOD[e.target.value];
      e.target.form.grams.value = f ? f.portion : '';
    }
  });

  mealsEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    if (form.matches('.meal-add')) {
      const id = form.food.value;
      const g = Number(form.grams.value) || (FOOD[id] && FOOD[id].portion);
      if (!FOOD[id]) { form.food.classList.add('invalid'); return; }
      if (!(g > 0 && g <= 5000)) { form.grams.classList.add('invalid'); return; }
      add(diaryEntry(id, g, form.dataset.meal, date));
    } else if (form.matches('.custom-food')) {
      const v = Object.fromEntries([...new FormData(form)].map(([k, x]) => [k, k === 'name' ? x.trim() : Number(x)]));
      if (!v.name || !(v.grams > 0) || !(v.kcal >= 0) || form.kcal.value === '') {
        toast('Укажите название, граммы и калорийность', 'error');
        return;
      }
      const k = v.grams / 100;
      add({
        date, meal: form.dataset.customForm, name: v.name, grams: v.grams,
        kcal: Math.round(v.kcal * k), protein: +((v.p || 0) * k).toFixed(1),
        fat: +((v.f || 0) * k).toFixed(1), carbs: +((v.c || 0) * k).toFixed(1),
      });
    }
  });

  mealsEl.addEventListener('click', async (e) => {
    const del = e.target.closest('[data-del]');
    const custom = e.target.closest('[data-custom]');
    if (del) {
      try {
        await DB.diary.remove(del.dataset.del);
        await load();
      } catch (err) {
        toast(err.message, 'error');
      }
    }
    if (custom) mealsEl.querySelector(`[data-custom-form="${custom.dataset.custom}"]`).classList.toggle('hidden');
  });

  document.getElementById('week-chart').addEventListener('click', (e) => {
    const col = e.target.closest('.week-col');
    if (col) { date = col.dataset.date; load(); }
  });
  dateInput.addEventListener('change', () => { if (dateInput.value) { date = dateInput.value; load(); } });
  document.getElementById('prev-day').addEventListener('click', () => { date = shift(date, -1); load(); });
  document.getElementById('next-day').addEventListener('click', () => { date = shift(date, 1); load(); });
  document.getElementById('today').addEventListener('click', () => { date = isoDate(); load(); });
  document.getElementById('from-plan').addEventListener('click', copyFromPlan);

  userReady.then(async (user) => {
    if (!user) {
      const note = document.getElementById('guest-note');
      note.innerHTML = 'Записи сохраняются только в этом браузере. <a href="login.html">Войдите</a>, чтобы дневник был доступен с любого устройства.';
      note.classList.remove('hidden');
    }
    await load();
    if (location.hash === '#from-plan' && confirm('Перенести меню из конструктора рациона в дневник за сегодня?')) copyFromPlan();
  });
})();
