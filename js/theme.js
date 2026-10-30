/* Подключается в <head> без defer, чтобы тема применилась до отрисовки и не было «вспышки» */
(function () {
  try {
    const theme = JSON.parse(localStorage.getItem('ukr_theme'));
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch { /* хранилище недоступно */ }
})();
