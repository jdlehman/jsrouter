import {pathFromURL} from './utils';

function recognizeAndCallHandler(path, lastOrNextPath, handlerName) {
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

export function defaultUnrecognizedRouteHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/');
}

export function defaultNavigateState() {
  return {};
}

export function defaultHandleRouteChange(e) {
  var oldPath = pathFromURL(e.oldURL);
  var newPath = pathFromURL(e.newURL);

  // call leave handlers
  recognizeAndCallHandler.call(this, oldPath, newPath, 'leave');

  // call enter handlers
  recognizeAndCallHandler.call(this, newPath, oldPath, 'enter');
}
