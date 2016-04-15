let prev = undefined;
let next = undefined;

export function hashchange(listener) {
  if (navigator.msMaxTouchPoints !== void 0) {
    prev = window.location.href;
    var int = setInterval(function() {
      try {
        next = window.location.href;
        if (prev === next) return;
        listener.call(window, {
          type: 'hashchange',
          newURL: next,
          oldURL: prev
        });
        prev = next;
      } catch (e) {
        clearInterval(int);
      }
    }, 100);
  } else if (window.addEventListener) {
    window.addEventListener('hashchange', listener, false);
  }
}
