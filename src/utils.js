// @flow
import type Recognizer from 'route-recognizer';

export function hasLeadingSlash(path: string) {
  return path.charAt(0) === '/';
}

export function ensureLeadingSlash(path: string) {
  return hasLeadingSlash(path) ? path : `/${path}`;
}

export function ensureTrailingSlash(path: string) {
  return path.slice(-1) !== '/' ? `${path}/` : path;
}

export function pathFromHash(url: string) {
  return ensureTrailingSlash(
    ensureLeadingSlash(url.split('#')[1] || '/')
  );
}

export function noop() {}

export function isFalse(val: *) {
  return typeof val !== 'undefined' && !val;
}

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

type HandlerArgs = {
  params: {}
};

type Handler = {
  handler: ?(HandlerArgs) => void,
  args: HandlerArgs
};

export function getHandlers(allHandlers: {}, recognizer: Recognizer, pathArgs: {path: string}, handlerName: ?string) {
  const recognizedHandlers = recognizer.recognize(pathArgs.path);
  if (!recognizedHandlers) { return null; }
  const handlers: Array<Handler> = [];
  const handlerArgs = {...sanitizePaths(pathArgs), queryParams: recognizedHandlers.queryParams};
  for (let i = 0; i < recognizedHandlers.length; i++) {
    const handlerData = recognizedHandlers[i];
    const params = handlerData.params;
    const handler = allHandlers[handlerData.handler];
    const handlerFunc = handlerName ? handler && handler[handlerName] : null;
    const args = {...handlerArgs, params};
    handlers.push({handler: handlerFunc, args});
  }
  return handlers;
}

export function callHandlers(handlers: Array<Handler>) {
  handlers.forEach(({handler, args}) => {
    if (typeof handler === 'function') {
      handler(args);
    }
  });
}

export function getFlattenedHandlerArgs(handlers: ?Array<Handler>, startingArgs: {}) {
  if (!handlers) { return startingArgs; }
  const args = handlers[0].args;
  const flattenedParams = handlers
    .reduce((mergedParams, {args: {params}}) => ({...mergedParams, ...params}), {});
  return {...args, params: flattenedParams};
}
