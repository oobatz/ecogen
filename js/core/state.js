// Состояние игры, ресурсы, сохранение в localStorage (версионированное).
(function () {
  var KEY = 'ecogen.save';
  var VERSION = 1;
  var listeners = [];

  function fresh() {
    return {
      v: VERSION,
      created: Date.now(),
      nick: '', char: null, introSeen: false,
      level: 1, taskIndex: 0, taskProg: 0, xp: 0,
      coins: 0, energy: 15, science: 0,
      inventory: {},          // itemId -> count (не размещено)
      placed: [],             // {slot, item, t}
      removedPiles: [],       // id куч
      foundOrganic: false,
      carried: 0,             // органика в руках (ур. 8)
      restored: {},           // houseId -> true
      research: {},           // topicId -> true
      achievements: {},       // id -> время получения
      upgrades: {},           // itemId -> count
      flags: {},
      levelStats: {},         // накопления в пределах текущего уровня (earn)
      stats: { sortGames: 0, minigames: 0, bought: 0, coinsEarned: 0, piles: 0, researchDone: 0 },
      lastTick: Date.now()
    };
  }

  // Миграции между версиями сохранения: добавляем новые поля, не теряя прогресс
  function migrate(s) {
    var base = fresh();
    Object.keys(base).forEach(function (k) { if (s[k] === undefined) s[k] = base[k]; });
    Object.keys(base.stats).forEach(function (k) { if (s.stats[k] === undefined) s.stats[k] = 0; });
    s.v = VERSION;
    return s;
  }

  var S = {
    s: null,
    has: function () { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } },
    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        S.s = raw ? migrate(JSON.parse(raw)) : fresh();
      } catch (e) { S.s = fresh(); }
      return S.s;
    },
    reset: function () { S.s = fresh(); S.save(); },
    save: function () {
      S.s.lastTick = Date.now();
      try { localStorage.setItem(KEY, JSON.stringify(S.s)); } catch (e) { /* приватный режим */ }
    },
    exportCode: function () {
      return btoa(unescape(encodeURIComponent(JSON.stringify(S.s))));
    },
    importCode: function (code) {
      var obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!obj || typeof obj.level !== 'number') throw new Error('bad');
      S.s = migrate(obj); S.save(); S.changed();
    },
    on: function (fn) { listeners.push(fn); },
    changed: function () { S.save(); listeners.forEach(function (fn) { fn(); }); },

    // ── ресурсы ──
    energyCap: function () {
      var cap = S.s.level >= 6 ? 60 : 20;
      cap += (S.s.upgrades.battery || 0) * 20;
      if (S.s.research.energy_saving) cap += 20;
      return cap;
    },
    producing: function () { return S.s.level >= 6 || !!S.s.flags.biogasOn; },
    addCoins: function (n, silent) {
      S.s.coins += n; if (n > 0) S.s.stats.coinsEarned += n;
      if (!silent && n) EG.ui && EG.ui.floatRes('coins', n);
    },
    addScience: function (n) {
      if (!n) return;
      S.s.science += n;
      S.s.levelStats.science = (S.s.levelStats.science || 0) + n;
      EG.ui && EG.ui.floatRes('science', n);
    },
    spendEnergy: function (n) {
      if (S.s.energy < n) return false;
      S.s.energy -= n; return true;
    },
    addEnergy: function (n) { S.s.energy = Math.min(S.energyCap(), S.s.energy + n); },
    gameCoinMult: function () { return S.s.research.compost_basics ? 1.1 : 1; },

    // Энергия копится и пока игра закрыта (до лимита)
    tickEnergy: function () {
      var now = Date.now();
      if (!S.producing()) { S.s.lastTick = now; return false; }
      var gained = Math.floor((now - S.s.lastTick) / 20000);
      if (gained > 0) {
        var before = S.s.energy;
        S.addEnergy(gained);
        S.s.lastTick += gained * 20000;
        return S.s.energy !== before;
      }
      return false;
    },

    // ── город ──
    pileGone: function (id) { return S.s.removedPiles.indexOf(id) >= 0; },
    remainingPiles: function (kind) {
      return EG.data.world.piles.filter(function (p) {
        return !S.pileGone(p.id) && (!kind || p.kind === kind);
      });
    },
    slotItem: function (slotId) {
      for (var i = 0; i < S.s.placed.length; i++) if (S.s.placed[i].slot === slotId) return S.s.placed[i];
      return null;
    },
    restoreCost: function (b) {
      return Math.round(b.restoreCost * (S.s.research.eco_design ? 0.8 : 1));
    },
    // Чистота стартового района, 0..1
    cleanliness: function () {
      var w = EG.data.world;
      var piles = S.s.removedPiles.length / w.piles.length;
      var greenPts = 0;
      S.s.placed.forEach(function (p) {
        var it = EG.shop.item(p.item);
        greenPts += (it && it.green) ? it.green : (it && it.grows ? 2 : 0.6);
      });
      var items = Math.min(1, greenPts / 10);
      var houses = w.buildings.filter(function (b) { return b.house; });
      var rest = houses.filter(function (b) { return S.s.restored[b.id]; }).length / houses.length;
      return Math.min(1, piles * 0.5 + items * 0.25 + rest * 0.25);
    }
  };

  EG.state = S;
})();
