var jsrouter = (function (Recognizer) {
'use strict';

Recognizer = 'default' in Recognizer ? Recognizer['default'] : Recognizer;

function defaultUnrecognizedRouteHandler(lastPath, path) {
  this.navigate('/');
}

function defaultNavigateState() {
  return {};
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function hasLeadingSlash(path) {
  return path.charAt(0) === '/';
}

function ensureLeadingSlash(path) {
  return hasLeadingSlash(path) ? path : '/' + path;
}

function ensureTrailingSlash(path) {
  return path.slice(-1) !== '/' ? path + '/' : path;
}

function pathFromHash(url) {
  return ensureTrailingSlash(ensureLeadingSlash(url.split('#')[1] || '/'));
}

function noop() {}

function isFalse(val) {
  return typeof val !== 'undefined' && !val;
}

function trimQueryParams(path) {
  return path.split('?')[0];
}

function sanitizePaths(paths, queryParams) {
  var sanitizedPaths = {};
  Object.keys(paths).forEach(function (key) {
    sanitizedPaths[key] = trimQueryParams(paths[key]);
  });
  return sanitizedPaths;
}

function getHandlers(allHandlers, recognizer, pathArgs, handlerName) {
  var recognizedHandlers = recognizer.recognize(pathArgs.path);
  if (!recognizedHandlers) {
    return null;
  }
  var handlers = [];
  var handlerArgs = _extends({}, sanitizePaths(pathArgs), { queryParams: recognizedHandlers.queryParams });
  for (var i = 0; i < recognizedHandlers.length; i++) {
    var handlerData = recognizedHandlers[i];
    var params = handlerData.params;
    var handler = allHandlers[handlerData.handler];
    var handlerFunc = handler && handler[handlerName];
    var args = _extends({}, handlerArgs, { params: params });
    handlers.push({ handler: handlerFunc, args: args });
  }
  return handlers;
}

function callHandlers(handlers) {
  handlers.forEach(function (_ref) {
    var handler = _ref.handler;
    var args = _ref.args;

    if (typeof handler === 'function') {
      handler(args);
    }
  });
}

function getFlattenedHandlerArgs(handlers, startingArgs) {
  if (!handlers) {
    return startingArgs;
  }
  var args = handlers[0].args;
  var flattenedParams = handlers.reduce(function (mergedParams, _ref2) {
    var params = _ref2.args.params;
    return _extends({}, mergedParams, params);
  }, {});
  return _extends({}, args, { params: flattenedParams });
}

var prev = undefined;
var next = undefined;

function hashchange(listener) {
  if (navigator.msMaxTouchPoints !== void 0) {
    prev = window.location.href;
    var int = setInterval(function () {
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

function handleRouteChange(e) {
  var oldPath = pathFromHash(e.oldURL);
  var newPath = pathFromHash(e.newURL);
  var enterPaths = { lastPath: oldPath, path: newPath };
  var enterHandlers = getHandlers(this.handlers, this.recognizer, enterPaths, 'enter');
  var enterArgs = getFlattenedHandlerArgs(enterHandlers, enterPaths);

  // call enter handlers
  enterHandlers ? callHandlers(enterHandlers) : this.unrecognizedRouteHandler(oldPath, newPath);
  this.handleAfterChange(enterArgs);
}

function handleLoadEvent(e) {
  var path = pathFromHash(e.target.URL);
  var enterHandlers = getHandlers(this.handlers, this.recognizer, { path: path }, 'enter');
  enterHandlers && callHandlers(enterHandlers);
  var args = getFlattenedHandlerArgs(enterHandlers, { path: path });
  this.handleLoad(e, args);
}

function handlePop(e) {
  var path = this.currentPath();
  var handlers = getHandlers(this.handlers, this.recognizer, { path: path });
  var args = getFlattenedHandlerArgs(handlers, { path: path });
  this.handlePopState(e, args);
}

function registerListeners() {
  window.addEventListener('load', handleLoadEvent.bind(this));
  window.addEventListener('popstate', handlePop.bind(this));
  hashchange(handleRouteChange.bind(this));
}

var Router = function () {
  function Router(config) {
    classCallCheck(this, Router);

    var defaults = {
      unrecognizedRouteHandler: defaultUnrecognizedRouteHandler.bind(this),
      handleLoad: noop,
      handlePopState: noop,
      navigateState: defaultNavigateState,
      handleBeforeChange: noop,
      handleAfterChange: noop,
      persistState: function persistState() {
        var _window$history;

        return (_window$history = window.history).replaceState.apply(_window$history, arguments);
      }
    };

    var _defaults$config = _extends({}, defaults, config);

    var unrecognizedRouteHandler = _defaults$config.unrecognizedRouteHandler;
    var handleLoad = _defaults$config.handleLoad;
    var handlePopState = _defaults$config.handlePopState;
    var navigateState = _defaults$config.navigateState;
    var handleBeforeChange = _defaults$config.handleBeforeChange;
    var handleAfterChange = _defaults$config.handleAfterChange;
    var persistState = _defaults$config.persistState;


    this.recognizer = new Recognizer();
    this.handlers = {};

    // handle config
    this.unrecognizedRouteHandler = unrecognizedRouteHandler;
    this.handleLoad = handleLoad;
    this.handlePopState = handlePopState;
    this.navigateState = navigateState;
    this.handleBeforeChange = handleBeforeChange;
    this.handleAfterChange = handleAfterChange;
    this.persistState = persistState;

    registerListeners.call(this);
  }

  createClass(Router, [{
    key: 'addHandler',
    value: function addHandler(name, handler) {
      this.handlers[name] = handler;
    }
  }, {
    key: 'map',
    value: function map(callback) {
      this.recognizer.map(callback);
    }
  }, {
    key: 'currentPath',
    value: function currentPath() {
      return pathFromHash(window.location.hash.split('?')[0]);
    }
  }, {
    key: 'navigate',
    value: function navigate(path) {
      var state = arguments.length <= 1 || arguments[1] === undefined ? this.navigateState() : arguments[1];
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var newPath = hasLeadingSlash(path) ? '#' + path : '#' + this.currentPath() + path;
      var current = window.location.hash;

      // call leave handlers
      var leavePaths = { path: pathFromHash(current), nextPath: pathFromHash(newPath) };
      var leaveHandlers = getHandlers(this.handlers, this.recognizer, leavePaths, 'leave');
      var leaveArgs = getFlattenedHandlerArgs(leaveHandlers, leavePaths);
      var shouldChange = this.handleBeforeChange(leaveArgs);
      if (isFalse(shouldChange)) {
        return;
      } // prevent path change if false
      leaveHandlers && callHandlers(leaveHandlers);

      // actually navigate
      window.location.hash = newPath;
      this.persistState(state, '', newPath);
      if (options.trigger && current === newPath) {
        handleRouteChange.call(this, {
          type: 'hashchange',
          oldURL: newPath,
          newURL: newPath
        });
      }
    }
  }, {
    key: 'back',
    value: function back() {
      window.history.back();
    }
  }, {
    key: 'forward',
    value: function forward() {
      window.history.forward();
    }
  }, {
    key: 'pop',
    value: function pop() {
      var matches = this.currentPath().match(/(.+)(?:\/.+\/?)/);
      if (matches) {
        this.navigate(matches[1] + '/');
      }
    }
  }]);
  return Router;
}();

return Router;

}(Recognizer));