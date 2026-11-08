// Векторная графика ECOGEN в едином мультяшном стиле.
(function () {
  var A = {};
  var OUT = '#2b3a33'; // общий цвет контура

  A.svg = function (vb, inner, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + (cls ? ' class="' + cls + '"' : '') + '>' + inner + '</svg>';
  };

  // ───────────── Персонажи (viewBox 0 0 200 220) ─────────────
  function shirtIcon(kind) {
    if (kind === 'eco') return '<circle cx="100" cy="194" r="13" fill="#3e9f4c"/><path d="M93 199 Q92 186 107 184 Q108 197 93 199Z" fill="#fff"/><path d="M95 198 L104 188" stroke="#3e9f4c" stroke-width="1.6"/>';
    if (kind === 'leaf') return '<path d="M90 202 Q88 182 112 180 Q113 200 90 202Z" fill="#6fcf73"/><path d="M92 200 L108 184" stroke="#2d7b39" stroke-width="2"/>';
    if (kind === 'space') return '<circle cx="100" cy="194" r="9" fill="#7a4cc2"/><ellipse cx="100" cy="194" rx="16" ry="5" fill="none" stroke="#f2b705" stroke-width="2.5" transform="rotate(-18 100 194)"/><circle cx="116" cy="182" r="2" fill="#f2b705"/>';
    return '';
  }

  function backHair(h) {
    if (h.style === 'long') return '<path d="M50 100 Q46 36 100 34 Q154 36 150 100 L158 196 Q130 212 100 206 Q70 212 42 196 Z" fill="' + h.color + '"/>';
    if (h.style === 'ponytail') return '<path d="M136 62 Q190 66 184 128 Q180 162 162 178 Q170 136 146 104 Z" fill="' + h.color + '"/><path d="M146 104 Q160 120 162 150" stroke="' + h.shade + '" stroke-width="3" fill="none"/><ellipse cx="141" cy="66" rx="8" ry="10" fill="#7a4cc2"/>';
    if (h.style === 'wavy') return '<ellipse cx="100" cy="94" rx="54" ry="54" fill="' + h.color + '"/>';
    return '<ellipse cx="100" cy="92" rx="50" ry="50" fill="' + h.color + '"/>';
  }

  function frontHair(h) {
    var c = h.color, sh = h.shade;
    if (h.style === 'long') return '<path d="M52 98 Q48 48 100 44 Q152 48 150 98 Q140 68 116 64 Q98 84 70 76 Q58 84 52 98 Z" fill="' + c + '"/>' +
      '<path d="M54 92 Q42 132 56 172 L66 168 Q58 132 64 98 Z" fill="' + c + '"/><path d="M146 92 Q158 132 144 172 L134 168 Q142 132 136 98 Z" fill="' + c + '"/>' +
      '<path d="M76 58 Q96 52 118 62" stroke="' + sh + '" stroke-width="2.5" fill="none" opacity=".6"/>';
    if (h.style === 'messy') return '<path d="M50 100 Q44 52 80 44 L74 26 L94 40 L102 22 L114 40 L134 28 L130 48 Q156 60 150 100 Q146 76 128 70 L122 84 L108 68 L96 82 L84 68 L72 82 Q58 80 50 100 Z" fill="' + c + '"/>' +
      '<path d="M88 50 L96 62 M112 48 L116 60" stroke="' + sh + '" stroke-width="2.5"/>';
    if (h.style === 'ponytail') return '<path d="M52 98 Q48 44 100 42 Q152 44 150 98 Q146 66 126 58 Q100 50 74 60 Q56 70 52 98 Z" fill="' + c + '"/>' +
      '<path d="M70 62 Q96 50 132 62" stroke="' + sh + '" stroke-width="2.5" fill="none" opacity=".7"/>';
    if (h.style === 'wavy') {
      var s = '<path d="M50 102 Q46 56 100 48 Q154 56 150 102 Q144 74 120 70 Q100 64 80 70 Q56 74 50 102Z" fill="' + c + '"/>';
      [[56, 86], [62, 64], [80, 50], [100, 44], [120, 50], [138, 64], [146, 86], [92, 62], [112, 62]].forEach(function (p) {
        s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="' + c + '"/>';
      });
      s += '<path d="M76 70 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" stroke="' + sh + '" stroke-width="2.5" fill="none"/>';
      return s;
    }
    return '';
  }

  function face(skin, browColor) {
    return '<circle cx="53" cy="108" r="10" fill="' + skin + '"/><circle cx="147" cy="108" r="10" fill="' + skin + '"/>' +
      '<ellipse cx="100" cy="100" rx="46" ry="50" fill="' + skin + '"/>' +
      '<ellipse cx="82" cy="106" rx="7.5" ry="8.5" fill="#fff"/><ellipse cx="118" cy="106" rx="7.5" ry="8.5" fill="#fff"/>' +
      '<circle cx="83" cy="107" r="5" fill="#3b2a20"/><circle cx="119" cy="107" r="5" fill="#3b2a20"/>' +
      '<circle cx="85" cy="105" r="1.8" fill="#fff"/><circle cx="121" cy="105" r="1.8" fill="#fff"/>' +
      '<path d="M73 93 Q82 88 90 92 M110 92 Q118 88 127 93" stroke="' + browColor + '" stroke-width="3.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M98 116 Q100 120 103 116" stroke="#c98b6a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<path d="M88 128 Q100 139 112 128" stroke="#8a3b2e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="70" cy="123" rx="7" ry="4" fill="#ff8a8a" opacity=".35"/><ellipse cx="130" cy="123" rx="7" ry="4" fill="#ff8a8a" opacity=".35"/>';
  }

  A.characterInner = function (c) {
    var h = c.hair, s = '';
    s += backHair(h);
    // туловище
    s += '<path d="M28 220 Q30 166 72 156 L128 156 Q170 166 172 220 Z" fill="' + c.jacket + '"/>';
    s += '<path d="M78 157 L122 157 L114 220 L86 220 Z" fill="' + c.shirt + '"/>';
    s += '<path d="M78 157 L92 186 L86 220 M122 157 L108 186 L114 220" stroke="' + c.jacketShade + '" stroke-width="3" fill="none"/>';
    s += shirtIcon(c.shirtIcon);
    if (c.extras.indexOf('backpack') >= 0)
      s += '<path d="M54 164 L66 160 L74 220 L60 220 Z" fill="#4e6b3a"/><path d="M146 164 L134 160 L126 220 L140 220 Z" fill="#4e6b3a"/>' +
           '<rect x="62" y="196" width="12" height="7" rx="2" fill="#c9a24c"/><rect x="126" y="196" width="12" height="7" rx="2" fill="#c9a24c"/>';
    s += '<rect x="86" y="138" width="28" height="26" rx="9" fill="' + c.skin + '"/><path d="M86 150 Q100 158 114 150" stroke="#000" stroke-opacity=".12" stroke-width="5" fill="none"/>';
    if (c.extras.indexOf('headphones') >= 0)
      s += '<path d="M66 166 Q100 192 134 166" stroke="#1d1f24" stroke-width="7" fill="none" stroke-linecap="round"/>' +
           '<rect x="56" y="152" width="18" height="26" rx="8" fill="#1d1f24"/><rect x="126" y="152" width="18" height="26" rx="8" fill="#1d1f24"/>' +
           '<rect x="60" y="158" width="10" height="14" rx="4" fill="#6fcf73"/><rect x="130" y="158" width="10" height="14" rx="4" fill="#6fcf73"/>';
    s += face(c.skin, h.shade);
    s += frontHair(h);
    return s;
  };
  A.character = function (c, cls) { return A.svg('0 0 200 220', A.characterInner(c), cls); };

  A.professorInner = function () {
    var skin = '#f0c6a0';
    return '<path d="M26 220 Q28 164 72 154 L128 154 Q172 164 174 220 Z" fill="#f8fafb" stroke="#cfd8dc" stroke-width="2"/>' +
      '<path d="M80 155 L120 155 L108 200 L92 200 Z" fill="#3e9f4c"/>' +
      '<path d="M80 155 L96 196 L84 220 M120 155 L104 196 L116 220" stroke="#cfd8dc" stroke-width="3" fill="none"/>' +
      '<rect x="128" y="182" width="22" height="16" rx="3" fill="none" stroke="#cfd8dc" stroke-width="2"/>' +
      '<path d="M132 194 Q132 182 146 180 Q146 192 132 194Z" fill="#3e9f4c"/>' +
      '<rect x="86" y="136" width="28" height="24" rx="9" fill="' + skin + '"/>' +
      '<circle cx="53" cy="104" r="10" fill="' + skin + '"/><circle cx="147" cy="104" r="10" fill="' + skin + '"/>' +
      '<ellipse cx="100" cy="98" rx="46" ry="50" fill="' + skin + '"/>' +
      '<path d="M54 102 Q48 60 70 52 Q62 76 64 100 Z M146 102 Q152 60 130 52 Q138 76 136 100 Z" fill="#dfe3e8"/>' +
      '<path d="M84 52 Q100 40 116 52 Q100 48 84 52Z" fill="#dfe3e8"/>' +
      '<path d="M58 108 Q60 160 100 168 Q140 160 142 108 Q134 142 100 144 Q66 142 58 108Z" fill="#e6e9ed"/>' +
      '<path d="M80 128 Q100 120 120 128 Q110 136 100 131 Q90 136 80 128Z" fill="#d5dadf"/>' +
      '<path d="M90 134 Q100 140 110 134" stroke="#9b4a3a" stroke-width="2.5" fill="none"/>' +
      '<circle cx="82" cy="102" r="4.5" fill="#3b2a20"/><circle cx="118" cy="102" r="4.5" fill="#3b2a20"/>' +
      '<circle cx="82" cy="102" r="14" fill="#bfe6ff" fill-opacity=".25" stroke="#34495e" stroke-width="3.5"/>' +
      '<circle cx="118" cy="102" r="14" fill="#bfe6ff" fill-opacity=".25" stroke="#34495e" stroke-width="3.5"/>' +
      '<path d="M96 101 Q100 97 104 101" stroke="#34495e" stroke-width="3" fill="none"/>' +
      '<path d="M70 84 Q82 80 92 84 M108 84 Q118 80 130 84" stroke="#cdd2d8" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M98 112 Q100 117 103 112" stroke="#c98b6a" stroke-width="2" fill="none"/>';
  };
  A.professor = function (cls) { return A.svg('0 0 200 220', A.professorInner(), cls); };

  A.baitInner = function () {
    return '<ellipse cx="100" cy="212" rx="44" ry="7" fill="#000" opacity=".12"/>' +
      '<g class="bait-bob">' +
      '<line x1="100" y1="40" x2="100" y2="20" stroke="#9fb3c8" stroke-width="5"/><circle cx="100" cy="16" r="8" fill="#4fd1ff"/>' +
      '<rect x="56" y="136" width="88" height="64" rx="26" fill="#f4f8fb" stroke="#bcd3e6" stroke-width="3"/>' +
      '<rect x="56" y="158" width="88" height="12" fill="#4aa8e8"/>' +
      '<path d="M90 194 Q88 178 108 176 Q110 192 90 194Z" fill="#3e9f4c"/>' +
      '<rect x="34" y="146" width="20" height="38" rx="10" fill="#e3edf5" stroke="#bcd3e6" stroke-width="3"/>' +
      '<rect x="146" y="146" width="20" height="38" rx="10" fill="#e3edf5" stroke="#bcd3e6" stroke-width="3"/>' +
      '<rect x="42" y="38" width="116" height="94" rx="32" fill="#f4f8fb" stroke="#bcd3e6" stroke-width="3"/>' +
      '<rect x="56" y="52" width="88" height="64" rx="20" fill="#0f2338"/>' +
      '<ellipse cx="82" cy="82" rx="10" ry="13" fill="#4fd1ff"/><ellipse cx="118" cy="82" rx="10" ry="13" fill="#4fd1ff"/>' +
      '<circle cx="85" cy="77" r="3.5" fill="#e6fbff"/><circle cx="121" cy="77" r="3.5" fill="#e6fbff"/>' +
      '<path d="M88 102 Q100 110 112 102" stroke="#4fd1ff" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<rect x="36" y="70" width="10" height="24" rx="5" fill="#4aa8e8"/><rect x="154" y="70" width="10" height="24" rx="5" fill="#4aa8e8"/>' +
      '</g>';
  };
  A.bait = function (cls) { return A.svg('0 0 200 220', A.baitInner(), cls); };

  A.portraitOf = function (who) {
    if (who === 'eco') return A.professor();
    if (who === 'bait') return A.bait();
    var c = EG.data.characters.filter(function (x) { return x.id === EG.state.s.char; })[0] || EG.data.characters[0];
    return A.character(c);
  };

  // ───────────── Здания (координаты мира: x — левый край, y — земля) ─────────────
  function shadow(x, y, w) { return '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + 4) + '" rx="' + (w * 0.56) + '" ry="12" fill="#000" opacity=".16"/>'; }

  A.lab = function (x, y, w) {
    var h = 150, t = y - h;
    return shadow(x, y, w) +
      '<rect x="' + x + '" y="' + t + '" width="' + w + '" height="' + h + '" rx="6" fill="#e9f3f1" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (x - 6) + '" y="' + (t - 14) + '" width="' + (w + 12) + '" height="18" rx="5" fill="#2f8f63" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (x + w - 46) + '" y="' + (t - 44) + '" width="22" height="32" fill="#cfd8dc" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (x + 14) + '" y="' + (t + 22) + '" width="' + (w - 28) + '" height="56" rx="6" fill="#a6dcf0" stroke="' + OUT + '" stroke-width="3"/>' +
      '<line x1="' + (x + w / 2) + '" y1="' + (t + 22) + '" x2="' + (x + w / 2) + '" y2="' + (t + 78) + '" stroke="' + OUT + '" stroke-width="3"/>' +
      '<path d="M' + (x + 30) + ' ' + (t + 70) + ' l10 -22 l10 22 z" fill="#6fcf73" opacity=".8"/>' +
      '<rect x="' + (x + w / 2 - 18) + '" y="' + (y - 52) + '" width="36" height="52" rx="4" fill="#5d8a7a" stroke="' + OUT + '" stroke-width="3"/>' +
      '<circle cx="' + (x + 34) + '" cy="' + (y - 28) + '" r="16" fill="#fff" stroke="' + OUT + '" stroke-width="3"/>' +
      '<path d="M' + (x + 30) + ' ' + (y - 38) + ' h8 v6 l6 12 h-20 l6 -12 z" fill="#4fd1ff" stroke="' + OUT + '" stroke-width="2"/>';
  };

  A.shop = function (x, y, w) {
    var h = 135, t = y - h, s = shadow(x, y, w);
    s += '<rect x="' + x + '" y="' + t + '" width="' + w + '" height="' + h + '" rx="6" fill="#fff4e2" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<rect x="' + (x + 10) + '" y="' + (t + 8) + '" width="' + (w - 20) + '" height="24" rx="5" fill="#2f8f63" stroke="' + OUT + '" stroke-width="2.5"/>';
    s += '<text x="' + (x + w / 2) + '" y="' + (t + 26) + '" font-size="15" font-weight="800" fill="#fff" text-anchor="middle" font-family="Nunito,sans-serif">МАГАЗИН</text>';
    var n = 6, sw = (w + 16) / n;
    for (var i = 0; i < n; i++) {
      s += '<path d="M' + (x - 8 + i * sw) + ' ' + (t + 40) + ' h' + sw + ' v16 q' + (-sw / 2) + ' 12 ' + (-sw) + ' 0 z" fill="' + (i % 2 ? '#fff' : '#3e9f4c') + '" stroke="' + OUT + '" stroke-width="2"/>';
    }
    s += '<rect x="' + (x + 12) + '" y="' + (t + 66) + '" width="' + (w / 2 - 14) + '" height="50" rx="4" fill="#a6dcf0" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<circle cx="' + (x + 30) + '" cy="' + (t + 104) + '" r="8" fill="#6fcf73"/><rect x="' + (x + 44) + '" y="' + (t + 94) + '" width="12" height="18" fill="#f2b705"/>';
    s += '<rect x="' + (x + w / 2 + 12) + '" y="' + (y - 58) + '" width="' + (w / 2 - 26) + '" height="58" rx="4" fill="#8d6e63" stroke="' + OUT + '" stroke-width="3"/>';
    return s;
  };

  A.station = function (x, y, w) {
    var h = 130, t = y - h, s = shadow(x, y, w);
    s += '<path d="M' + (x - 8) + ' ' + (t + 26) + ' L' + (x + w / 2) + ' ' + (t - 10) + ' L' + (x + w + 8) + ' ' + (t + 26) + ' Z" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<rect x="' + x + '" y="' + (t + 24) + '" width="' + w + '" height="' + (h - 24) + '" fill="#dfe9e4" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<rect x="' + (x + 10) + '" y="' + (t + 50) + '" width="' + (w - 20) + '" height="' + (h - 50) + '" fill="#b7c9c0" stroke="' + OUT + '" stroke-width="2"/>';
    var cols = ['#2f80ed', '#f2b705', '#27ae60', '#8d5a2b'], cw = (w - 40) / 4;
    cols.forEach(function (c, i) {
      var cx = x + 16 + i * (cw + 3);
      s += '<rect x="' + cx + '" y="' + (y - 46) + '" width="' + cw + '" height="46" rx="4" fill="' + c + '" stroke="' + OUT + '" stroke-width="2.5"/>';
      s += '<rect x="' + (cx - 2) + '" y="' + (y - 52) + '" width="' + (cw + 4) + '" height="8" rx="3" fill="' + c + '" stroke="' + OUT + '" stroke-width="2"/>';
    });
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (t + 16) + '" r="14" fill="#fff" stroke="' + OUT + '" stroke-width="2.5"/>';
    s += A.recycleMark(x + w / 2, t + 16, 9, '#2f8f63');
    return s;
  };

  A.recycleMark = function (cx, cy, r, col) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      var a = i * 120;
      s += '<path d="M' + cx + ' ' + (cy - r) + ' l' + (r * 0.75) + ' ' + (r * 1.1) + ' h' + (-r * 0.5) + '" stroke="' + col + '" stroke-width="' + (r * 0.32) + '" fill="none" stroke-linecap="round" transform="rotate(' + a + ' ' + cx + ' ' + cy + ')"/>';
    }
    return s;
  };

  A.biogas = function (x, y, w, on) {
    var s = shadow(x, y, w);
    var dw = w * 0.62, dx = x + 6, base = y - 40;
    s += '<rect x="' + dx + '" y="' + base + '" width="' + dw + '" height="40" fill="#8fbf8a" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M' + dx + ' ' + base + ' Q' + (dx + dw / 2) + ' ' + (base - 90) + ' ' + (dx + dw) + ' ' + base + ' Z" fill="#6fae6c" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M' + (dx + 18) + ' ' + (base - 16) + ' Q' + (dx + dw / 2) + ' ' + (base - 60) + ' ' + (dx + dw - 30) + ' ' + (base - 30) + '" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none"/>';
    var gx = x + w * 0.7;
    s += '<rect x="' + gx + '" y="' + (y - 64) + '" width="' + (w * 0.28) + '" height="64" rx="10" fill="#cfd8dc" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M' + (dx + dw / 2) + ' ' + (base - 44) + ' V' + (y - 84) + ' H' + (gx + w * 0.14) + ' V' + (y - 64) + '" stroke="#90a4ae" stroke-width="7" fill="none" stroke-linejoin="round"/>';
    s += '<circle cx="' + (gx + w * 0.14) + '" cy="' + (y - 40) + '" r="10" fill="#fff" stroke="' + OUT + '" stroke-width="2.5"/>';
    s += '<line x1="' + (gx + w * 0.14) + '" y1="' + (y - 40) + '" x2="' + (gx + w * 0.14 + 6) + '" y2="' + (y - 46) + '" stroke="#e74c3c" stroke-width="2.5"/>';
    s += '<text x="' + (dx + dw / 2) + '" y="' + (y - 14) + '" font-size="16" font-weight="800" text-anchor="middle" fill="#fff" font-family="Nunito,sans-serif">CH₄</text>';
    if (on) s += '<circle cx="' + (gx + w * 0.14) + '" cy="' + (y - 68) + '" r="6" fill="#6fcf73"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>';
    return s;
  };

  A.storage = function (x, y, w, fill) {
    var h = 100, t = y - h, s = shadow(x, y, w);
    s += '<rect x="' + x + '" y="' + t + '" width="' + w + '" height="' + h + '" rx="10" fill="#34495e" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<rect x="' + (x + w / 2 - 14) + '" y="' + (t - 10) + '" width="28" height="12" rx="3" fill="#5d6d7e" stroke="' + OUT + '" stroke-width="2.5"/>';
    for (var i = 0; i < 4; i++) {
      var lit = fill > i / 4;
      s += '<rect x="' + (x + 14) + '" y="' + (y - 22 - i * 20) + '" width="' + (w - 28) + '" height="14" rx="3" fill="' + (lit ? '#6fcf73' : '#2c3e50') + '"/>';
    }
    s += '<path d="M' + (x + w - 26) + ' ' + (t + 10) + ' l-8 14 h7 l-4 12 l10 -16 h-7 z" fill="#f2b705"/>';
    return s;
  };

  var houseColors = { house1: ['#f6c38b', '#c0392b'], house2: ['#9fd3c7', '#2f8f63'], house3: ['#f7b2ad', '#8e44ad'] };
  A.house = function (id, x, y, w, restored) {
    var col = houseColors[id] || ['#f6c38b', '#c0392b'];
    var h = 92, t = y - h, s = shadow(x, y, w);
    s += '<rect x="' + x + '" y="' + t + '" width="' + w + '" height="' + h + '" fill="' + col[0] + '" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M' + (x - 10) + ' ' + (t + 2) + ' L' + (x + w / 2) + ' ' + (t - 44) + ' L' + (x + w + 10) + ' ' + (t + 2) + ' Z" fill="' + col[1] + '" stroke="' + OUT + '" stroke-width="3"/>';
    var win = restored ? '#ffe9a3' : '#3d4448';
    s += '<rect x="' + (x + 14) + '" y="' + (t + 14) + '" width="30" height="26" rx="3" fill="' + win + '" stroke="' + OUT + '" stroke-width="2.5"/>';
    s += '<rect x="' + (x + w - 44) + '" y="' + (t + 14) + '" width="30" height="26" rx="3" fill="' + win + '" stroke="' + OUT + '" stroke-width="2.5"/>';
    s += '<rect x="' + (x + w / 2 - 15) + '" y="' + (y - 44) + '" width="30" height="44" rx="3" fill="#8d6e63" stroke="' + OUT + '" stroke-width="2.5"/>';
    if (restored) {
      s += '<rect x="' + (x + 12) + '" y="' + (t + 40) + '" width="34" height="8" fill="#8d5a2b"/><circle cx="' + (x + 20) + '" cy="' + (t + 39) + '" r="4" fill="#e74c3c"/><circle cx="' + (x + 30) + '" cy="' + (t + 38) + '" r="4" fill="#f2b705"/><circle cx="' + (x + 40) + '" cy="' + (t + 39) + '" r="4" fill="#e74c3c"/>';
      s += '<rect x="' + (x + w / 2 - 24) + '" y="' + (t - 26) + '" width="48" height="16" fill="#2c3e50" stroke="#a6dcf0" stroke-width="2" transform="skewX(-10)"/>';
    } else {
      s += '<path d="M' + (x + 18) + ' ' + (t + 16) + ' l10 10 l-4 6 l12 6 M' + (x + w - 40) + ' ' + (t + 18) + ' l14 12 l-6 8" stroke="#bbb" stroke-width="1.8" fill="none"/>';
      s += '<path d="M' + (x + w / 2 - 20) + ' ' + (y - 34) + ' l40 12 M' + (x + w / 2 - 20) + ' ' + (y - 16) + ' l40 -10" stroke="#a1887f" stroke-width="7"/>';
      s += '<path d="M' + (x + w / 2 + 6) + ' ' + (t - 26) + ' l16 14 l-10 6 z" fill="#555"/>';
    }
    return s;
  };

  A.factory = function (x, y, smoke) {
    var s = '<rect x="' + x + '" y="' + (y - 80) + '" width="80" height="80" fill="#8b6f5e" stroke="' + OUT + '" stroke-width="3"/>' +
      '<path d="M' + x + ' ' + (y - 80) + ' l20 -18 v18 l20 -18 v18 l20 -18 v18 l20 -18 v18" fill="#7a5f50" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (x + 58) + '" y="' + (y - 150) + '" width="16" height="70" fill="#9e8170" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (x + 10) + '" y="' + (y - 50) + '" width="18" height="16" fill="#3d4448"/><rect x="' + (x + 40) + '" y="' + (y - 50) + '" width="18" height="16" fill="#3d4448"/>';
    if (smoke > 0.05) s += '<g opacity="' + smoke.toFixed(2) + '" class="smoke"><circle cx="' + (x + 68) + '" cy="' + (y - 165) + '" r="14" fill="#7f8080"/><circle cx="' + (x + 84) + '" cy="' + (y - 185) + '" r="18" fill="#8f9090"/><circle cx="' + (x + 104) + '" cy="' + (y - 205) + '" r="22" fill="#a0a0a0"/></g>';
    return s;
  };

  A.deadTree = function (x, y, green) {
    if (green) return A.item('tree', x, y);
    return '<path d="M' + x + ' ' + y + ' v-50 l-16 -22 M' + x + ' ' + (y - 40) + ' l14 -26 M' + x + ' ' + (y - 58) + ' l-4 -18" stroke="#7a5c45" stroke-width="7" fill="none" stroke-linecap="round"/>';
  };

  A.lockBadge = function (cx, cy, level) {
    return '<g class="lock-badge"><circle cx="' + cx + '" cy="' + cy + '" r="24" fill="#fff" stroke="' + OUT + '" stroke-width="3"/>' +
      '<rect x="' + (cx - 10) + '" y="' + (cy - 4) + '" width="20" height="15" rx="3" fill="#7f8c8d"/>' +
      '<path d="M' + (cx - 6) + ' ' + (cy - 4) + ' v-5 a6 6 0 0 1 12 0 v5" stroke="#7f8c8d" stroke-width="3.5" fill="none"/>' +
      '<rect x="' + (cx - 26) + '" y="' + (cy + 26) + '" width="52" height="22" rx="11" fill="#2b3a33"/>' +
      '<text x="' + cx + '" y="' + (cy + 42) + '" font-size="14" font-weight="800" fill="#fff" text-anchor="middle" font-family="Nunito,sans-serif">Ур. ' + level + '</text></g>';
  };

  // ───────────── Предметы на карте (cx — центр, y — земля) ─────────────
  A.item = function (id, cx, y, extra) {
    var s = '<ellipse cx="' + cx + '" cy="' + (y + 2) + '" rx="26" ry="7" fill="#000" opacity=".15"/>';
    switch (id) {
      case 'tree':
        return s + '<rect x="' + (cx - 6) + '" y="' + (y - 40) + '" width="12" height="40" fill="#8d5a2b" stroke="' + OUT + '" stroke-width="2"/>' +
          '<circle cx="' + (cx - 14) + '" cy="' + (y - 52) + '" r="20" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="' + (cx + 14) + '" cy="' + (y - 54) + '" r="20" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/>' +
          '<circle cx="' + cx + '" cy="' + (y - 72) + '" r="22" fill="#4fb85a" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="' + (cx - 6) + '" cy="' + (y - 78) + '" r="6" fill="#7ad67f"/>';
      case 'bush':
        return s + '<circle cx="' + (cx - 14) + '" cy="' + (y - 14) + '" r="15" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="' + (cx + 14) + '" cy="' + (y - 14) + '" r="15" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="' + cx + '" cy="' + (y - 26) + '" r="17" fill="#4fb85a" stroke="' + OUT + '" stroke-width="2.5"/>';
      case 'flowerbed': case 'flowers':
        var f = s + (id === 'flowerbed' ? '<ellipse cx="' + cx + '" cy="' + (y - 6) + '" rx="30" ry="11" fill="#8d6e63" stroke="' + OUT + '" stroke-width="2.5"/>' : '');
        var cols = ['#e74c3c', '#f2b705', '#e84393', '#fff', '#9b59b6'];
        for (var i = 0; i < 6; i++) {
          var fx = cx - 22 + i * 9, fy = y - 14 - (i % 2) * 8;
          f += '<line x1="' + fx + '" y1="' + (y - 6) + '" x2="' + fx + '" y2="' + fy + '" stroke="#2d7b39" stroke-width="2.5"/><circle cx="' + fx + '" cy="' + fy + '" r="5" fill="' + cols[i % 5] + '" stroke="' + OUT + '" stroke-width="1.5"/>';
        }
        return f;
      case 'seeds':
        var age = extra || 0;
        if (age >= 1) return A.item('tree', cx, y);
        var k = 0.4 + age * 0.6;
        return s + '<g transform="translate(' + cx + ' ' + y + ') scale(' + k.toFixed(2) + ')"><line x1="0" y1="0" x2="0" y2="-40" stroke="#2d7b39" stroke-width="4"/><path d="M0 -24 Q-22 -32 -20 -46 Q-2 -40 0 -24Z M0 -32 Q20 -42 20 -56 Q2 -50 0 -32Z" fill="#6fcf73" stroke="' + OUT + '" stroke-width="2"/></g>' +
          '<ellipse cx="' + cx + '" cy="' + (y - 2) + '" rx="14" ry="5" fill="#8d6e63"/>';
      case 'bin':
        return s + '<rect x="' + (cx - 16) + '" y="' + (y - 40) + '" width="32" height="40" rx="4" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/><rect x="' + (cx - 19) + '" y="' + (y - 46) + '" width="38" height="9" rx="3" fill="#2d7b39" stroke="' + OUT + '" stroke-width="2.5"/>' + A.recycleMark(cx, y - 20, 8, '#fff');
      case 'sepbin':
        var b = s, cc = ['#2f80ed', '#f2b705', '#27ae60'];
        cc.forEach(function (c, i) { b += '<rect x="' + (cx - 30 + i * 20) + '" y="' + (y - 34) + '" width="18" height="34" rx="3" fill="' + c + '" stroke="' + OUT + '" stroke-width="2"/>'; });
        return b;
      case 'bench':
        return s + '<rect x="' + (cx - 28) + '" y="' + (y - 30) + '" width="56" height="8" rx="2" fill="#a0522d" stroke="' + OUT + '" stroke-width="2"/><rect x="' + (cx - 28) + '" y="' + (y - 18) + '" width="56" height="7" rx="2" fill="#a0522d" stroke="' + OUT + '" stroke-width="2"/>' +
          '<rect x="' + (cx - 24) + '" y="' + (y - 12) + '" width="5" height="12" fill="#444"/><rect x="' + (cx + 19) + '" y="' + (y - 12) + '" width="5" height="12" fill="#444"/>';
      case 'lamp':
        return s + '<rect x="' + (cx - 3) + '" y="' + (y - 80) + '" width="6" height="80" fill="#34495e"/><path d="M' + (cx - 12) + ' ' + (y - 80) + ' h24 l-4 -12 h-16 z" fill="#2c3e50"/><circle cx="' + cx + '" cy="' + (y - 76) + '" r="7" fill="#ffe066"/><circle cx="' + cx + '" cy="' + (y - 76) + '" r="16" fill="#ffe066" opacity=".25"/>';
      case 'gazebo':
        return '<ellipse cx="' + cx + '" cy="' + (y + 2) + '" rx="60" ry="12" fill="#000" opacity=".15"/><rect x="' + (cx - 56) + '" y="' + (y - 10) + '" width="112" height="10" fill="#bcaaa4" stroke="' + OUT + '" stroke-width="2"/>' +
          '<rect x="' + (cx - 48) + '" y="' + (y - 70) + '" width="7" height="60" fill="#a0522d"/><rect x="' + (cx + 41) + '" y="' + (y - 70) + '" width="7" height="60" fill="#a0522d"/><rect x="' + (cx - 3) + '" y="' + (y - 70) + '" width="6" height="60" fill="#a0522d" opacity=".6"/>' +
          '<path d="M' + (cx - 64) + ' ' + (y - 68) + ' L' + cx + ' ' + (y - 112) + ' L' + (cx + 64) + ' ' + (y - 68) + ' Z" fill="#2f8f63" stroke="' + OUT + '" stroke-width="3"/>';
      case 'sign':
        return s + '<rect x="' + (cx - 3) + '" y="' + (y - 50) + '" width="6" height="50" fill="#8d5a2b"/><rect x="' + (cx - 22) + '" y="' + (y - 62) + '" width="44" height="26" rx="4" fill="#3e9f4c" stroke="' + OUT + '" stroke-width="2.5"/><path d="M' + (cx - 8) + ' ' + (y - 42) + ' Q' + (cx - 10) + ' ' + (y - 58) + ' ' + (cx + 10) + ' ' + (y - 58) + ' Q' + (cx + 10) + ' ' + (y - 42) + ' ' + (cx - 8) + ' ' + (y - 42) + 'Z" fill="#fff"/>';
      case 'fountain':
        return s + '<path d="M' + (cx - 14) + ' ' + y + ' l4 -30 h20 l4 30 z" fill="#b0bec5" stroke="' + OUT + '" stroke-width="2.5"/><ellipse cx="' + cx + '" cy="' + (y - 30) + '" rx="14" ry="5" fill="#4fd1ff" stroke="' + OUT + '" stroke-width="2"/><path d="M' + cx + ' ' + (y - 32) + ' q4 -14 10 -8" stroke="#4fd1ff" stroke-width="3" fill="none"/>';
      default:
        return s + '<rect x="' + (cx - 22) + '" y="' + (y - 36) + '" width="44" height="36" rx="5" fill="#90a4ae" stroke="' + OUT + '" stroke-width="2.5"/>';
    }
  };

  // Иконка предмета магазина
  A.itemIcon = function (id) {
    var it = EG.shop.item(id) || {};
    if (it.kind === 'upgrade') {
      if (id === 'labgear') return A.svg('0 0 100 100', '<rect x="20" y="70" width="60" height="10" rx="3" fill="#90a4ae"/><path d="M42 20 h16 v20 l14 30 h-44 l14 -30 z" fill="#a6dcf0" stroke="' + OUT + '" stroke-width="3"/><path d="M34 58 h32 l6 12 h-44z" fill="#4fd1ff"/>');
      return A.svg('0 0 100 100', '<rect x="22" y="22" width="56" height="66" rx="8" fill="#34495e" stroke="' + OUT + '" stroke-width="3"/><rect x="40" y="14" width="20" height="10" rx="3" fill="#5d6d7e"/><rect x="32" y="62" width="36" height="14" rx="3" fill="#6fcf73"/><rect x="32" y="44" width="36" height="14" rx="3" fill="#6fcf73"/><path d="M54 28 l-10 14 h8 l-4 12 l12 -16 h-8z" fill="#f2b705"/>');
    }
    var big = it.size === 'L';
    return A.svg(big ? '-70 -125 140 140' : '-40 -95 80 100', A.item(id, 0, 0, id === 'seeds' ? 0.5 : 1));
  };

  // ───────────── Мусор ─────────────
  A.pile = function (p) {
    var x = p.x, y = p.y, s = '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="34" ry="9" fill="#000" opacity=".18"/>';
    if (p.kind === 'organic') {
      s += '<path d="M' + (x - 30) + ' ' + y + ' Q' + (x - 26) + ' ' + (y - 26) + ' ' + x + ' ' + (y - 28) + ' Q' + (x + 28) + ' ' + (y - 24) + ' ' + (x + 30) + ' ' + y + ' Z" fill="#7b5a3a" stroke="' + OUT + '" stroke-width="2.5"/>' +
        '<path d="M' + (x - 14) + ' ' + (y - 20) + ' q8 -16 16 -4 q-6 -2 -10 6z" fill="#f2d14b" stroke="' + OUT + '" stroke-width="1.5"/>' +
        '<path d="M' + (x + 6) + ' ' + (y - 22) + ' q14 -12 16 2 q-10 -2 -16 -2z" fill="#6fae3c" stroke="' + OUT + '" stroke-width="1.5"/>' +
        '<circle cx="' + (x - 2) + '" cy="' + (y - 10) + '" r="5" fill="#c0392b" stroke="' + OUT + '" stroke-width="1.5"/>';
    } else {
      s += '<path d="M' + (x - 32) + ' ' + y + ' Q' + (x - 28) + ' ' + (y - 30) + ' ' + x + ' ' + (y - 32) + ' Q' + (x + 30) + ' ' + (y - 28) + ' ' + (x + 32) + ' ' + y + ' Z" fill="#6b6b66" stroke="' + OUT + '" stroke-width="2.5"/>' +
        '<rect x="' + (x - 18) + '" y="' + (y - 30) + '" width="10" height="20" rx="3" fill="#9ad0f5" stroke="' + OUT + '" stroke-width="1.5" transform="rotate(-25 ' + (x - 13) + ' ' + (y - 20) + ')"/>' +
        '<rect x="' + (x + 4) + '" y="' + (y - 26) + '" width="14" height="10" fill="#f5f5f0" stroke="' + OUT + '" stroke-width="1.5" transform="rotate(12 ' + (x + 11) + ' ' + (y - 21) + ')"/>' +
        '<rect x="' + (x + 10) + '" y="' + (y - 14) + '" width="9" height="12" rx="2" fill="#c0c7cf" stroke="' + OUT + '" stroke-width="1.5"/>' +
        '<rect x="' + (x - 6) + '" y="' + (y - 12) + '" width="12" height="9" fill="#c8a165" stroke="' + OUT + '" stroke-width="1.5"/>';
    }
    return s;
  };

  // ───────────── Иконки отходов (viewBox 0 0 64 64) ─────────────
  var W = {
    pbottle: '<rect x="24" y="6" width="16" height="8" rx="2" fill="#2f80ed"/><path d="M22 16 h20 q4 6 4 14 v26 q0 4 -4 4 h-20 q-4 0 -4 -4 v-26 q0 -8 4 -14z" fill="#bfe6ff" stroke="#2b3a33" stroke-width="2.5"/><rect x="18" y="32" width="28" height="10" fill="#6fcf73"/>',
    bag: '<path d="M14 22 h36 l-4 34 h-28z" fill="#f4f4f4" stroke="#2b3a33" stroke-width="2.5"/><path d="M22 22 q0 -14 10 -14 q10 0 10 14" stroke="#2b3a33" stroke-width="2.5" fill="none"/><path d="M24 34 l6 6 l10 -10" stroke="#6fcf73" stroke-width="3" fill="none"/>',
    cup: '<path d="M16 16 h32 l-4 40 h-24z" fill="#fff8e1" stroke="#2b3a33" stroke-width="2.5"/><rect x="14" y="12" width="36" height="6" rx="2" fill="#e84393"/><circle cx="32" cy="36" r="7" fill="#e84393" opacity=".6"/>',
    shampoo: '<rect x="26" y="4" width="12" height="10" rx="2" fill="#9b59b6"/><rect x="18" y="14" width="28" height="44" rx="8" fill="#d6b4f0" stroke="#2b3a33" stroke-width="2.5"/><rect x="24" y="28" width="16" height="14" rx="2" fill="#fff"/>',
    news: '<rect x="10" y="12" width="44" height="40" rx="2" fill="#f5f5f0" stroke="#2b3a33" stroke-width="2.5"/><rect x="16" y="18" width="32" height="6" fill="#555"/><path d="M16 30 h14 M16 36 h14 M16 42 h14 M34 30 h14 M34 36 h14 M34 42 h14" stroke="#999" stroke-width="2"/>',
    box: '<path d="M10 24 l22 -10 l22 10 v26 l-22 10 l-22 -10z" fill="#c8a165" stroke="#2b3a33" stroke-width="2.5"/><path d="M10 24 l22 10 l22 -10 M32 34 v26" stroke="#2b3a33" stroke-width="2.5" fill="none"/>',
    notebook: '<rect x="14" y="8" width="36" height="48" rx="3" fill="#2f80ed" stroke="#2b3a33" stroke-width="2.5"/><rect x="20" y="16" width="24" height="10" rx="2" fill="#fff"/><path d="M14 14 h-4 M14 24 h-4 M14 34 h-4 M14 44 h-4" stroke="#2b3a33" stroke-width="2.5"/>',
    jar: '<rect x="18" y="8" width="28" height="8" rx="2" fill="#8e9aa8" stroke="#2b3a33" stroke-width="2"/><rect x="14" y="16" width="36" height="42" rx="8" fill="#d8f3ff" fill-opacity=".8" stroke="#2b3a33" stroke-width="2.5"/><path d="M20 24 v24" stroke="#fff" stroke-width="4"/>',
    gbottle: '<rect x="27" y="4" width="10" height="14" fill="#1e8449" stroke="#2b3a33" stroke-width="2"/><path d="M24 18 h16 q6 6 6 14 v24 q0 4 -4 4 h-20 q-4 0 -4 -4 v-24 q0 -8 6 -14z" fill="#27ae60" stroke="#2b3a33" stroke-width="2.5"/><path d="M26 30 v20" stroke="#a9dfbf" stroke-width="3"/>',
    can: '<rect x="18" y="10" width="28" height="46" rx="5" fill="#d0d6dc" stroke="#2b3a33" stroke-width="2.5"/><rect x="18" y="22" width="28" height="20" fill="#e74c3c"/><ellipse cx="32" cy="10" rx="14" ry="3" fill="#aab2bb"/>',
    tin: '<rect x="14" y="16" width="36" height="36" rx="3" fill="#b0bec5" stroke="#2b3a33" stroke-width="2.5"/><rect x="14" y="24" width="36" height="18" fill="#f39c12"/><path d="M14 20 h36 M14 48 h36" stroke="#78909c" stroke-width="2"/>',
    lid: '<circle cx="32" cy="34" r="20" fill="#c0c7cf" stroke="#2b3a33" stroke-width="2.5"/><circle cx="32" cy="34" r="13" fill="none" stroke="#8e9aa8" stroke-width="2"/><path d="M26 34 q6 -6 12 0" stroke="#8e9aa8" stroke-width="2" fill="none"/>',
    apple: '<path d="M24 12 q8 4 16 0 q-2 8 -4 10 q8 6 8 16 q0 10 -10 16 h-4 q-10 -6 -10 -16 q0 -10 8 -16 q-2 -2 -4 -10z" fill="#fff3d6" stroke="#2b3a33" stroke-width="2.5"/><path d="M24 12 q-6 6 -2 12 M40 12 q6 6 2 12" stroke="#c0392b" stroke-width="5" fill="none"/><path d="M32 8 v-4" stroke="#7a4a25" stroke-width="3"/>',
    banana: '<path d="M14 18 q4 30 34 34 q4 0 2 -4 q-24 -6 -28 -30z" fill="#f2d14b" stroke="#2b3a33" stroke-width="2.5"/><path d="M22 22 q-10 4 -12 14 M26 30 q-8 10 -6 20" stroke="#c9a227" stroke-width="5" fill="none" stroke-linecap="round"/>',
    egg: '<path d="M12 40 q2 -26 20 -26 q18 0 20 26 l-6 -6 l-6 6 l-6 -6 l-6 6 l-6 -6 l-6 6z" fill="#fdf2e0" stroke="#2b3a33" stroke-width="2.5"/><path d="M20 46 q12 14 26 0 l-4 4 l-6 -4 l-6 4 l-6 -4z" fill="#fdf2e0" stroke="#2b3a33" stroke-width="2.5"/>',
    leaves: '<path d="M10 44 q4 -30 30 -32 q2 28 -30 32z" fill="#e67e22" stroke="#2b3a33" stroke-width="2.5"/><path d="M12 42 l24 -24" stroke="#a04000" stroke-width="2"/><path d="M28 54 q8 -24 28 -20 q-6 24 -28 20z" fill="#f2b705" stroke="#2b3a33" stroke-width="2.5"/>',
    bread: '<path d="M10 36 q0 -20 22 -20 q22 0 22 20 v14 h-44z" fill="#d4a056" stroke="#2b3a33" stroke-width="2.5"/><path d="M20 26 l4 6 M30 24 l4 6 M40 26 l4 6" stroke="#8d5a2b" stroke-width="2.5"/>',
    mug: '<path d="M12 18 h30 v30 q0 8 -8 8 h-14 q-8 0 -8 -8z" fill="#f5f5f0" stroke="#2b3a33" stroke-width="2.5"/><path d="M42 26 q12 0 12 10 q0 10 -12 10" stroke="#2b3a33" stroke-width="3" fill="none"/><path d="M22 18 l6 12 l-4 8 l8 10" stroke="#2b3a33" stroke-width="2" fill="none"/><rect x="16" y="28" width="22" height="6" fill="#3e9f4c"/>',
    sponge: '<rect x="10" y="20" width="44" height="26" rx="5" fill="#f2d14b" stroke="#2b3a33" stroke-width="2.5"/><rect x="10" y="20" width="44" height="9" rx="4" fill="#27ae60" stroke="#2b3a33" stroke-width="2.5"/><circle cx="20" cy="38" r="2" fill="#c9a227"/><circle cx="32" cy="36" r="2" fill="#c9a227"/><circle cx="44" cy="40" r="2" fill="#c9a227"/>',
    mirror: '<path d="M12 50 l10 -38 l28 6 l4 30z" fill="#d6eaf8" stroke="#2b3a33" stroke-width="2.5"/><path d="M22 20 l8 20 M36 22 l-4 24" stroke="#fff" stroke-width="3"/><path d="M12 50 l42 -2" stroke="#8e9aa8" stroke-width="4"/>'
  };
  A.waste = function (id) { return A.svg('0 0 64 64', W[id] || '<circle cx="32" cy="32" r="20" fill="#999"/>'); };

  // Контейнер мини-игры сортировки
  A.binIcon = function (color) {
    return A.svg('0 0 80 80', '<rect x="14" y="20" width="52" height="54" rx="6" fill="' + color + '" stroke="#2b3a33" stroke-width="3"/><rect x="10" y="10" width="60" height="12" rx="4" fill="' + color + '" stroke="#2b3a33" stroke-width="3"/><rect x="32" y="4" width="16" height="8" rx="3" fill="#2b3a33"/>' + A.recycleMark(40, 46, 12, '#fff'));
  };

  // Сцены вступления (viewBox 0 0 400 200)
  A.introScene = function (kind) {
    var green = kind === 'past', ruin = kind === 'ruin' || kind === 'decay';
    if (kind === 'letter') {
      return A.svg('0 0 400 200', '<rect width="400" height="200" fill="#e8f5e9"/>' +
        '<g transform="translate(150 40)"><rect width="100" height="70" rx="6" fill="#fff" stroke="' + OUT + '" stroke-width="3"/><path d="M0 0 l50 40 l50 -40" stroke="' + OUT + '" stroke-width="3" fill="none"/><circle cx="50" cy="52" r="10" fill="#3e9f4c"/></g>' +
        '<svg x="20" y="40" width="130" height="150" viewBox="0 0 200 220">' + A.professorInner() + '</svg>' +
        '<svg x="270" y="70" width="110" height="125" viewBox="0 0 200 220">' + A.baitInner() + '</svg>');
    }
    var sky = green ? '#bfe9ff' : (kind === 'decay' ? '#cfcac0' : '#b9b3a8');
    var ground = green ? '#8fd06a' : (kind === 'decay' ? '#b8a983' : '#a8987a');
    var s = '<rect width="400" height="200" fill="' + sky + '"/><rect y="140" width="400" height="60" fill="' + ground + '"/>';
    s += '<rect y="150" width="400" height="16" fill="' + (green ? '#9aa5a0' : '#7d7a72') + '"/>';
    if (green) s += '<circle cx="340" cy="40" r="22" fill="#ffe066"/>';
    var hx = [30, 110, 250];
    hx.forEach(function (x, i) { s += A.house('house' + (i + 1), x, 146, 70, green).replace(/stroke-width="3"/g, 'stroke-width="2"'); });
    if (green) { s += A.item('tree', 200, 146) + A.item('tree', 360, 150) + A.item('flowerbed', 330, 196); }
    else {
      s += A.factory(310, 146, kind === 'ruin' ? 0.9 : 0.6);
      s += A.pile({ x: 200, y: 180, kind: 'mixed' }) + A.pile({ x: 90, y: 190, kind: 'organic' });
      s += A.deadTree(190, 146, false);
    }
    var filt = ruin ? ' filter="url(#introGray)"' : '';
    return A.svg('0 0 400 200', '<defs><filter id="introGray"><feColorMatrix type="saturate" values="' + (kind === 'ruin' ? 0.15 : 0.45) + '"/></filter></defs><g' + filt + '>' + s + '</g>');
  };

  EG.art = A;
})();
