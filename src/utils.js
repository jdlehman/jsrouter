export function hasLeadingSlash(path) {
  return path.charAt(0) === '/';
}

export function ensureLeadingSlash(path) {
  return hasLeadingSlash(path) ? path : `/${path}`;
}

export function ensureTrailingSlash(path) {
  return path.slice(-1) !== '/' ? `${path}/` : path;
}

export function pathFromHash(url) {
  return ensureTrailingSlash(
    ensureLeadingSlash(url.split('#')[1] || '/')
  );
}

export function noop() {}

export function recognizeAndCallHandler(path, lastOrNextPath, handlerName) {
  var pathHandlers = this.recognizer.recognize(path);
  if (!pathHandlers) {
    this.unrecognizedRouteHandler(path, lastOrNextPath, handlerName);
  } else {
    for (var i = 0; i < pathHandlers.length; i++) {
      var result = pathHandlers[i];
      var queryParams = pathHandlers.queryParams;
      var params = result.params;
      var handlerObj = this.handlers[result.handler];
      var handler = handlerObj && handlerObj[handlerName];

      if (typeof handler === 'function') {
        var handlerArgs = {path, queryParams, params};
        if (handlerName === 'enter') {
          handlerArgs.lastPath = lastOrNextPath;
        } else {
          handlerArgs.nextPath = lastOrNextPath;
        }
        handler(handlerArgs);
      }
    }
  }
}
