// Мини-игры: каркас, сортировка, лабораторный анализ, энергия из органики, энергосеть.
(function () {
  var A = EG.art, D = EG.data, S = EG.state;
  var G = { active: null, reg: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(cat, n) { return shuffle(D.waste.filter(function (w) { return w.cat === cat; })).slice(0, n); }
  function esc(t) { return EG.ui.esc(t); }

  var TITLES = { sorting: 'Сортировка мусора', lab: 'Лабораторный анализ', biogas: 'Энергия из органики', grid: 'Энергетическая сеть' };

  G.open = function (game, mode) {
    EG.ui.closePanel();
    var root = $('#game-root');
    G.active = { game: game, mode: mode };
    root.innerHTML = '<div class="mg"><div class="mg-head"><h3>' + TITLES[game] + '</h3><button class="icon-btn" id="mg-x" aria-label="Закрыть">' + EG.ui.icon.close + '</button></div><div class="mg-body" id="mg-body"></div></div>';
    $('#mg-x').onclick = function () { G.close(); };
    G.reg[game]($('#mg-body'), mode || 'free', function (res) { G.result(game, mode || 'free', res); });
  };
  G.close = function () { $('#game-root').innerHTML = ''; G.active = null; EG.ui.maybeAutoDialog(); };

  G.result = function (game, mode, r) {
    var acc = r.total ? r.correct / r.total : 1;
    var stars = r.success ? (acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1) : 0;
    var body = $('#mg-body');
    var coins = Math.round((r.coins || 0) * S.gameCoinMult());
    body.innerHTML = '<div class="mg-result"><div class="stars">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= stars ? 'on' : '') + '">★</i>'; }).join('') + '</div>' +
      '<h2>' + (r.success ? 'Отлично!' : 'Почти получилось') + '</h2>' +
      (r.total ? '<p>Верно: <b>' + r.correct + ' из ' + r.total + '</b></p>' : '') +
      (r.note ? '<p class="muted">' + r.note + '</p>' : '') +
      (r.success ? '<div class="lu-rew"><div>' + EG.ui.icon.coin + ' <b>+' + coins + '</b></div><div>' + EG.ui.icon.science + ' <b>+' + (r.science || 0) + '</b></div></div>'
        : '<p>Чтобы засчитать задание, нужно не меньше 60% верных ответов.</p>') +
      '<div class="row">' + (r.success ? '' : '<button class="btn ghost" id="mg-again">Ещё раз</button>') + '<button class="btn" id="mg-ok">' + (r.success ? 'Забрать награду' : 'Выйти') + '</button></div></div>';
    $('#mg-ok').onclick = function () {
      G.close();
      if (r.success) EG.quests.minigameDone(game, mode, r);
      else { S.s.stats.minigames++; S.changed(); }
    };
    var ag = $('#mg-again');
    if (ag) ag.onclick = function () { G.open(game, mode); };
  };

  // ═════════ 1. Сортировка мусора ═════════
  G.reg.sorting = function (root, mode, done) {
    var cats, items;
    if (mode === 'oi') {
      cats = ['organic', 'inorganic'];
      items = pick('organic', 4).concat(shuffle(D.waste.filter(function (w) { return ['plastic', 'paper', 'glass', 'metal'].indexOf(w.cat) >= 0; })).slice(0, 4));
    } else {
      cats = ['plastic', 'paper', 'glass', 'metal', 'organic'];
      var per = mode === 'hard' ? 3 : 2;
      items = [];
      cats.forEach(function (c) { items = items.concat(pick(c, per)); });
    }
    items = shuffle(items);
    function catOf(w) { return mode === 'oi' ? (w.cat === 'organic' ? 'organic' : 'inorganic') : w.cat; }
    var i = 0, correct = 0, busy = false;

    root.innerHTML = '<div class="sort"><div class="sort-top"><div class="prog"><i id="so-bar"></i></div><span id="so-cnt"></span></div>' +
      '<div class="sort-stage"><div class="sort-item" id="so-item"></div><div class="sort-hint" id="so-hint">Перетащи предмет в нужный контейнер или нажми на контейнер.</div></div>' +
      '<div class="bins">' + cats.map(function (c) {
        var cc = D.wasteCats[c];
        return '<button class="bin" data-c="' + c + '">' + A.binIcon(cc.color) + '<span>' + cc.name + '</span></button>';
      }).join('') + '</div></div>';

    var itemEl = $('#so-item', root);
    function show() {
      $('#so-bar', root).style.width = (i / items.length * 100) + '%';
      $('#so-cnt', root).textContent = (i + 1 > items.length ? items.length : i + 1) + ' / ' + items.length;
      if (i >= items.length) {
        var acc = correct / items.length;
        return done({ total: items.length, correct: correct, success: acc >= 0.6, coins: correct * 5 + (correct === items.length ? 20 : 0), science: Math.ceil(correct / 2) });
      }
      var w = items[i];
      itemEl.className = 'sort-item in';
      itemEl.style.transform = '';
      itemEl.innerHTML = A.waste(w.id) + '<b>' + esc(w.name) + '</b>';
    }
    function answer(c, binEl) {
      if (busy || i >= items.length) return;
      busy = true;
      var w = items[i], right = catOf(w) === c;
      var hint = $('#so-hint', root);
      if (right) { correct++; binEl.classList.add('ok'); hint.innerHTML = '<span class="good">Верно!</span> ' + esc(w.name) + ' — ' + D.wasteCats[c].name.toLowerCase() + '.'; }
      else {
        binEl.classList.add('bad');
        var rc = catOf(w);
        hint.innerHTML = '<span class="badt">Не совсем.</span> ' + esc(w.name) + ' — это <b>' + D.wasteCats[rc].name.toLowerCase() + '</b>. ' + esc(w.clue);
        var rb = root.querySelector('.bin[data-c="' + rc + '"]'); if (rb) rb.classList.add('ok');
      }
      itemEl.className = 'sort-item out';
      setTimeout(function () {
        root.querySelectorAll('.bin').forEach(function (b) { b.classList.remove('ok', 'bad'); });
        i++; busy = false; show();
      }, right ? 550 : 1600);
    }
    root.querySelectorAll('.bin').forEach(function (b) { b.onclick = function () { answer(b.getAttribute('data-c'), b); }; });

    // перетаскивание
    var drag = null;
    itemEl.addEventListener('pointerdown', function (e) {
      if (busy) return;
      drag = { x: e.clientX, y: e.clientY };
      itemEl.setPointerCapture(e.pointerId);
      itemEl.classList.add('drag');
    });
    itemEl.addEventListener('pointermove', function (e) {
      if (!drag) return;
      itemEl.style.transform = 'translate(' + (e.clientX - drag.x) + 'px,' + (e.clientY - drag.y) + 'px) scale(.85)';
      var over = binAt(e.clientX, e.clientY);
      root.querySelectorAll('.bin').forEach(function (b) { b.classList.toggle('hover', b === over); });
    });
    function binAt(x, y) {
      var bins = root.querySelectorAll('.bin');
      for (var k = 0; k < bins.length; k++) {
        var r = bins[k].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top - 20 && y <= r.bottom) return bins[k];
      }
      return null;
    }
    itemEl.addEventListener('pointerup', function (e) {
      if (!drag) return;
      var moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 10;
      drag = null; itemEl.classList.remove('drag');
      root.querySelectorAll('.bin').forEach(function (b) { b.classList.remove('hover'); });
      var b = moved ? binAt(e.clientX, e.clientY) : null;
      if (b) answer(b.getAttribute('data-c'), b);
      else itemEl.style.transform = '';
    });
    show();
  };

  // ═════════ 2. Лабораторный анализ ═════════
  G.reg.lab = function (root, mode, done) {
    var cats, samples, explain = {};
    if (mode === 'intro') {
      cats = ['organic', 'inorganic'];
      samples = pick('organic', 2).concat(shuffle(D.waste.filter(function (w) { return ['plastic', 'glass', 'metal'].indexOf(w.cat) >= 0; })).slice(0, 1));
    } else if (mode === 'recycle') {
      cats = ['recyclable', 'nonrecyclable'];
      samples = pick('other', 2).concat(shuffle(D.waste.filter(function (w) { return w.cat !== 'other'; })).slice(0, 3));
      explain.organic = 'Органика перерабатывается — в компост или биогаз.';
    } else {
      cats = ['plastic', 'paper', 'glass', 'metal', 'organic'];
      samples = shuffle(D.waste.filter(function (w) { return w.cat !== 'other'; })).slice(0, 4);
    }
    samples = shuffle(samples);
    function catOf(w) {
      if (mode === 'intro') return w.cat === 'organic' ? 'organic' : 'inorganic';
      if (mode === 'recycle') return w.cat === 'other' ? 'nonrecyclable' : 'recyclable';
      return w.cat;
    }
    var state = samples.map(function () { return null; }); // null | true | false
    var sel = -1, step = 1, correct = 0;

    function render() {
      var stepper = ['Выбери образец', 'Анализ под микроскопом', 'Определи категорию'].map(function (t, k) {
        return '<div class="st' + (step === k + 1 ? ' on' : '') + (step > k + 1 ? ' dn' : '') + '"><i>' + (k + 1) + '</i>' + t + '</div>';
      }).join('');
      var tray = samples.map(function (w, k) {
        return '<button class="jar' + (sel === k ? ' on' : '') + (state[k] === true ? ' ok' : state[k] === false ? ' bad' : '') + '" data-k="' + k + '"' + (state[k] !== null ? ' disabled' : '') + '>' + A.waste(w.id) + '<span>Образец ' + (k + 1) + '</span></button>';
      }).join('');
      var w = samples[sel];
      var scope = '<div class="scope">' + (step >= 2 && w ? '<div class="lens">' + A.waste(w.id) + '</div>' : '<div class="lens empty">?</div>') + '</div>';
      var panel = '';
      if (step === 1) panel = '<p>Нажми на любой образец на лотке.</p>';
      if (step === 2) panel = '<p>Образец «' + esc(w.name) + '» на предметном столике.</p><button class="btn" id="lb-scan">Начать анализ</button>';
      if (step === 3) panel = '<p class="clue">🔬 ' + esc(w.clue) + '</p><p>К какой группе относится образец?</p><div class="cats">' +
        cats.map(function (c) { return '<button class="btn small cat" data-c="' + c + '" style="background:' + D.wasteCats[c].color + '">' + D.wasteCats[c].name + '</button>'; }).join('') + '</div>';
      if (step === 4) panel = '<p id="lb-res"></p><button class="btn" id="lb-next">Дальше</button>';
      root.innerHTML = '<div class="labg"><div class="stepper">' + stepper + '</div><div class="labg-main"><div class="tray">' + tray + '</div>' + scope + '<div class="labg-panel">' + panel + '</div></div></div>';
      root.querySelectorAll('.jar').forEach(function (b) { b.onclick = function () { if (step <= 2) { sel = +b.getAttribute('data-k'); step = 2; render(); } }; });
      var sc = $('#lb-scan', root); if (sc) sc.onclick = function () { $('.lens', root).classList.add('scan'); setTimeout(function () { step = 3; render(); }, 700); };
      root.querySelectorAll('.cat').forEach(function (b) {
        b.onclick = function () {
          var c = b.getAttribute('data-c'), rc = catOf(w), ok = c === rc;
          state[sel] = ok; if (ok) correct++;
          step = 4; render();
          $('#lb-res', root).innerHTML = ok ? '<span class="good">Верно!</span> ' + esc(w.name) + ' — ' + D.wasteCats[rc].name.toLowerCase() + '. ' + (explain[w.cat] || '')
            : '<span class="badt">Ошибка.</span> ' + esc(w.name) + ' — <b>' + D.wasteCats[rc].name.toLowerCase() + '</b>. ' + (explain[w.cat] || esc(w.clue));
          $('#lb-next', root).onclick = function () {
            sel = -1; step = 1;
            if (state.every(function (x) { return x !== null; })) {
              var acc = correct / samples.length;
              return done({ total: samples.length, correct: correct, success: acc >= 0.6, coins: correct * 5, science: correct * 2 });
            }
            render();
          };
        };
      });
    }
    render();
  };

  // ═════════ 4. Энергия из органики (анаэробное сбраживание) ═════════
  var STAGES = [
    { t: 'Сбор органических отходов', d: 'Очистки, листья, остатки еды собирают отдельно.', ic: 'apple' },
    { t: 'Подготовка сырья', d: 'Органику измельчают и убирают посторонние примеси.', ic: 'leaves' },
    { t: 'Обработка микроорганизмами в закрытой системе', d: 'В герметичном реакторе без кислорода бактерии перерабатывают сырьё.', ic: null },
    { t: 'Образование биогаза', d: 'Выделяется смесь метана и углекислого газа.', ic: null },
    { t: 'Очистка и контроль', d: 'Датчики следят за давлением, газ очищают от примесей.', ic: null },
    { t: 'Использование энергии', d: 'Генератор вырабатывает электричество и тепло для домов.', ic: null }
  ];
  G.reg.biogas = function (root, mode, done) {
    var order = shuffle(STAGES.map(function (_, k) { return k; }));
    var placed = 0, mistakes = 0;
    function render() {
      root.innerHTML = '<div class="bio"><p class="bio-q">Расставь этапы переработки органики в правильном порядке — нажимай на карточки по очереди.</p>' +
        '<div class="pipe">' + STAGES.map(function (s, k) {
          return '<div class="slot' + (k < placed ? ' full' : '') + (k === placed ? ' next' : '') + '"><i>' + (k + 1) + '</i>' + (k < placed ? '<b>' + esc(s.t) + '</b>' : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="cards">' + order.map(function (k) {
          return k < placed ? '' : '<button class="scard" data-k="' + k + '"><b>' + esc(STAGES[k].t) + '</b><span>' + esc(STAGES[k].d) + '</span></button>';
        }).join('') + '</div><div class="bio-hint" id="bio-h"></div></div>';
      root.querySelectorAll('.scard').forEach(function (b) {
        b.onclick = function () {
          var k = +b.getAttribute('data-k');
          if (k === placed) { placed++; if (placed === STAGES.length) return finale(); render(); }
          else {
            mistakes++;
            b.classList.add('shake'); setTimeout(function () { b.classList.remove('shake'); }, 500);
            $('#bio-h', root).textContent = placed === 0 ? 'Подумай: с чего всё начинается?' : 'Подумай, что идёт после этапа «' + STAGES[placed - 1].t + '».';
          }
        };
      });
    }
    function finale() {
      root.innerHTML = '<div class="bio-fin">' + A.svg('0 0 420 170',
        '<rect width="420" height="170" rx="14" fill="#e8f5e9"/>' +
        '<rect x="30" y="80" width="120" height="60" fill="#8fbf8a" stroke="#2b3a33" stroke-width="3"/><path d="M30 80 Q90 0 150 80Z" fill="#6fae6c" stroke="#2b3a33" stroke-width="3"/>' +
        [0, 1, 2, 3, 4].map(function (k) { return '<circle cx="' + (60 + k * 16) + '" cy="120" r="5" fill="#fff" opacity=".8"><animate attributeName="cy" values="130;70;130" dur="' + (1.4 + k * 0.3) + 's" repeatCount="indefinite"/></circle>'; }).join('') +
        '<path d="M150 70 H220" stroke="#90a4ae" stroke-width="8"/><rect x="220" y="50" width="60" height="70" rx="10" fill="#cfd8dc" stroke="#2b3a33" stroke-width="3"/>' +
        '<circle cx="250" cy="74" r="12" fill="#fff" stroke="#2b3a33" stroke-width="2.5"/><line x1="250" y1="74" x2="258" y2="66" stroke="#e74c3c" stroke-width="3"><animateTransform attributeName="transform" type="rotate" values="0 250 74;40 250 74;0 250 74" dur="2s" repeatCount="indefinite"/></line>' +
        '<path d="M280 85 H320" stroke="#90a4ae" stroke-width="8"/><rect x="320" y="60" width="70" height="60" rx="8" fill="#34495e" stroke="#2b3a33" stroke-width="3"/>' +
        '<path d="M360 70 l-10 16 h8 l-4 14 l12 -18 h-8z" fill="#f2b705"><animate attributeName="opacity" values="1;.4;1" dur="1s" repeatCount="indefinite"/></path>' +
        '<text x="90" y="160" text-anchor="middle" font-size="13" font-family="Nunito,sans-serif" fill="#2b3a33">реактор</text><text x="250" y="140" text-anchor="middle" font-size="13" font-family="Nunito,sans-serif" fill="#2b3a33">очистка и датчики</text><text x="355" y="140" text-anchor="middle" font-size="13" font-family="Nunito,sans-serif" fill="#2b3a33">генератор</text>') +
        '<p>Процесс собран верно! Биогаз очищают и под контролем датчиков используют в генераторе — он даёт <b>электричество и тепло</b>.</p>' +
        '<p class="muted small">Это промышленный процесс в герметичной установке с системами защиты. Получать или поджигать газ самостоятельно опасно.</p>' +
        '<button class="btn" id="bio-ok">Дальше</button></div>';
      $('#bio-ok', root).onclick = function () {
        done({ total: 0, correct: 0, success: true, coins: Math.max(10, 40 - mistakes * 5), science: 5, note: mistakes ? 'Ошибок: ' + mistakes : 'Без единой ошибки!' });
      };
    }
    render();
  };

  // ═════════ 3. Энергетическая сеть ═════════
  G.reg.grid = function (root, mode, done) {
    var nodes = [
      { id: 'src', name: 'Биогаз-установка', type: 'src', x: 70, y: 150 },
      { id: 'st', name: 'Накопитель', type: 'st', x: 230, y: 150, ports: mode === 'basic' ? 2 : 2 },
      { id: 'h1', name: 'Дом 1', type: 'use', x: 400, y: 60 },
      { id: 'h2', name: 'Дом 2', type: 'use', x: 400, y: 240 }
    ];
    if (mode !== 'basic') { nodes.push({ id: 'h3', name: 'Дом 3', type: 'use', x: 540, y: 150 }); nodes.push({ id: 'lab', name: 'Лаборатория', type: 'use', x: 540, y: 290 }); }
    var edges = [], sel = null;
    function N(id) { return nodes.filter(function (n) { return n.id === id; })[0]; }
    function key(a, b) { return [a, b].sort().join('-'); }
    function has(a, b) { return edges.indexOf(key(a, b)) >= 0; }
    function deg(id) { return edges.filter(function (e) { return e.split('-').indexOf(id) >= 0; }).length; }
    function powered() {
      var seen = { src: true }, q = ['src'];
      while (q.length) {
        var c = q.shift();
        edges.forEach(function (e) { var p = e.split('-'); var o = p[0] === c ? p[1] : p[1] === c ? p[0] : null; if (o && !seen[o]) { seen[o] = true; q.push(o); } });
      }
      return seen;
    }
    function msg(t) { $('#gr-h', root).textContent = t; }
    function render() {
      var pw = powered();
      var W = mode === 'basic' ? 480 : 620;
      var s = '<rect width="' + W + '" height="330" rx="14" fill="#eef6f2"/>';
      edges.forEach(function (e) {
        var p = e.split('-'), a = N(p[0]), b = N(p[1]), live = pw[a.id] && pw[b.id];
        s += '<line class="cable' + (live ? ' live' : '') + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" data-e="' + e + '"/>';
      });
      nodes.forEach(function (n) {
        var on = pw[n.id], cls = 'node ' + n.type + (sel === n.id ? ' sel' : '') + (on ? ' on' : '');
        var ic = n.type === 'src' ? '<path d="M-22 10 Q0 -40 22 10z" fill="#6fae6c" stroke="#2b3a33" stroke-width="2.5"/><text y="4" text-anchor="middle" font-size="11" fill="#fff" font-weight="800">CH₄</text>'
          : n.type === 'st' ? '<rect x="-18" y="-22" width="36" height="40" rx="6" fill="#34495e"/><path d="M3 -16 l-9 14 h7 l-4 12 l11 -16 h-7z" fill="#f2b705"/>'
          : '<path d="M-20 -2 L0 -22 L20 -2z" fill="' + (n.id === 'lab' ? '#2f8f63' : '#c0392b') + '" stroke="#2b3a33" stroke-width="2.5"/><rect x="-16" y="-2" width="32" height="22" fill="' + (on ? '#ffe9a3' : '#cfd8dc') + '" stroke="#2b3a33" stroke-width="2.5"/>';
        s += '<g class="' + cls + '" data-n="' + n.id + '" transform="translate(' + n.x + ' ' + n.y + ')"><circle r="38"/>' + ic +
          '<text y="56" text-anchor="middle" class="nl">' + n.name + '</text>' +
          (n.type === 'use' ? '<circle cx="26" cy="-26" r="9" class="bulb"/>' : '') +
          (n.type === 'st' ? '<text y="-44" text-anchor="middle" class="nl small">выходов: ' + Math.max(0, n.ports - (deg('st') - (has('st', 'src') ? 1 : 0))) + '</text>' : '') + '</g>';
      });
      var allOn = nodes.every(function (n) { return pw[n.id]; });
      root.innerHTML = '<div class="grid-g"><p>Соедини кабелями: установка → накопитель → потребители. Нажми на два объекта, чтобы проложить или убрать кабель. ' +
        (mode === 'basic' ? '' : 'У накопителя только 2 выхода — подключай здания цепочкой.') + '</p>' +
        A.svg('0 0 ' + W + ' 330', s, 'grid-svg') + '<div class="grid-foot"><span id="gr-h">' + (allOn ? 'Все объекты получают энергию!' : 'Кабелей: ' + edges.length) + '</span>' +
        (allOn ? '<button class="btn" id="gr-ok">Запустить систему</button>' : '') + '</div></div>';
      root.querySelectorAll('.node').forEach(function (g) { g.onclick = function () { tap(g.getAttribute('data-n')); }; });
      var ok = $('#gr-ok', root);
      if (ok) ok.onclick = function () { done({ total: 0, correct: 0, success: true, coins: 30, science: 4, note: 'Энергосистема работает стабильно.' }); };
    }
    function tap(id) {
      if (!sel) { sel = id; return render(); }
      if (sel === id) { sel = null; return render(); }
      var a = N(sel), b = N(id); sel = null;
      if (has(a.id, b.id)) { edges.splice(edges.indexOf(key(a.id, b.id)), 1); return render(); }
      var types = [a.type, b.type].sort().join('-');
      if (types === 'src-use') { render(); return msg('Сначала энергия поступает в накопитель — так сеть работает без перебоев.'); }
      if (types === 'st-use') {
        var outs = deg('st') - (has('st', 'src') ? 1 : 0);
        if (outs >= N('st').ports) { render(); return msg('У накопителя заняты все выходы. Подключи здание к уже запитанному зданию.'); }
      }
      edges.push(key(a.id, b.id));
      render();
    }
    render();
  };

  EG.games = G;
})();
