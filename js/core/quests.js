// Движок заданий: события → прогресс задач → повышение уровня и награды.
(function () {
  var S = EG.state;

  EG.shop = {
    item: function (id) {
      var list = EG.data.shopItems;
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    },
    matches: function (spec, itemId) {
      if (spec === 'any') return true;
      if (spec.indexOf('cat:') === 0) { var it = EG.shop.item(itemId); return it && it.cat === spec.slice(4); }
      return spec === itemId;
    },
    buy: function (id) {
      var it = EG.shop.item(id);
      if (!it || it.price == null || S.s.level < it.unlockLevel) return false;
      if (S.s.coins < it.price) return false;
      S.s.coins -= it.price;
      S.s.stats.bought++;
      if (it.kind === 'upgrade') S.s.upgrades[id] = (S.s.upgrades[id] || 0) + 1;
      else S.s.inventory[id] = (S.s.inventory[id] || 0) + 1;
      Q.event('buy', id);
      S.changed();
      return true;
    },
    place: function (id, slotId) {
      if (!S.s.inventory[id] || S.slotItem(slotId)) return false;
      S.s.inventory[id]--;
      if (!S.s.inventory[id]) delete S.s.inventory[id];
      S.s.placed.push({ slot: slotId, item: id, t: Date.now() });
      Q.unlockAch('first_buy');
      Q.event('place', id);
      Q.checkAch();
      S.changed();
      return true;
    }
  };

  var Q = {
    level: function () { return EG.data.levels[S.s.level - 1]; },
    task: function () {
      var lv = Q.level();
      return lv && lv.playable ? lv.tasks[S.s.taskIndex] || null : null;
    },
    xpNeeded: function () { var lv = Q.level(); return lv ? lv.xpTotal : 1; },

    // Событие от игрока. Возвращает true, если продвинуло текущую задачу.
    event: function (type, payload) {
      var t = Q.task();
      if (!t || t.type !== type) return false;
      var ok = false, amount = 1;
      switch (type) {
        case 'dialog': ok = payload === t.dialog; break;
        case 'tap': ok = payload === t.target; break;
        case 'research': ok = payload === t.topic; break;
        case 'minigame': ok = payload.game === t.game && (!t.mode || payload.mode === t.mode) && payload.success; break;
        case 'buy': ok = EG.shop.matches(t.item, payload); break;
        case 'place': ok = EG.shop.matches(t.item, payload); break;
        case 'collect': ok = t.kind === 'any' || t.kind === payload; break;
        case 'deliver': ok = true; amount = payload; break;
        case 'restore': ok = true; break;
        default: ok = false;
      }
      if (!ok) return false;
      if (t.count) {
        S.s.taskProg += amount;
        if (S.s.taskProg < t.count) { S.changed(); return true; }
      }
      Q.complete();
      return true;
    },

    // Проверка задач, которые могут быть выполнены «сами» (накопления, уборка)
    checkInstant: function () {
      var t = Q.task();
      if (!t) return;
      if (t.type === 'auto') return Q.complete();
      if (t.type === 'earn') {
        S.s.taskProg = Math.min(t.count, S.s.levelStats[t.res] || 0);
        if (S.s.taskProg >= t.count) return Q.complete();
      }
      if (t.type === 'clearAll' && S.remainingPiles().length === 0) return Q.complete();
      if (t.type === 'restore') {
        var n = Object.keys(S.s.restored).length;
        if (n >= t.count) return Q.complete();
      }
    },

    complete: function () {
      var t = Q.task();
      if (!t) return;
      S.s.xp += t.xp;
      S.s.taskIndex++;
      S.s.taskProg = 0;
      Q.unlockAch('first_step');
      EG.ui && EG.ui.toast('✔ ' + t.t, '+' + t.xp + ' XP');
      var lv = Q.level();
      if (S.s.taskIndex >= lv.tasks.length) {
        Q.levelUp();
      } else {
        S.changed();
        Q.checkInstant();
        EG.ui && EG.ui.onTaskChanged();
      }
    },

    levelUp: function () {
      var lv = Q.level();
      var reward = lv.coins;
      S.addCoins(reward, true);
      S.s.level++;
      S.s.taskIndex = 0; S.s.taskProg = 0; S.s.xp = 0;
      S.s.levelStats = {};
      var n = S.s.level;
      var unlocks = [];
      if (EG.data.levelSpecials[n]) unlocks.push(EG.data.levelSpecials[n]);
      EG.data.world.buildings.forEach(function (b) { if (b.unlockLevel === n) unlocks.push('Здание: ' + b.name); });
      EG.data.world.districts.forEach(function (d) { if (d.unlockLevel === n && n > 1) unlocks.push('Район: ' + d.name); });
      if (n === 2) Q.unlockAch('researcher');
      if (n === 6) S.s.energy = Math.min(S.energyCap(), S.s.energy + 20);
      S.changed();
      EG.ui && EG.ui.showLevelUp(lv, reward, unlocks, function () {
        Q.checkAch();
        Q.checkInstant();
        EG.ui.onTaskChanged();
      });
    },

    // ── достижения ──
    unlockAch: function (id) {
      if (S.s.achievements[id]) return;
      var a = EG.data.achievements.filter(function (x) { return x.id === id; })[0];
      if (!a) return;
      S.s.achievements[id] = Date.now();
      if (a.reward && a.reward.coins) S.addCoins(a.reward.coins, true);
      EG.ui && EG.ui.toast('🏆 Достижение: ' + a.name, '+' + a.reward.coins + ' монет', 'ach');
    },
    checkAch: function () {
      if (S.s.stats.sortGames >= 3) Q.unlockAch('sort_master');
      if (S.cleanliness() >= 0.8) Q.unlockAch('green_district');
      if (S.s.flags.gridDone) Q.unlockAch('energetic');
      if (S.s.level >= 2) Q.unlockAch('researcher');
    },

    // Итог мини-игры: награды и событие для задания
    minigameDone: function (game, mode, result) {
      S.s.stats.minigames++;
      if (game === 'sorting') S.s.stats.sortGames++;
      if (game === 'grid' && result.success) S.s.flags.gridDone = true;
      if (game === 'biogas' && result.success) S.s.flags.biogasOn = true;
      if (result.correct) S.s.levelStats.sortedRight = (S.s.levelStats.sortedRight || 0) + (game === 'sorting' ? result.correct : 0);
      var coins = Math.round((result.coins || 0) * S.gameCoinMult());
      if (coins) S.addCoins(coins);
      if (result.science) S.addScience(result.science);
      var advanced = Q.event('minigame', { game: game, mode: mode, success: result.success });
      Q.checkAch();
      if (!advanced) { S.changed(); Q.checkInstant(); }
      else Q.checkInstant();
      EG.ui && EG.ui.refresh();
    }
  };

  EG.quests = Q;
})();
