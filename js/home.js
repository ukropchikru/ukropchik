/* Главная: быстрый расчёт ИМТ и превью сравнения продуктов */
(function () {
  const { esc } = window.UI;

  const form = document.getElementById('quick-bmi');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = parseFloat(form.height.value);
    const w = parseFloat(form.weight.value);
    form.height.classList.toggle('invalid', !(h >= 100 && h <= 250));
    form.weight.classList.toggle('invalid', !(w >= 25 && w <= 300));
    if (!(h >= 100 && h <= 250 && w >= 25 && w <= 300)) return;

    const bmi = w / (h / 100) ** 2;
    const cat = window.bmiCategory(bmi);
    document.getElementById('qb-value').textContent = bmi.toFixed(1).replace('.', ',');
    const note = document.getElementById('qb-note');
    note.textContent = cat.label;
    note.style.color = cat.color;
    document.getElementById('qb-result').classList.remove('hidden');
    DB.store.set('body', { ...DB.store.get('body', {}), height: h, weight: w });
  });

  const preview = document.getElementById('swap-preview');
  preview.innerHTML = window.SWAPS.slice(0, 6).map((s) => `
    <article class="swap reveal visible">
      <div class="swap-row swap-bad">
        <div class="swap-emoji" aria-hidden="true">${s.bad.emoji}</div>
        <div><div class="swap-label">Вместо</div><div class="swap-name">${esc(s.bad.name)}</div></div>
      </div>
      <div class="swap-arrow" aria-hidden="true">↓</div>
      <div class="swap-row swap-good">
        <div class="swap-emoji" aria-hidden="true">${s.good.emoji}</div>
        <div><div class="swap-label">Попробуйте</div><div class="swap-name">${esc(s.good.name)}</div></div>
      </div>
      <div class="swap-save">−${s.bad.kcal - s.good.kcal} ккал за порцию</div>
    </article>`).join('');
})();
