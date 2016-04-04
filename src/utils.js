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

function trimQueryParams(path) {
  return path.split('?')[0];
}

function sanitizePaths(paths, queryParams) {
  const sanitizedPaths = {};
  Object.keys(paths).forEach(key => {
    sanitizedPaths[key] = trimQueryParams(paths[key]);
  });
  return sanitizedPaths;
}

export function getHandlers(allHandlers, recognizer, pathArgs, handlerName) {
  const recognizedHandlers = recognizer.recognize(pathArgs.path);
  if (!recognizedHandlers) { return null; }
  const handlers = [];
  const handlerArgs = {...sanitizePaths(pathArgs), queryParams: recognizedHandlers.queryParams};
  for (let i = 0; i < recognizedHandlers.length; i++) {
    const handlerData = recognizedHandlers[i];
    const params = handlerData.params;
    const handler = allHandlers[handlerData.handler];
    const handlerFunc = handler && handler[handlerName];
    const args = {...handlerArgs, params};
    handlers.push({handler: handlerFunc, args});
  }
  return handlers;
}

export function callHandlers(handlers) {
  handlers.forEach(({handler, args}) => {
    if (typeof handler === 'function') {
      handler(args);
    }
  });
}

export function getFlattenedHandlerArgs(handlers, startingArgs) {
  if (!handlers) { return startingArgs; }
  const args = handlers[0].args;
  const flattenedParams = handlers
    .reduce((mergedParams, {args: {params}}) => {
      return {...mergedParams, ...params};
    }, {});
  return {...args, params: flattenedParams};
}
