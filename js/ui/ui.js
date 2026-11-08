// Экраны, HUD, панели, диалоги, уведомления.
(function () {
  var S = EG.state, Q = EG.quests, A = EG.art, D = EG.data;
  var U = {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  U.esc = esc; U.fmt = fmt;

  // ───────── иконки ─────────
  var I = {
    coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffc83d" stroke="#b7791f" stroke-width="2"/><path d="M8.5 15.5 Q8 9 15.5 8.5 Q16 15 8.5 15.5Z" fill="#3e9f4c"/></svg>',
    energy: '<svg viewBox="0 0 24 24"><path d="M14 2 L5 14 h6 l-2 8 l10 -13 h-6 z" fill="#4fd1ff" stroke="#1d6fa5" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    science: '<svg viewBox="0 0 24 24"><path d="M9 3 h6 M10 3 v6 l-5 9 q-1 3 2 3 h10 q3 0 2 -3 l-5 -9 v-6" fill="#e8f5e9" stroke="#2f8f63" stroke-width="2" stroke-linejoin="round"/><path d="M7 16 h10 l1.5 3 h-13z" fill="#6fcf73"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="M3 6 l6 -2 l6 2 l6 -2 v14 l-6 2 l-6 -2 l-6 2z M9 4 v14 M15 6 v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    quests: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 8 h8 M8 12 h8 M8 16 h5" stroke="currentColor" stroke-width="2"/></svg>',
    shop: '<svg viewBox="0 0 24 24"><path d="M5 8 h14 l-1 13 h-12z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8 V6 a3 3 0 0 1 6 0 v2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    lab: '<svg viewBox="0 0 24 24"><path d="M9 3 h6 M10 3 v6 l-5 9 q-1 3 2 3 h10 q3 0 2 -3 l-5 -9 v-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    profile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21 q0 -7 8 -7 q8 0 8 7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    ach: '<svg viewBox="0 0 24 24"><path d="M7 4 h10 v4 a5 5 0 0 1 -10 0z M7 6 H4 q0 4 3 4 M17 6 h3 q0 4 -3 4 M12 13 v4 M8 21 h8 l-1 -4 h-6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3 M4.9 4.9 l2.1 2.1 M17 17 l2.1 2.1 M4.9 19.1 L7 17 M17 7 l2.1 -2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11 V8 a4 4 0 0 1 8 0 v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12 l5 5 l9 -10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  U.icon = I;

  function charData(id) { return D.characters.filter(function (c) { return c.id === (id || S.s.char); })[0] || D.characters[0]; }
  function roman(n) { return ['I', 'II', 'III', 'IV', 'V'][n - 1]; }
  function chapterOf(n) { return D.chapters.filter(function (c) { return n >= c.from && n <= c.to; })[0]; }

  // ───────── стартовые экраны ─────────
  U.showStart = function () {
    var has = S.has() && S.s.char;
    $('#app').innerHTML =
      '<div class="screen start">' +
      '<div class="start-bg">' + A.introScene('past').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ') + '</div>' +
      '<div class="start-card">' +
      '<div class="logo"><span class="logo-leaf"></span>ECOGEN</div>' +
      '<div class="motto">«Маленькие действия — большие перемены»</div>' +
      (has ? '<button class="btn big" id="b-cont">Продолжить</button>' : '') +
      '<button class="btn big ' + (has ? 'ghost' : '') + '" id="b-new">Новая игра</button>' +
      '<div class="start-helpers"><div class="sh">' + A.professor() + '</div><div class="sh small">' + A.bait() + '</div></div>' +
      '</div></div>';
    if (has) $('#b-cont').onclick = function () { U.startGame(); };
    $('#b-new').onclick = function () {
      if (has) U.confirm('Начать заново? Текущий прогресс будет удалён.', function () { S.reset(); U.showNewGame(); });
      else { S.reset(); U.showNewGame(); }
    };
  };

  U.showNewGame = function () {
    $('#app').innerHTML =
      '<div class="screen newgame"><div class="panel-card narrow">' +
      '<h2>Новая игра</h2><p>Как тебя зовут? Это имя увидят профессор Эко и Байт.</p>' +
      '<input id="nick" maxlength="16" placeholder="Твой ник" autocomplete="off" value="' + esc(S.s.nick || '') + '">' +
      '<div class="err" id="nerr"></div>' +
      '<div class="row"><button class="btn ghost" id="b-back">Назад</button><button class="btn" id="b-next">Дальше</button></div>' +
      '</div></div>';
    $('#b-back').onclick = U.showStart;
    var go = function () {
      var v = $('#nick').value.trim();
      if (v.length < 2) { $('#nerr').textContent = 'Ник — от 2 символов'; return; }
      S.s.nick = v; S.save(); U.showCharSelect();
    };
    $('#b-next').onclick = go;
    $('#nick').onkeydown = function (e) { if (e.key === 'Enter') go(); };
    setTimeout(function () { var n = $('#nick'); if (n) n.focus(); }, 50);
  };

  U.showCharSelect = function () {
    var sel = S.s.char || null;
    var cards = D.characters.map(function (c) {
      return '<button class="char-card' + (sel === c.id ? ' on' : '') + '" data-id="' + c.id + '">' +
        '<div class="char-art">' + A.character(c) + '</div>' +
        '<div class="char-name">' + c.name + ' <span class="tag">предв.</span></div>' +
        '<div class="char-title">№' + c.num + ' — ' + c.title + '</div></button>';
    }).join('');
    $('#app').innerHTML = '<div class="screen charsel"><h2>Выбери персонажа</h2><div class="char-grid">' + cards + '</div>' +
      '<div class="char-traits" id="traits">Нажми на персонажа, чтобы выбрать его.</div>' +
      '<div class="row"><button class="btn ghost" id="b-back">Назад</button><button class="btn" id="b-go" ' + (sel ? '' : 'disabled') + '>Начать</button></div></div>';
    function showTraits(id) {
      var c = charData(id);
      $('#traits').innerHTML = '<b>' + c.name + ':</b> ' + c.traits.join(' · ');
    }
    if (sel) showTraits(sel);
    Array.prototype.forEach.call(document.querySelectorAll('.char-card'), function (b) {
      b.onclick = function () {
        sel = b.getAttribute('data-id');
        document.querySelectorAll('.char-card').forEach(function (x) { x.classList.toggle('on', x === b); });
        $('#b-go').disabled = false; showTraits(sel);
      };
    });
    $('#b-back').onclick = U.showNewGame;
    $('#b-go').onclick = function () { S.s.char = sel; S.save(); U.showIntro(0); };
  };

  U.showIntro = function (i) {
    var sl = D.intro[i];
    if (!sl) { S.s.introSeen = true; S.save(); return U.startGame(); }
    $('#app').innerHTML = '<div class="screen intro"><div class="intro-art">' + A.introScene(sl.scene) + '</div>' +
      '<div class="intro-text"><p>' + esc(sl.text) + '</p><div class="dots">' +
      D.intro.map(function (_, k) { return '<i class="' + (k === i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn ghost" id="b-skip">Пропустить</button><button class="btn" id="b-nx">' + (i === D.intro.length - 1 ? 'В город!' : 'Далее') + '</button></div></div></div>';
    $('#b-nx').onclick = function () { U.showIntro(i + 1); };
    $('#b-skip').onclick = function () { U.showIntro(99); };
  };

  // ───────── игровой экран ─────────
  U.startGame = function () {
    $('#app').innerHTML =
      '<div class="game">' +
      '<div id="map"></div>' +
      '<div class="hud-top">' +
      '  <button class="hud-player" id="h-player"><div class="ava" id="h-ava"></div><div class="pinfo"><div class="pnick" id="h-nick"></div><div class="plv" id="h-lv"></div><div class="xpbar"><i id="h-xp"></i></div></div></button>' +
      '  <div class="res"><div class="pill" id="r-coins">' + I.coin + '<b></b></div><div class="pill" id="r-energy">' + I.energy + '<b></b></div><div class="pill" id="r-science">' + I.science + '<b></b></div></div>' +
      '  <button class="icon-btn" id="h-gear" aria-label="Настройки">' + I.gear + '</button>' +
      '</div>' +
      '<div class="quest-card" id="qcard"></div>' +
      '<div class="place-banner" id="pbanner"></div>' +
      '<nav class="nav" id="nav"></nav>' +
      '</div>';
    EG.map.init($('#map'));
    $('#h-player').onclick = U.openProfile;
    $('#h-gear').onclick = U.openSettings;
    U.refresh();
    Q.checkAch();
    Q.checkInstant();
    U.onTaskChanged();
    EG.map.focusTarget();
  };

  var NAV = [
    { id: 'map', name: 'Карта', icon: 'map' },
    { id: 'quests', name: 'Задания', icon: 'quests' },
    { id: 'shop', name: 'Магазин', icon: 'shop', lv: 4 },
    { id: 'lab', name: 'Лаборатория', icon: 'lab', lv: 2 },
    { id: 'profile', name: 'Профиль', icon: 'profile' },
    { id: 'ach', name: 'Достижения', icon: 'ach' }
  ];

  U.refresh = function () {
    if (!$('.game')) return;
    var s = S.s, c = charData();
    var ava = $('#h-ava');
    if (ava.getAttribute('data-c') !== c.id) { ava.innerHTML = A.svg('22 22 156 156', A.characterInner(c)); ava.setAttribute('data-c', c.id); }
    $('#h-nick').textContent = s.nick;
    $('#h-lv').textContent = 'Уровень ' + s.level;
    $('#h-xp').style.width = Math.min(100, s.xp / Q.xpNeeded() * 100) + '%';
    $('#r-coins b').textContent = fmt(s.coins);
    $('#r-energy b').textContent = s.energy + '/' + S.energyCap();
    $('#r-science b').textContent = s.science;
    $('#nav').innerHTML = NAV.map(function (n) {
      var locked = n.lv && s.level < n.lv;
      return '<button class="nav-btn' + (locked ? ' locked' : '') + '" data-n="' + n.id + '">' + I[n.icon] +
        '<span>' + n.name + '</span>' + (locked ? '<em>' + I.lock + n.lv + '</em>' : '') + '</button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('.nav-btn'), function (b) {
      b.onclick = function () { U.nav(b.getAttribute('data-n')); };
    });
    U.renderQuestCard();
    U.renderBanner();
    EG.map.render();
  };

  U.nav = function (id) {
    var n = NAV.filter(function (x) { return x.id === id; })[0];
    if (n.lv && S.s.level < n.lv) return U.toast('Откроется на уровне ' + n.lv, n.name);
    U.closePanel();
    if (id === 'map') { EG.map.focusTarget(); return; }
    if (id === 'quests') U.openQuests();
    if (id === 'shop') { Q.event('tap', 'shop'); U.openShop(); }
    if (id === 'lab') { U.labTapped(); }
    if (id === 'profile') U.openProfile();
    if (id === 'ach') U.openAchievements();
  };

  // ───────── карточка задания ─────────
  U.renderQuestCard = function () {
    var el = $('#qcard'); if (!el) return;
    var lv = Q.level(), t = Q.task();
    if (!lv) { el.innerHTML = ''; return; }
    if (!lv.playable) {
      el.innerHTML = '<div class="qc-lv">Ур. ' + lv.n + ' · ' + esc(lv.title) + '</div><div class="qc-t">Глава ' + roman(chapterOf(lv.n).num) + ' — в следующей версии</div>' +
        '<button class="btn small" id="qc-go">Подробнее</button>';
      $('#qc-go').onclick = function (e) { e.stopPropagation(); U.dialog('chapter2_soon'); };
      el.onclick = U.openQuests;
      return;
    }
    var prog = t && t.count ? ' <span class="qc-prog">' + Math.min(S.s.taskProg, t.count) + '/' + t.count + '</span>' : '';
    if (t && t.type === 'earn') prog = ' <span class="qc-prog">' + Math.min(S.s.levelStats[t.res] || 0, t.count) + '/' + t.count + '</span>';
    if (t && t.type === 'clearAll') prog = ' <span class="qc-prog">осталось ' + S.remainingPiles().length + '</span>';
    el.innerHTML = '<div class="qc-lv">Ур. ' + lv.n + ' · ' + esc(lv.title) + ' <span class="qc-n">' + (S.s.taskIndex + 1) + '/' + lv.tasks.length + '</span></div>' +
      '<div class="qc-t">' + (t ? esc(t.t) : '') + prog + '</div>' +
      '<button class="btn small" id="qc-go">' + U.taskButton(t) + '</button>';
    $('#qc-go').onclick = function (e) { e.stopPropagation(); U.doTask(t); };
    el.onclick = U.openQuests;
  };

  U.taskButton = function (t) {
    if (!t) return 'OK';
    return { dialog: 'Поговорить', minigame: 'Начать', research: 'В лабораторию', buy: 'В магазин', place: 'Разместить' }[t.type] || 'Показать';
  };

  U.doTask = function (t) {
    if (!t) return;
    switch (t.type) {
      case 'dialog': return U.dialog(t.dialog);
      case 'minigame': return EG.games.open(t.game, t.mode);
      case 'research': return U.openLab();
      case 'buy': Q.event('tap', 'shop'); return U.openShop();
      case 'place':
        var inv = Object.keys(S.s.inventory).filter(function (k) { return EG.shop.matches(t.item, k); });
        if (inv.length) return U.startPlacing(inv[0]);
        return U.openShop(t.item.indexOf('cat:') === 0 ? t.item.slice(4) : null);
      case 'tap':
        if (t.target === 'shopBrowse') return U.openShop();
        break;
      case 'earn':
        if (S.s.level >= 7) return U.openStation();
        break;
    }
    EG.map.focusTarget();
    U.hint(t);
  };

  U.hintText = function (t) {
    if (!t) return 'Продолжай улучшать город!';
    var map = {
      tap: 'Нажми на объект, над которым стрелка.',
      collect: 'Нажимай на кучи органики на карте — я помогу собрать их в контейнеры.',
      clearAll: 'Нажимай на оставшиеся кучи мусора.',
      deliver: 'Органика собрана! Нажми на лабораторию, чтобы доставить её.',
      restore: 'Нажми на заброшенный дом и восстанови его за монеты.',
      earn: 'Проходи сортировку на экологической станции.'
    };
    if (t.target === 'organicHint') return 'Органические кучи — коричневые, с очистками и листьями. Нажми на любую.';
    if (t.target === 'shopBrowse') return 'Открой магазин и переключи вкладку с категорией товаров.';
    if (t.target && t.target.indexOf('district:') === 0) return 'Нажми на закрытый район со стрелкой.';
    return map[t.type] || 'Следуй за стрелкой.';
  };
  U.hint = function (t) { U.toast('Байт: ' + U.hintText(t), '', 'bait'); };

  // ───────── действия на карте ─────────
  U.mapAction = function (act, id, el) {
    var t = Q.task();
    if (act === 'slot' && EG.map.placing) {
      var item = EG.map.placing;
      if (EG.shop.place(item, id)) {
        EG.map.placing = null;
        U.toast('Установлено: ' + EG.shop.item(item).name, 'Город становится лучше!');
      }
      U.refresh();
      return;
    }
    if (EG.map.placing) return U.toast('Выбери светящееся место «+»', '');
    if (act === 'helpers') return U.helperTalk();
    if (act === 'viewpoint') return U.dialog('viewpoint', function () { Q.event('tap', 'viewpoint'); });
    if (act === 'pile') return U.pileTap(id, el);
    if (act === 'district') return U.districtTap(id);
    if (act === 'building') {
      var b = EG.map.bld(id);
      if (b.unlockLevel && S.s.level < b.unlockLevel) return U.toast(b.name + ' — откроется на уровне ' + b.unlockLevel, '');
      if (b.house) return U.openHouse(b);
      if (id === 'lab') return U.labTapped();
      if (id === 'shop') { Q.event('tap', 'shop'); return U.firstTime('shop_open', U.openShop); }
      if (id === 'station') { Q.event('tap', 'station'); return U.firstTime('station_open', U.openStation); }
      if (id === 'biogas') return U.openBiogas();
      if (id === 'storage') { Q.event('tap', 'storage'); return U.firstTime('storage_open', U.openStorage); }
    }
  };

  U.firstTime = function (dlg, then) {
    if (S.s.flags['seen_' + dlg]) return then();
    S.s.flags['seen_' + dlg] = true; S.save();
    U.dialog(dlg, then);
  };

  U.labTapped = function () {
    var t = Q.task();
    if (S.s.level < 2) return U.toast('Лаборатория откроется на уровне 2', '');
    if (t && t.type === 'deliver' && S.s.carried > 0) {
      var n = S.s.carried; S.s.carried = 0;
      S.addScience(n);
      return U.dialog('deliver', function () { Q.event('deliver', n); U.refresh(); });
    }
    Q.event('tap', 'lab');
    U.firstTime('lab_open', U.openLab);
  };

  U.pileTap = function (id, el) {
    var p = D.world.piles.filter(function (x) { return x.id === id; })[0];
    var t = Q.task();
    if (!S.s.flags.gloves) return U.toast('Байт: сначала получим перчатки из стартового набора!', '', 'bait');
    if (p.kind === 'organic') {
      if (t && t.type === 'tap' && t.target === 'organicHint') {
        U.toast('Байт: это органика — очистки, листья, остатки еды. Её можно переработать!', '', 'bait');
        return Q.event('tap', 'organicHint');
      }
      if (S.s.level < 8) return U.toast('Байт: для органики нужны специальные контейнеры — займёмся ею на уровне 8.', '', 'bait');
    }
    if (el) el.classList.add('poof');
    setTimeout(function () {
      if (S.pileGone(id)) return;
      S.s.removedPiles.push(id);
      S.s.stats.piles++;
      S.addCoins(10);
      if (p.kind === 'organic' && t && t.type === 'collect') S.s.carried++;
      var adv = Q.event('collect', p.kind);
      if (!adv) { S.changed(); Q.checkInstant(); }
      Q.checkAch();
      U.refresh();
    }, 260);
  };

  U.districtTap = function (id) {
    var d = D.world.districts.filter(function (x) { return x.id === id; })[0];
    var t = Q.task();
    if (t && t.type === 'tap' && t.target === 'district:' + id) {
      return U.dialog('district_open', function () { Q.event('tap', 'district:' + id); });
    }
    if (S.s.level < d.unlockLevel) return U.toast(d.name + ' — откроется на уровне ' + d.unlockLevel, 'Порядок открытия районов предварительный');
    U.toast(d.name, 'Задания этого района появятся в следующей версии');
  };

  U.helperTalk = function () {
    var t = Q.task();
    if (t && t.type === 'dialog') return U.dialog(t.dialog);
    var lines = [{ who: 'bait', text: U.hintText(t) }];
    if (t) lines.unshift({ who: 'eco', text: 'Текущее задание: «' + t.t + '».' });
    U.dialogLines(lines);
  };

  // ───────── размещение ─────────
  U.startPlacing = function (itemId) {
    var it = EG.shop.item(itemId);
    var free = D.world.slots.filter(function (s) { return s.size === it.size && !S.slotItem(s.id); });
    if (!free.length) return U.toast('Нет свободных мест для «' + it.name + '»', 'Новые места появятся в следующих районах');
    U.closePanel();
    EG.map.placing = itemId;
    U.refresh();
    EG.map.focus(500, 1000);
  };
  U.renderBanner = function () {
    var el = $('#pbanner'); if (!el) return;
    if (!EG.map.placing) { el.classList.remove('on'); return; }
    el.classList.add('on');
    el.innerHTML = 'Выбери место для «' + esc(EG.shop.item(EG.map.placing).name) + '» <button class="btn small ghost" id="pb-x">Отмена</button>';
    $('#pb-x').onclick = function () { EG.map.placing = null; U.refresh(); };
  };

  // ───────── панели ─────────
  U.panel = function (title, html, cls) {
    U.closePanel();
    var root = $('#modal-root');
    root.innerHTML = '<div class="overlay" id="ov"><div class="panel ' + (cls || '') + '"><div class="panel-head"><h3>' + title + '</h3>' +
      '<button class="icon-btn" id="pclose" aria-label="Закрыть">' + I.close + '</button></div><div class="panel-body">' + html + '</div></div></div>';
    $('#pclose').onclick = U.closePanel;
    $('#ov').onclick = function (e) { if (e.target.id === 'ov') U.closePanel(); };
    return $('.panel-body', root);
  };
  U.closePanel = function () {
    var r = $('#modal-root');
    if (r && r.innerHTML) { r.innerHTML = ''; if (U.maybeAutoDialog) U.maybeAutoDialog(); }
  };
  U.panelOpen = function () { return !!$('#modal-root .overlay'); };

  // Магазин
  U.openShop = function (tab) {
    tab = tab || U._shopTab || 'plants';
    U._shopTab = tab;
    var tabs = D.shopCategories.map(function (c) {
      return '<button class="tab' + (tab === c.id ? ' on' : '') + '" data-t="' + c.id + '">' + c.name + '</button>';
    }).join('') + '<button class="tab' + (tab === 'inv' ? ' on' : '') + '" data-t="inv">Мои предметы</button>';
    var body;
    if (tab === 'inv') {
      var keys = Object.keys(S.s.inventory);
      body = keys.length ? '<div class="grid">' + keys.map(function (k) {
        var it = EG.shop.item(k);
        return '<div class="card item"><div class="ic">' + A.itemIcon(k) + '</div><div class="nm">' + esc(it.name) + '</div><div class="pr">× ' + S.s.inventory[k] + '</div>' +
          '<button class="btn small" data-place="' + k + '">Разместить</button></div>';
      }).join('') + '</div>' : '<p class="muted">Склад пуст. Купленные предметы появятся здесь, пока не размещены на карте.</p>';
    } else {
      body = '<div class="grid">' + D.shopItems.filter(function (i) { return i.cat === tab; }).map(function (it) {
        var locked = S.s.level < it.unlockLevel;
        var price = it.price == null ? '<span class="pnote">' + esc(it.priceNote) + '</span>' :
          I.coin + '<b>' + fmt(it.price) + (it.priceMax ? '–' + fmt(it.priceMax) : '') + '</b>' + (it.priceNote ? ' <span class="pnote">' + esc(it.priceNote) + '</span>' : '');
        var btn = locked ? '<button class="btn small" disabled>' + I.lock + ' Ур. ' + it.unlockLevel + '</button>'
          : it.price == null ? '<button class="btn small" disabled>Скоро</button>'
          : '<button class="btn small" data-buy="' + it.id + '"' + (S.s.coins < it.price ? ' disabled' : '') + '>Купить</button>';
        var owned = it.kind === 'upgrade' && S.s.upgrades[it.id] ? '<div class="owned">куплено: ' + S.s.upgrades[it.id] + '</div>' : '';
        return '<div class="card item' + (locked ? ' locked' : '') + '"><div class="ic">' + A.itemIcon(it.id) + '</div><div class="nm">' + esc(it.name) + '</div>' +
          (it.desc ? '<div class="ds">' + esc(it.desc) + '</div>' : '') + '<div class="pr">' + price + '</div>' + owned + btn + '</div>';
      }).join('') + '</div><p class="muted small">Цены предварительные и могут меняться при балансировке. Диапазон цен — цена базового варианта.</p>';
    }
    var el = U.panel('Магазин', '<div class="tabs">' + tabs + '</div>' + body, 'wide');
    el.querySelectorAll('.tab').forEach(function (b) {
      b.onclick = function () { Q.event('tap', 'shopBrowse'); U.openShop(b.getAttribute('data-t')); };
    });
    el.querySelectorAll('[data-buy]').forEach(function (b) {
      b.onclick = function () {
        var id = b.getAttribute('data-buy'), it = EG.shop.item(id);
        if (!EG.shop.buy(id)) return U.toast('Не хватает монет', '');
        U.refresh();
        if (it.kind === 'upgrade') { U.toast('Улучшение: ' + it.name, it.desc || ''); U.openShop(tab); }
        else U.startPlacing(id);
      };
    });
    el.querySelectorAll('[data-place]').forEach(function (b) {
      b.onclick = function () { U.startPlacing(b.getAttribute('data-place')); };
    });
  };

  // Лаборатория
  U.openLab = function (sel) {
    var t = Q.task();
    var list = D.research.filter(function (r) { return !r.optional; }).concat(D.research.filter(function (r) { return r.optional; }));
    var firstOpen = list.filter(function (r) { return !S.s.research[r.id] && S.s.level >= r.unlockLevel; })[0];
    sel = sel || (t && t.type === 'research' ? t.topic : null) || U._labSel || (firstOpen || list[0]).id;
    U._labSel = sel;
    var items = list.map(function (r) {
      var locked = S.s.level < r.unlockLevel, done = S.s.research[r.id];
      var cost = r.optional ? r.sciCost + ' 🔬' : (r.energy ? r.energy + ' ⚡' : 'бесплатно');
      var need = t && t.type === 'research' && t.topic === r.id;
      return '<button class="ritem' + (sel === r.id ? ' on' : '') + (locked ? ' locked' : '') + (done ? ' done' : '') + (need ? ' need' : '') + '" data-r="' + r.id + '">' +
        '<span>' + (done ? I.check : locked ? I.lock : '') + esc(r.name) + '</span><em>' + (locked ? 'Ур. ' + r.unlockLevel : done ? 'изучено' : cost) + '</em></button>';
    }).join('');
    var r = D.research.filter(function (x) { return x.id === sel; })[0];
    var locked = S.s.level < r.unlockLevel, done = S.s.research[r.id];
    var canPay = r.optional ? S.s.science >= r.sciCost : S.s.energy >= (r.energy || 0);
    var action = locked ? '<button class="btn" disabled>' + I.lock + ' Откроется на уровне ' + r.unlockLevel + '</button>'
      : done ? '<div class="done-badge">' + I.check + ' Исследование завершено' + (r.bonusText ? ' · ' + r.bonusText : '') + '</div>'
      : '<button class="btn" id="r-go"' + (canPay ? '' : ' disabled') + '>Исследовать (' + (r.optional ? r.sciCost + ' 🔬' : (r.energy || 0) + ' ⚡') + ')</button>' +
        (canPay ? '' : '<div class="err">' + (r.optional ? 'Не хватает научных очков' : 'Не хватает энергии — она копится в биогазовой установке') + '</div>');
    var totalReq = D.research.filter(function (x) { return !x.optional; }).length;
    var doneN = Object.keys(S.s.research).length;
    var labMode = t && t.type === 'minigame' && t.game === 'lab' ? t.mode : 'free';
    var html = '<div class="lab">' +
      '<div class="lab-list"><div class="lab-stats"><div>' + I.energy + ' <b>' + S.s.energy + '/' + S.energyCap() + '</b></div><div>' + I.science + ' <b>' + S.s.science + '</b></div><div>Исследований: <b>' + doneN + '/' + D.research.length + '</b></div></div>' + items +
      '<button class="btn ghost full" id="lab-game">Лабораторный анализ образцов</button></div>' +
      '<div class="lab-detail"><div class="lab-scene">' + A.svg('0 0 300 120', '<rect width="300" height="120" rx="12" fill="#e8f5f1"/><rect x="10" y="80" width="280" height="14" rx="4" fill="#90a4ae"/>' +
        '<path d="M60 30 h20 v22 l14 28 h-48 l14 -28z" fill="#a6dcf0" stroke="#2b3a33" stroke-width="3"/><path d="M52 68 h36 l6 12 h-48z" fill="#6fcf73"/>' +
        '<rect x="130" y="40" width="10" height="40" fill="#455a64"/><rect x="118" y="30" width="40" height="14" rx="4" fill="#607d8b"/><circle cx="150" cy="70" r="8" fill="#37474f"/>' +
        '<rect x="200" y="26" width="80" height="54" rx="6" fill="#0f2338"/><path d="M208 66 l14 -16 l12 8 l16 -20 l18 10" stroke="#4fd1ff" stroke-width="3" fill="none"/>') + '</div>' +
      '<h4>' + esc(r.name) + (r.optional ? ' <span class="tag">доп.</span>' : '') + '</h4><p>' + esc(r.text) + '</p>' +
      (r.bonusText && !done ? '<p class="bonus">Бонус: ' + esc(r.bonusText) + '</p>' : '') +
      '<p class="muted small">Награда: ' + (r.optional ? 'постоянный бонус' : '+' + (r.sci + (S.s.upgrades.labgear || 0)) + ' 🔬') + '</p>' + action +
      '<div class="eco-task">' + A.professor('mini') + '<div><b>Задание профессора Эко</b><br>' + (t ? esc(t.t) : 'Все задания главы выполнены!') + '</div></div>' +
      '</div></div>';
    var el = U.panel('Лаборатория', html, 'wide');
    el.querySelectorAll('.ritem').forEach(function (b) { b.onclick = function () { U.openLab(b.getAttribute('data-r')); }; });
    var go = $('#r-go', el);
    if (go) go.onclick = function () {
      if (r.optional) { if (S.s.science < r.sciCost) return; S.s.science -= r.sciCost; }
      else if (!S.spendEnergy(r.energy || 0)) return;
      S.s.research[r.id] = true;
      S.s.stats.researchDone++;
      if (!r.optional) S.addScience(r.sci + (S.s.upgrades.labgear || 0));
      U.toast('Исследование завершено', r.name);
      if (!Q.event('research', r.id)) S.changed();
      U.refresh();
      U._labSel = null;
      U.openLab();
    };
    $('#lab-game', el).onclick = function () { EG.games.open('lab', labMode); };
  };

  U.openStation = function () {
    var t = Q.task();
    var mode = t && t.type === 'minigame' && t.game === 'sorting' ? t.mode : (S.s.level >= 9 ? 'hard' : 'full');
    var free = t && t.type === 'minigame' && t.game === 'sorting';
    var el = U.panel('Экологическая станция',
      '<div class="info-row"><div class="info-art">' + A.svg('680 640 240 210', A.station(700, 830, 200)) + '</div><div>' +
      '<p>Здесь отходы распределяют по пяти категориям: пластик, бумага, стекло, металл и органика. Правильно рассортированное сырьё отправляется на переработку.</p>' +
      '<p>Пройдено циклов сортировки: <b>' + S.s.stats.sortGames + '</b></p>' +
      '<button class="btn" id="st-go"' + (!free && S.s.energy < 2 ? ' disabled' : '') + '>Запустить цикл сортировки ' + (free ? '(задание)' : '(2 ⚡)') + '</button>' +
      (!free && S.s.energy < 2 ? '<div class="err">Не хватает энергии</div>' : '') +
      '</div></div>');
    $('#st-go', el).onclick = function () {
      if (!free && !S.spendEnergy(2)) return;
      EG.games.open('sorting', mode);
    };
  };

  U.openBiogas = function () {
    var on = S.producing();
    var el = U.panel('Биогазовая установка',
      '<div class="info-row"><div class="info-art">' + A.svg('790 1060 180 150', A.biogas(800, 1205, 160, on)) + '</div><div>' +
      '<p>Закрытый реактор, в котором бактерии без доступа кислорода перерабатывают органические отходы в биогаз. Установка оснащена датчиками давления, клапанами и системой защиты.</p>' +
      '<p>Статус: <b>' + (on ? 'работает · +1 ⚡ каждые 20 с' : 'не запущена — пройди обучение') + '</b></p>' +
      '<button class="btn" id="bg-go">Мини-игра «Энергия из органики»</button></div></div>');
    $('#bg-go', el).onclick = function () { var t = Q.task(); EG.games.open('biogas', t && t.game === 'biogas' ? t.mode : 'learn'); };
  };

  U.openStorage = function () {
    var cap = S.energyCap(), e = S.s.energy;
    var el = U.panel('Модуль хранения энергии',
      '<div class="info-row"><div class="info-art">' + A.svg('640 1090 140 130', A.storage(650, 1205, 120, e / cap)) + '</div><div>' +
      '<p>Накопитель запасает энергию, пока она не нужна, и отдаёт её домам в часы высокого потребления.</p>' +
      '<div class="meter"><i style="width:' + (e / cap * 100) + '%"></i><span>' + e + ' / ' + cap + ' ⚡</span></div>' +
      '<button class="btn" id="sg-go">Мини-игра «Энергосеть»</button></div></div>');
    $('#sg-go', el).onclick = function () { var t = Q.task(); EG.games.open('grid', t && t.game === 'grid' ? t.mode : 'replay'); };
  };

  U.openHouse = function (b) {
    var r = !!S.s.restored[b.id], cost = S.restoreCost(b);
    var el = U.panel(b.name,
      '<div class="info-row"><div class="info-art">' + A.svg((b.x - 20) + ' ' + (b.y - 150) + ' ' + (b.w + 40) + ' 165', r ? A.house(b.id, b.x, b.y, b.w, true) : '<g filter="url(#hg)">' + A.house(b.id, b.x, b.y, b.w, false) + '</g><defs><filter id="hg"><feColorMatrix type="saturate" values=".12"/></filter></defs>') + '</div><div>' +
      '<p>Состояние: <b>' + (r ? 'восстановлен — жители вернулись' : 'заброшен: разбитые окна, заколоченная дверь') + '</b></p>' +
      (r ? '<p>На крыше установлена солнечная панель, в окнах горит свет.</p>' :
        '<p>Ремонт с повторным использованием материалов. Стоимость <span class="tag">предв.</span>: <b>' + fmt(cost) + '</b> монет.</p>' +
        '<button class="btn" id="h-go"' + (S.s.coins < cost ? ' disabled' : '') + '>Восстановить за ' + fmt(cost) + '</button>' + (S.s.coins < cost ? '<div class="err">Не хватает монет</div>' : '')) +
      '</div></div>');
    var go = $('#h-go', el);
    if (go) go.onclick = function () {
      if (S.s.coins < cost) return;
      S.s.coins -= cost; S.s.restored[b.id] = true;
      U.closePanel();
      U.toast(b.name + ' восстановлен!', 'Город стал чище');
      if (!Q.event('restore')) { S.changed(); Q.checkInstant(); }
      Q.checkAch(); U.refresh();
    };
  };

  // Профиль
  U.openProfile = function () {
    var c = charData(), lv = Q.level(), ch = chapterOf(S.s.level), cl = Math.round(S.cleanliness() * 100), st = S.s.stats;
    var el = U.panel('Профиль игрока',
      '<div class="profile"><div class="pava">' + A.character(c) + '</div><div class="pdata">' +
      '<div class="pn"><input id="p-nick" maxlength="16" value="' + esc(S.s.nick) + '"><button class="btn small ghost" id="p-save">Сохранить</button></div>' +
      '<p>' + c.name + ' <span class="tag">имя предв.</span> — ' + esc(c.title.toLowerCase()) + '</p>' +
      '<p>Уровень <b>' + S.s.level + '</b> из 50 · Глава ' + roman(ch.num) + ' «' + ch.name + '»</p>' +
      '<div class="meter"><i style="width:' + Math.min(100, S.s.xp / Q.xpNeeded() * 100) + '%"></i><span>Опыт: ' + S.s.xp + ' / ' + Q.xpNeeded() + '</span></div>' +
      '<div class="meter green"><i style="width:' + cl + '%"></i><span>Чистота стартовой территории: ' + cl + '%</span></div>' +
      '<div class="stats"><div><b>' + fmt(st.coinsEarned) + '</b>заработано монет</div><div><b>' + st.piles + '</b>убрано куч</div><div><b>' + S.s.placed.length + '</b>предметов в городе</div>' +
      '<div><b>' + Object.keys(S.s.restored).length + '</b>домов восстановлено</div><div><b>' + st.researchDone + '</b>исследований</div><div><b>' + st.minigames + '</b>мини-игр</div></div>' +
      '<button class="btn ghost" id="p-set">' + I.gear + ' Настройки</button></div></div>', 'wide');
    $('#p-save', el).onclick = function () {
      var v = $('#p-nick', el).value.trim();
      if (v.length < 2) return U.toast('Ник — от 2 символов', '');
      S.s.nick = v; S.changed(); U.refresh(); U.toast('Ник сохранён', v);
    };
    $('#p-set', el).onclick = U.openSettings;
  };

  // Задания
  U.openQuests = function () {
    var html = D.chapters.map(function (ch) {
      var open = S.s.level >= ch.from && S.s.level <= ch.to;
      var lvls = D.levels.slice(ch.from - 1, ch.to).map(function (lv) {
        var state = lv.n < S.s.level ? 'done' : lv.n === S.s.level ? 'cur' : 'next';
        var tasks = lv.tasks.map(function (t, i) {
          var d = state === 'done' || (state === 'cur' && i < S.s.taskIndex);
          var c = state === 'cur' && i === S.s.taskIndex;
          return '<li class="' + (d ? 'd' : '') + (c ? ' c' : '') + '">' + (d ? I.check : '') + esc(t.t) + '</li>';
        }).join('');
        var spec = D.levelSpecials[lv.n] ? '<div class="spec">🎁 ' + esc(D.levelSpecials[lv.n]) + '</div>' : '';
        return '<div class="lvl ' + state + '"><div class="lh"><span>Ур. ' + lv.n + ' · ' + esc(lv.title) + '</span><em>' + I.coin + fmt(lv.coins) + '</em></div>' +
          (state === 'cur' || ch.num === 1 ? '<ul>' + tasks + '</ul>' + spec : '') +
          (!lv.playable && state !== 'done' ? '<div class="soon">в следующей версии</div>' : '') + '</div>';
      }).join('');
      return '<details class="chapter"' + (open ? ' open' : '') + '><summary><b>Глава ' + roman(ch.num) + '. ' + ch.name + '</b> <span>уровни ' + ch.from + '–' + ch.to + '</span></summary>' +
        '<p class="muted">' + ch.desc + '</p>' + lvls + '</details>';
    }).join('');
    U.panel('Задания', html + '<p class="muted small">Общая сумма наград за 50 уровней — 127 500 монет (уровень × 100).</p>', 'wide');
  };

  U.openAchievements = function () {
    var html = '<div class="grid ach">' + D.achievements.map(function (a) {
      var got = S.s.achievements[a.id];
      return '<div class="card achv' + (got ? ' got' : '') + '"><div class="aic">' + I.ach + '</div><div class="nm">' + esc(a.name) + '</div><div class="ds">' + esc(a.desc) + '</div>' +
        '<div class="pr">' + I.coin + '<b>' + a.reward.coins + '</b></div>' + (got ? '<div class="owned">получено</div>' : a.future ? '<div class="pnote">в следующих главах</div>' : '') + '</div>';
    }).join('') + '</div>';
    U.panel('Достижения', html, 'wide');
  };

  U.openSettings = function () {
    var el = U.panel('Настройки',
      '<div class="settings">' +
      '<p>Прогресс сохраняется автоматически в этом браузере.</p>' +
      '<h4>Перенос сохранения</h4><p class="muted small">Скопируй код и вставь его на другом устройстве.</p>' +
      '<textarea id="s-code" rows="3" placeholder="Код сохранения"></textarea>' +
      '<div class="row"><button class="btn small" id="s-exp">Получить код</button><button class="btn small ghost" id="s-imp">Загрузить код</button></div>' +
      '<h4>Сброс</h4><button class="btn small danger" id="s-reset">Начать игру заново</button>' +
      '<p class="muted small">ECOGEN · версия 0.1 (Глава I). Подробности решений — в DESIGN.md.</p></div>');
    $('#s-exp', el).onclick = function () {
      var ta = $('#s-code', el); ta.value = S.exportCode(); ta.select();
      try { navigator.clipboard.writeText(ta.value); U.toast('Код скопирован', ''); } catch (e) { /* выделен вручную */ }
    };
    $('#s-imp', el).onclick = function () {
      try { S.importCode($('#s-code', el).value); U.closePanel(); U.startGame(); U.toast('Сохранение загружено', ''); }
      catch (e) { U.toast('Код не подходит', 'Проверь, что скопирован целиком'); }
    };
    $('#s-reset', el).onclick = function () {
      U.confirm('Удалить весь прогресс и начать заново? Это нельзя отменить.', function () { S.reset(); U.closePanel(); U.showStart(); });
    };
  };

  U.confirm = function (text, yes) {
    var r = $('#confirm-root');
    r.innerHTML = '<div class="overlay top"><div class="panel narrow"><div class="panel-body"><p>' + esc(text) + '</p><div class="row"><button class="btn ghost" id="c-no">Отмена</button><button class="btn danger" id="c-yes">Да</button></div></div></div></div>';
    $('#c-no').onclick = function () { r.innerHTML = ''; };
    $('#c-yes').onclick = function () { r.innerHTML = ''; yes(); };
  };

  // ───────── диалоги ─────────
  var dlgOpen = false;
  U.dialogOpen = function () { return dlgOpen; };
  U.dialog = function (id, cb) {
    var d = D.dialogs[id];
    U.dialogLines(d.lines, function () {
      if (d.effect === 'starterKit') {
        var kit = D.starterKit;
        Object.keys(kit.items).forEach(function (k) { S.s.inventory[k] = (S.s.inventory[k] || 0) + kit.items[k]; });
        kit.flags.forEach(function (f) { S.s.flags[f] = true; });
        U.toast('Стартовый набор получен', '2 контейнера и перчатки');
      }
      if (id === 'district_open') S.s.flags.chapter2Pending = true;
      var adv = Q.event('dialog', id);
      if (!adv) S.changed();
      if (cb) cb();
      U.refresh();
    });
  };
  U.dialogLines = function (lines, done) {
    U.closePanel();
    dlgOpen = true;
    var i = 0, root = $('#dialog-root');
    var names = { eco: 'Профессор Эко', bait: 'Байт', player: S.s.nick };
    function show() {
      var l = lines[i];
      var fem = charData().id === 'aliya' || charData().id === 'mira';
      var text = l.text.replace('{name}', S.s.nick).replace(/\{а\}/g, fem ? 'а' : '');
      root.innerHTML = '<div class="dlg-ov"><div class="dlg ' + l.who + '"><div class="dlg-por">' + A.portraitOf(l.who) + '</div>' +
        '<div class="dlg-box"><div class="dlg-name">' + esc(names[l.who]) + '</div><p>' + esc(text) + '</p>' +
        '<button class="btn small" id="d-nx">' + (i < lines.length - 1 ? 'Далее' : 'Понятно') + '</button></div></div></div>';
      $('#d-nx').onclick = function (e) { e.stopPropagation(); next(); };
      $('.dlg-ov').onclick = next;
    }
    function next() {
      i++;
      if (i < lines.length) return show();
      root.innerHTML = ''; dlgOpen = false;
      if (done) done();
      U.maybeAutoDialog();
    }
    show();
  };

  U.onTaskChanged = function () { U.refresh(); U.maybeAutoDialog(); };
  U.maybeAutoDialog = function () {
    clearTimeout(U._autoT);
    U._autoT = setTimeout(function () {
      if (dlgOpen || U.panelOpen() || $('#levelup-root').innerHTML || EG.games.active) return;
      if (S.s.flags.chapter2Pending && S.s.level >= 11) { S.s.flags.chapter2Pending = false; S.save(); return U.dialog('chapter2_soon'); }
      var t = Q.task();
      if (t && t.type === 'dialog') U.dialog(t.dialog);
    }, 600);
  };

  // ───────── уведомления ─────────
  U.toast = function (title, sub, kind) {
    var root = $('#toasts');
    var el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.innerHTML = (kind === 'bait' ? '<div class="t-ava">' + A.bait() + '</div>' : '') + '<div><b>' + esc(title) + '</b>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</div>';
    root.appendChild(el);
    while (root.children.length > 2) root.removeChild(root.firstChild);
    setTimeout(function () { el.classList.add('out'); }, kind === 'bait' ? 3800 : 2600);
    setTimeout(function () { el.remove(); }, kind === 'bait' ? 4200 : 3000);
  };

  U.floatRes = function (kind, n) {
    var pill = $('#r-' + kind);
    if (!pill) return;
    var f = document.createElement('div');
    f.className = 'float-res';
    f.textContent = (n > 0 ? '+' : '') + n;
    pill.appendChild(f);
    pill.classList.add('bump');
    setTimeout(function () { f.remove(); pill.classList.remove('bump'); }, 1100);
  };

  U.showLevelUp = function (lv, coins, unlocks, cb) {
    var root = $('#levelup-root');
    var conf = '';
    for (var i = 0; i < 24; i++) conf += '<i style="left:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 0.6) + 's;background:' + ['#3e9f4c', '#ffc83d', '#4fd1ff', '#e84393'][i % 4] + '"></i>';
    root.innerHTML = '<div class="overlay top"><div class="confetti">' + conf + '</div><div class="panel narrow levelup"><div class="panel-body">' +
      '<div class="lu-badge">' + S.s.level + '</div><h2>Уровень ' + lv.n + ' пройден!</h2><p class="muted">«' + esc(lv.title) + '»</p>' +
      '<div class="lu-rew"><div>' + I.coin + ' <b>+' + fmt(coins) + '</b> монет</div>' +
      unlocks.map(function (u) { return '<div>🎁 ' + esc(u) + '</div>'; }).join('') + '</div>' +
      '<button class="btn big" id="lu-ok">Отлично!</button></div></div></div>';
    U.refresh();
    $('#lu-ok').onclick = function () { root.innerHTML = ''; if (cb) cb(); };
  };

  EG.ui = U;
})();
