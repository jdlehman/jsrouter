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

function createHandlerArgs(handlerName, queryParams, lastOrNextPath) {
  if (handlerName === 'enter') {
    return {lastPath: lastOrNextPath, queryParams};
  } else {
    return {nextPath: lastOrNextPath, queryParams};
  }
}

export function recognizeAndCallHandler(path, lastOrNextPath, handlerName) {
  const pathHandlers = this.recognizer.recognize(path);
  if (!pathHandlers) {
    // only call unrecognized route handler on enter
    if (handlerName === 'enter') {
      this.unrecognizedRouteHandler(path, lastOrNextPath, handlerName);
    }
  } else {
    const queryParams = pathHandlers.queryParams;
    const handlerArgs = createHandlerArgs(handlerName, queryParams, lastOrNextPath);
    for (let i = 0; i < pathHandlers.length; i++) {
      const result = pathHandlers[i];
      const params = result.params;
      const handlerObj = this.handlers[result.handler];
      const handler = handlerObj && handlerObj[handlerName];

      if (typeof handler === 'function') {
        handler({...handlerArgs, path, params});
      }
    }
  }
}
