// Lets the game's music start once the player touches the page.
//
// The audio plugin (audioplayers_web) plays each track through a Web Audio
// AudioContext, for its volume and panning, and creates that context the
// first time a track is asked for: on the intro screen, before the player has
// touched anything. A browser starts a context like that suspended. The
// plugin then waits on resume() before it calls play(), and that wait never
// ends unless resume() is called again after a user gesture, so the score
// stayed silent for the whole session. Music.retry() on a tap could not help:
// as far as the game knew, the track was already starting.
//
// So: remember every AudioContext the page creates, and on each pointer, touch
// or key press resume the ones that are suspended. The plugin's pending
// resume() then resolves and the track starts. This has to load before the
// Flutter bootstrap. If anything here fails, the game plays on in silence.
(function () {
  var Base = window.AudioContext || window.webkitAudioContext;
  if (!Base) return;
  var contexts = [];
  try {
    var Tracked = class extends Base {
      constructor(...args) {
        super(...args);
        contexts.push(this);
      }
    };
    window.AudioContext = Tracked;
    if (window.webkitAudioContext) window.webkitAudioContext = Tracked;
  } catch (e) {
    return;
  }

  function unlock() {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].state !== 'suspended') continue;
      try {
        contexts[i].resume();
      } catch (e) {
        // A context the browser refuses to start stays silent; nothing else breaks.
      }
    }
  }

  // Kept for the whole session: a phone can suspend a context again after an
  // interruption, and the next tap should bring the music back.
  ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (type) {
    window.addEventListener(type, unlock, { capture: true, passive: true });
  });
})();
