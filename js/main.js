// Точка входа.
(function () {
  var S = EG.state;
  S.load();

  setInterval(function () {
    if (!document.querySelector('.game')) return;
    var changed = S.tickEnergy();
    var growing = S.s.placed.some(function (p) { var it = EG.shop.item(p.item); return it && it.grows && Date.now() - p.t < 62000; });
    if (changed) S.save();
    if (changed || growing) EG.ui.refresh();
  }, 5000);

  document.addEventListener('visibilitychange', function () { if (document.hidden) S.save(); });
  // Запрет системного зума двойным касанием на iOS
  document.addEventListener('dblclick', function (e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

  S.tickEnergy();
  EG.ui.showStart();
})();
