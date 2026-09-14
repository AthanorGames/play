// The two ad bands around the game, browser build only.
//
// Ads are siblings of the Flutter view, never an overlay: an ad can not
// cover the map, a battle, or a button. One band above the game and one
// below, both always shown, both fixed 728x90 leaderboards.
//
// This replaced side rails, which were the better shape for a landscape
// board — spare width is cheap, height is not — but could only ever be
// two units on a very wide window and one below that, and had to ask
// for *responsive* units inside fixed-height boxes. AdSense sizes those
// itself: measured against a real adsbygoogle.js, the same horizontal
// unit came back 390x390 in a 390px window and 90px tall in an 800px
// one. A fixed size in a band of exactly that height is the only
// arrangement the network cannot surprise.
//
// Three states, chosen by web/ad-config.js:
//   * a `client` is set   — the real ad network fills the bands;
//   * `placeholder: true` — our own promo fills them, no network at
//     all (what the site runs while AdSense approval is pending);
//   * neither             — no bands, and the game keeps the whole
//     window. Local, Docker and development builds land here.
//
// A slot is only ever *filled* once — asking the ad network for a new
// impression on every drag of a window edge would be both wasteful and
// against its rules.
//
// A unit that comes back **unfilled** hands its band back to the promo.
// An empty `ins` is not nothing: it is a reserved 728x90 of blank in a
// band exactly 90 tall, which is the empty bar this whole arrangement
// exists to avoid, reached by a different road. AdSense marks the case
// itself (`data-ad-status="unfilled"`), so there is no guessing.
//
// See web/ad-config.js for why none of this is sensitive.
(function () {
  var cfg = window.ATHANOR_ADS || {};
  var live = !!(cfg.enabled && cfg.client);
  if (!live && !cfg.placeholder) return;

  var ALL = ['ad-top', 'ad-bottom'];
  var filled = {};

  /// Both bands, always. There is no breakpoint any more: a band is the
  /// same 90px whatever the window is doing, so there is nothing for a
  /// resize to change its mind about.
  function wanted() {
    return [
      ['ad-top', cfg.slotTop || cfg.slot],
      ['ad-bottom', cfg.slotBottom || cfg.slot],
    ];
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

  /// Puts the promo back in a band whose unit came back empty.
  ///
  /// An unfilled `ins` is not nothing: it is a reserved 728x90 of blank
  /// inside a band that is exactly 90 tall — the empty bar the promo
  /// exists to avoid, arrived at by a different route. AdSense says so
  /// itself by setting `data-ad-status="unfilled"` on the element once
  /// it has decided, so the band can take the unit out again and go back
  /// to talking about the game.
  ///
  /// Watched rather than polled, and disconnected the moment it fires:
  /// the attribute is set once per unit, and a live observer on an ad
  /// element is a thing to be tidy about.
  function promoteIfUnfilled(host, unit) {
    function check() {
      var status = unit.getAttribute('data-ad-status');
      // No answer yet: keep waiting. Anything else is an answer, and
      // there is only ever one, so the watch is done either way.
      if (!status) return false;
      if (status === 'unfilled') {
        if (unit.parentNode === host) host.removeChild(unit);
        house(host, true);
      }
      return true;
    }
    if (check()) return;
    var watch = new MutationObserver(function () {
      if (check()) watch.disconnect();
    });
    watch.observe(unit, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    });
  }

  function fill(host, spec) {
    // Both bands are horizontal now, so the promo always is too.
    if (!live) {
      house(host, true);
      return;
    }
    var unit = document.createElement('ins');
    unit.className = 'adsbygoogle';
    unit.style.display = 'inline-block';
    // A FIXED size, not width/height 100% with data-ad-format. The
    // responsive form lets AdSense pick, and what it picks does not fit
    // a band: 390x390 in a narrow window. 728x90 is what the band is
    // built for, and it is what the console must create the unit as.
    unit.style.width = '728px';
    unit.style.height = '90px';
    unit.setAttribute('data-ad-client', cfg.client);
    if (spec[1]) unit.setAttribute('data-ad-slot', spec[1]);
    host.appendChild(unit);
    promoteIfUnfilled(host, unit);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // The queue itself refused: no ad is coming, so the band goes
      // back to the promo rather than standing empty.
      if (unit.parentNode === host) host.removeChild(unit);
      house(host, true);
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
    // The phone note is fixed to the bottom of the window, so it has to
    // be told to sit above the lower band rather than on top of it.
    var below = document.getElementById('ad-bottom');
    document.body.classList.toggle(
        'ad-band-below', !!(below && below.classList.contains('ready')));
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
