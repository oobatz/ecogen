// Главная карта города: отрисовка, панорамирование, нажатия на объекты.
(function () {
  var S = EG.state, A = EG.art, W = EG.data.world;
  var M = { cam: { x: W.camera.x, y: W.camera.y, s: 0.6 }, placing: null, el: null, world: null };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function mix(c1, c2, t) {
    var a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
    var r = Math.round(lerp(a >> 16, b >> 16, t)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t)), bl = Math.round(lerp(a & 255, b & 255, t));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  }
  function bld(id) { return W.buildings.filter(function (b) { return b.id === id; })[0]; }
  function unlockedB(b) { return !b.unlockLevel || S.s.level >= b.unlockLevel; }
  M.bld = bld;

  // Где стоит указатель для текущей задачи
  M.targetPos = function () {
    var t = EG.quests.task();
    if (!t) return null;
    function b(id) { var x = bld(id); return { x: x.x + x.w / 2, y: x.y - 170 }; }
    switch (t.type) {
      case 'dialog': return { x: W.helpersPos.x, y: W.helpersPos.y - 120 };
      case 'tap':
        if (t.target === 'viewpoint') return { x: W.viewpoint.x, y: W.viewpoint.y - 70 };
        if (t.target === 'organicHint') { var o = S.remainingPiles('organic')[0]; return o ? { x: o.x, y: o.y - 50 } : null; }
        if (t.target === 'shopBrowse') return b('shop');
        if (t.target.indexOf('district:') === 0) { var d = W.districts.filter(function (x) { return x.id === t.target.slice(9); })[0]; return { x: d.x + d.w / 2, y: d.y + d.h / 2 - 40 }; }
        return b(t.target);
      case 'research': return b('lab');
      case 'deliver': return b('lab');
      case 'minigame':
        if (t.game === 'biogas') return b('biogas');
        if (t.game === 'grid') return b('storage');
        if (t.game === 'sorting' && S.s.level >= 7) return b('station');
        return b('lab');
      case 'buy': return b('shop');
      case 'place': return b('shop');
      case 'restore':
        var h = W.buildings.filter(function (x) { return x.house && !S.s.restored[x.id]; })[0];
        return h ? { x: h.x + h.w / 2, y: h.y - 150 } : null;
      case 'collect': case 'clearAll':
        var p = S.remainingPiles(t.kind && t.kind !== 'any' ? t.kind : null)[0];
        return p ? { x: p.x, y: p.y - 50 } : null;
      case 'earn': return b(t.res === 'science' ? 'station' : 'station');
    }
    return null;
  };

  function hit(act, id, inner, cls) {
    return '<g class="hit ' + (cls || '') + '" data-act="' + act + '" data-id="' + (id || '') + '">' + inner + '</g>';
  }

  function renderDistrict(d) {
    var open = S.s.level >= d.unlockLevel, s = '';
    var label = '<text x="' + (d.x + 24) + '" y="' + (d.y + 40) + '" class="dname">' + d.name + '</text>';
    if (d.id === 'start') return '';
    if (!open) {
      s += '<rect x="' + d.x + '" y="' + d.y + '" width="' + d.w + '" height="' + d.h + '" rx="34" fill="#b3aa97"/>';
      // силуэты заброшенных построек под дымкой
      for (var i = 0; i < 4; i++) {
        var bx = d.x + 120 + i * 200, by = d.y + d.h * 0.62 + (i % 2) * 40;
        s += '<rect x="' + bx + '" y="' + (by - 90) + '" width="120" height="90" fill="#9c9483"/><path d="M' + (bx - 8) + ' ' + (by - 88) + ' l68 -40 l68 40z" fill="#8f8776"/>';
      }
      s += '<rect x="' + d.x + '" y="' + d.y + '" width="' + d.w + '" height="' + d.h + '" rx="34" fill="url(#fog)"/>';
      s += A.lockBadge(d.x + d.w / 2, d.y + d.h / 2 - 20, d.unlockLevel);
      return hit('district', d.id, s + label, 'district');
    }
    // Открыт, но задания района ещё не реализованы (Глава II+)
    s += '<rect x="' + d.x + '" y="' + d.y + '" width="' + d.w + '" height="' + d.h + '" rx="34" fill="#bdb393"/>';
    for (var j = 0; j < 4; j++) {
      var hx = d.x + 110 + j * 210, hy = d.y + d.h - 90;
      s += '<g filter="url(#fGray)">' + A.house('house' + (j % 3 + 1), hx, hy, 130, false) + '</g>';
    }
    s += A.pile({ x: d.x + 200, y: d.y + d.h - 40, kind: 'mixed' }) + A.pile({ x: d.x + 640, y: d.y + d.h - 30, kind: 'organic' });
    s += '<rect x="' + (d.x + d.w / 2 - 210) + '" y="' + (d.y + 70) + '" width="420" height="44" rx="22" fill="#fff" opacity=".9"/>' +
         '<text x="' + (d.x + d.w / 2) + '" y="' + (d.y + 99) + '" class="dnote">Задания района — в следующей версии</text>';
    return hit('district', d.id, s + label, 'district open');
  }

  function renderStart() {
    var d = W.districts[0], c = S.cleanliness(), s = '';
    var ground = mix('#c4b38e', '#8fd06a', c);
    s += '<rect x="' + d.x + '" y="' + d.y + '" width="' + d.w + '" height="' + d.h + '" rx="34" fill="' + ground + '"/>';
    // пятна грязи исчезают по мере очистки
    if (c < 0.9) {
      var op = (0.9 - c).toFixed(2);
      s += '<g opacity="' + op + '"><ellipse cx="200" cy="1080" rx="120" ry="30" fill="#8a7a5a"/><ellipse cx="700" cy="1110" rx="140" ry="26" fill="#8a7a5a"/><ellipse cx="560" cy="870" rx="90" ry="18" fill="#8a7a5a"/></g>';
    }
    // дорога
    s += '<rect x="' + d.x + '" y="' + W.road.y1 + '" width="' + d.w + '" height="' + (W.road.y2 - W.road.y1) + '" fill="' + mix('#77736a', '#5f6b70', c) + '"/>';
    s += '<line x1="' + (d.x + 20) + '" y1="' + ((W.road.y1 + W.road.y2) / 2) + '" x2="' + (d.x + d.w - 20) + '" y2="' + ((W.road.y1 + W.road.y2) / 2) + '" stroke="#f5f5f0" stroke-width="4" stroke-dasharray="26 22" opacity="' + (0.4 + c * 0.6).toFixed(2) + '"/>';

    var items = [];
    function add(y, svg) { items.push({ y: y, svg: svg }); }

    // фабрика
    add(800, A.factory(905, 800, 0.9 * (1 - c)));
    add(1110, A.deadTree(985, 1110, c >= 0.5));

    W.buildings.forEach(function (b) {
      var open = unlockedB(b), g;
      if (b.house) {
        var r = !!S.s.restored[b.id];
        g = r ? A.house(b.id, b.x, b.y, b.w, true) : '<g filter="url(#fGray)">' + A.house(b.id, b.x, b.y, b.w, false) + '</g>';
      } else {
        var art = b.id === 'lab' ? A.lab(b.x, b.y, b.w) : b.id === 'shop' ? A.shop(b.x, b.y, b.w) : b.id === 'station' ? A.station(b.x, b.y, b.w)
          : b.id === 'biogas' ? A.biogas(b.x, b.y, b.w, S.producing()) : A.storage(b.x, b.y, b.w, S.s.energy / S.energyCap());
        g = open ? art : '<g filter="url(#fGray)" opacity=".85">' + art + '</g>' + A.lockBadge(b.x + b.w / 2, b.y - 90, b.unlockLevel);
      }
      g += '<rect x="' + (b.x - 6) + '" y="' + (b.y - 170) + '" width="' + (b.w + 12) + '" height="176" fill="transparent"/>';
      add(b.y, hit('building', b.id, g, open ? '' : 'locked'));
    });

    W.piles.forEach(function (p) {
      if (S.pileGone(p.id)) return;
      add(p.y, hit('pile', p.id, A.pile(p) + '<circle cx="' + p.x + '" cy="' + (p.y - 14) + '" r="42" fill="transparent"/>', 'pile'));
    });

    var now = Date.now();
    S.s.placed.forEach(function (pl) {
      var slot = W.slots.filter(function (x) { return x.id === pl.slot; })[0];
      if (!slot) return;
      var it = EG.shop.item(pl.item) || {};
      var age = it.grows ? Math.min(1, (now - pl.t) / 60000) : 1;
      add(slot.y, '<g class="placed' + (now - pl.t < 1500 ? ' pop' : '') + '" style="transform-origin:' + slot.x + 'px ' + slot.y + 'px">' + A.item(pl.item, slot.x, slot.y, age) + '</g>');
    });

    // профессор и Байт
    var hp = W.helpersPos;
    add(hp.y, hit('helpers', '', '<svg x="' + (hp.x - 48) + '" y="' + (hp.y - 104) + '" width="90" height="100" viewBox="0 0 200 220">' + A.professorInner() + '</svg>' +
      '<svg x="' + (hp.x + 18) + '" y="' + (hp.y - 70) + '" width="60" height="66" viewBox="0 0 200 220">' + A.baitInner() + '</svg>'));

    // точка обзора (ур. 1)
    var t = EG.quests.task();
    if (t && t.type === 'tap' && t.target === 'viewpoint') {
      var v = W.viewpoint;
      add(v.y, hit('viewpoint', '', '<circle cx="' + v.x + '" cy="' + (v.y - 20) + '" r="30" fill="#fff" stroke="#2b3a33" stroke-width="3"/>' +
        '<circle cx="' + (v.x - 9) + '" cy="' + (v.y - 20) + '" r="8" fill="#4aa8e8" stroke="#2b3a33" stroke-width="2.5"/><circle cx="' + (v.x + 9) + '" cy="' + (v.y - 20) + '" r="8" fill="#4aa8e8" stroke="#2b3a33" stroke-width="2.5"/>'));
    }

    // места для размещения
    if (M.placing) {
      var it2 = EG.shop.item(M.placing);
      W.slots.forEach(function (sl) {
        if (S.slotItem(sl.id) || sl.size !== it2.size) return;
        add(sl.y + 1, hit('slot', sl.id, '<ellipse class="slot-glow" cx="' + sl.x + '" cy="' + (sl.y - 6) + '" rx="' + (sl.size === 'L' ? 62 : 30) + '" ry="' + (sl.size === 'L' ? 22 : 13) + '"/>' +
          '<text x="' + sl.x + '" y="' + (sl.y + 2) + '" class="slot-plus">+</text>'));
      });
    }

    items.sort(function (a, b) { return a.y - b.y; });
    items.forEach(function (i) { s += i.svg; });
    s += '<text x="' + (d.x + 24) + '" y="' + (d.y + 40) + '" class="dname">' + d.name + '</text>';
    return s;
  }

  M.render = function () {
    if (!M.world) return;
    var s = '<defs>' +
      '<filter id="fGray"><feColorMatrix type="saturate" values="0.12"/><feComponentTransfer><feFuncR type="linear" slope=".85"/><feFuncG type="linear" slope=".85"/><feFuncB type="linear" slope=".85"/></feComponentTransfer></filter>' +
      '<pattern id="fog" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#e9e6df" opacity=".55"/><path d="M0 40 L40 0" stroke="#fff" stroke-opacity=".35" stroke-width="6"/></pattern>' +
      '</defs>';
    s += '<rect width="' + W.width + '" height="' + W.height + '" fill="#7d7a72"/>';
    s += '<path d="M0 ' + (W.height / 2 - 10) + ' H' + W.width + ' M' + (W.width / 3) + ' 0 V' + W.height + ' M' + (W.width * 2 / 3) + ' 0 V' + W.height + '" stroke="#e8e4da" stroke-width="3" stroke-dasharray="20 20" opacity=".5"/>';
    W.districts.forEach(function (d) { s += renderDistrict(d); });
    s += renderStart();
    var tp = M.placing ? null : M.targetPos();
    if (tp) s += '<g class="pointer" style="transform-origin:' + tp.x + 'px ' + tp.y + 'px"><path d="M' + (tp.x - 22) + ' ' + (tp.y - 46) + ' h44 v20 h18 l-40 36 l-40 -36 h18z" fill="#ffd23f" stroke="#2b3a33" stroke-width="4" stroke-linejoin="round"/></g>';
    M.world.innerHTML = s;
  };

  // ───────── камера ─────────
  function viewport() { return { w: M.el.clientWidth, h: M.el.clientHeight }; }
  M.fitScale = function () {
    var v = viewport();
    return Math.max(0.35, Math.min(v.w / 1080, v.h / 700));
  };
  function clamp() {
    var v = viewport(), c = M.cam;
    var hw = v.w / 2 / c.s, hh = v.h / 2 / c.s;
    c.x = Math.max(Math.min(hw, W.width / 2), Math.min(W.width - Math.min(hw, W.width / 2), c.x));
    c.y = Math.max(Math.min(hh, W.height / 2), Math.min(W.height - Math.min(hh, W.height / 2), c.y));
  }
  M.apply = function (smooth) {
    clamp();
    var v = viewport(), c = M.cam;
    var tx = v.w / 2 - c.x * c.s, ty = v.h / 2 - c.y * c.s;
    M.world.style.transition = smooth ? 'transform .45s ease' : 'none';
    M.world.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + c.s + ')';
  };
  M.focus = function (x, y) { M.cam.x = x; M.cam.y = y; M.apply(true); };
  M.focusTarget = function () { var p = M.targetPos(); if (p) M.focus(p.x, p.y + 100); };

  M.init = function (el) {
    M.el = el;
    el.innerHTML = '<svg class="world" xmlns="http://www.w3.org/2000/svg" width="' + W.width + '" height="' + W.height + '" viewBox="0 0 ' + W.width + ' ' + W.height + '"></svg>';
    M.world = el.firstChild;
    M.cam.s = M.fitScale();
    var pts = {}, drag = null, moved = false, pinch = null;

    el.addEventListener('pointerdown', function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 1) { drag = { x: e.clientX, y: e.clientY, cx: M.cam.x, cy: M.cam.y }; moved = false; }
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: M.cam.s }; moved = true;
      }
    });
    window.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (pinch && ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]];
        M.cam.s = Math.max(0.3, Math.min(1.4, pinch.s * Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
        M.apply(); return;
      }
      if (!drag) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!moved && Math.hypot(dx, dy) > 8) moved = true;
      if (moved) { M.cam.x = drag.cx - dx / M.cam.s; M.cam.y = drag.cy - dy / M.cam.s; M.apply(); }
    });
    function up(e) {
      delete pts[e.pointerId];
      if (Object.keys(pts).length < 2) pinch = null;
      if (!Object.keys(pts).length) drag = null;
    }
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      M.cam.s = Math.max(0.3, Math.min(1.4, M.cam.s * (e.deltaY < 0 ? 1.1 : 0.9)));
      M.apply();
    }, { passive: false });
    el.addEventListener('click', function (e) {
      if (moved) { moved = false; return; }
      var g = e.target.closest('[data-act]');
      if (g) EG.ui.mapAction(g.getAttribute('data-act'), g.getAttribute('data-id'), g);
    });
    window.addEventListener('resize', function () { M.cam.s = Math.min(Math.max(M.cam.s, 0.3), 1.4); M.apply(); });
    M.render();
    M.apply();
  };

  EG.map = M;
})();
