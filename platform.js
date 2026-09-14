// Tells a phone what it is missing, without taking the game away.
//
// Deliberately a bar and not a redirect. The game is *built* for a phone
// held in landscape and plays perfectly well in a mobile browser, so
// bouncing a visitor to a download page would cost them the thing they
// came for, break every shared link and refresh, and — on iOS, where
// there is no build to offer — send them to a page whose only advice is
// to go back to the browser they were already in.
//
// So: one line along the bottom, a link, and a dismissal that is
// remembered. Everything degrades to silence if anything here fails; a
// promo must never be the reason a game does not load.
(function () {
  var DOCS = 'https://help.athanor.games/download';
  var KEY = 'athanor_platform_note_dismissed';

  function remembered(key) {
    // Private windows and storage-partitioned browsers throw on access
    // rather than returning null.
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function remember(key) {
    try {
      window.localStorage.setItem(key, '1');
    } catch (e) {
      // Shown again next visit, which is a small enough price.
    }
  }

  /// 'android', 'ios', or null for anything we have nothing to say to.
  function platform() {
    var ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) return 'android';
    // iPadOS reports itself as a Mac; the touch points give it away.
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
    return null;
  }

  var kind = platform();
  if (!kind || remembered(KEY)) return;

  var text = kind === 'android'
    ? 'Playing on Android? There is an app — same game, whole screen.'
    : 'On iPhone or iPad you are playing the full game right here. '
      + 'There is no App Store build yet.';
  var linkText = kind === 'android' ? 'Get it' : 'Why not';

  var bar = document.createElement('div');
  bar.id = 'platform-note';
  bar.setAttribute('role', 'status');
  bar.innerHTML =
    '<span class="pn-text"></span>'
    + '<a class="pn-link" target="_blank" rel="noopener"></a>'
    + '<button class="pn-close" aria-label="Dismiss">&times;</button>';
  bar.querySelector('.pn-text').textContent = text;
  var link = bar.querySelector('.pn-link');
  link.textContent = linkText;
  link.href = DOCS;

  bar.querySelector('.pn-close').addEventListener('click', function () {
    remember(KEY);
    bar.remove();
  });
  // Following the link is as good as reading it.
  link.addEventListener('click', function () {
    remember(KEY);
  });

  function show() {
    if (document.body) document.body.appendChild(bar);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
