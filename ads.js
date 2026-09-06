// The ad rails beside the game, browser build only.
//
// Ads are siblings of the Flutter view, never an overlay: an ad can not
// cover the map, a battle, or a button. They go in the side rails
// because the game is a landscape board — spare width is cheap, height
// is not — and a viewport too narrow to give up 160px a side falls back
// to a thin strip underneath.
//
// Three states, chosen by web/ad-config.js:
//   * a `client` is set   — the real ad network fills the rails;
//   * `placeholder: true` — our own promo fills them, no network at
//     all (what the site runs while AdSense approval is pending);
//   * neither             — no rails, and the game keeps the whole
//     window. Local, Docker and development builds land here.
//
// The rails follow the window: resizing past a breakpoint hides or
// reveals them, and the game reflows into whatever is left. A slot is
// only ever *filled* once, though — asking the ad network for a new
// impression on every drag of a window edge would be both wasteful and
// against its rules — so a rail that comes back keeps the unit it
// already had. For the same reason only slots that will actually be
// visible are filled: an ad injected into a hidden container is wasted.
//
// See web/ad-config.js for why none of this is sensitive.
(function () {
  var cfg = window.ATHANOR_ADS || {};
  var live = !!(cfg.enabled && cfg.client);
  if (!live && !cfg.placeholder) return;

  var ALL = ['ad-left', 'ad-right', 'ad-bottom'];
  var filled = {};

  /// Which rails a window this wide can afford. Both of them want a
  /// comfortable board left over; below that, one rail; below that, a
  /// strip under the game.
  function wanted() {
    var w = window.innerWidth;
    if (w >= 1180) {
      return [
        ['ad-right', 'vertical', cfg.slot],
        ['ad-left', 'vertical', cfg.slotLeft || cfg.slot],
      ];
    }
    if (w >= 880) return [['ad-right', 'vertical', cfg.slot]];
    return [['ad-bottom', 'horizontal', cfg.slot]];
  }

  /// Our own promo, used where no paid ad is serving. Deliberately not
  /// dressed as an ad unit: it is the game talking about itself.
  function house(host, horizontal) {
    var card = document.createElement('a');
    card.className = 'house-ad' + (horizontal ? ' horizontal' : '');
    // The game repo is private, so its releases 404 for players — and
    // this pointed at the old org besides. The help site carries the
    // builds and says how to install them.
    card.href = 'https://help.athanor.games/download';
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML =
      '<span class="house-mark"></span>' +
      '<strong>Athanor</strong>' +
      '<span class="house-note">The Great Work, in your pocket — ' +
      'get the Android build</span>';
    host.appendChild(card);
  }

  function fill(host, spec) {
    if (!live) {
      house(host, spec[0] === 'ad-bottom');
      return;
    }
    var unit = document.createElement('ins');
    unit.className = 'adsbygoogle';
    unit.style.display = 'block';
    unit.style.width = '100%';
    unit.style.height = '100%';
    unit.setAttribute('data-ad-client', cfg.client);
    if (spec[2]) unit.setAttribute('data-ad-slot', spec[2]);
    unit.setAttribute('data-ad-format', spec[1]);
    host.appendChild(unit);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      host.classList.remove('ready');
    }
  }

  function layout() {
    var specs = wanted();
    var ids = specs.map(function (s) { return s[0]; });
    ALL.forEach(function (id) {
      var host = document.getElementById(id);
      if (!host) return;
      if (ids.indexOf(id) === -1) {
        // No room for this one any more: give the space to the game.
        host.classList.remove('ready');
        return;
      }
      // Reserve the space before the unit goes in: the ad network
      // measures the slot it is handed, and a collapsed container
      // would be filled with nothing.
      host.classList.add('ready');
      if (!filled[id]) {
        filled[id] = true;
        fill(host, specs[ids.indexOf(id)]);
      }
    });
  }

  layout();

  var pending;
  window.addEventListener('resize', function () {
    clearTimeout(pending);
    pending = setTimeout(layout, 200);
  });

  if (!live) return;

  var loader = document.createElement('script');
  loader.async = true;
  loader.crossOrigin = 'anonymous';
  loader.src =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    encodeURIComponent(cfg.client);
  // Blocked or failed: fall back to our own promo rather than framing
  // the game in empty black bars.
  loader.onerror = function () {
    live = false;
    ALL.forEach(function (id) {
      var host = document.getElementById(id);
      if (!host) return;
      host.innerHTML = '';
      filled[id] = false;
    });
    layout();
  };
  document.head.appendChild(loader);
})();
