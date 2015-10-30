import Recognizer from 'route-recognizer';
import {
  defaultUnrecognizedRouteHandler,
  defaultNavigateState,
  defaultLoad
} from './defaultHandlers';
import {
  hasLeadingSlash,
  pathFromHash,
  recognizeAndCallHandler,
  noop
} from './utils';

function handleRouteChange(e) {
  var oldPath = pathFromHash(e.oldURL);
  var newPath = pathFromHash(e.newURL);
  // call leave handlers
  this.handleBeforeChange(oldPath, newPath);
  recognizeAndCallHandler.call(this, oldPath, newPath, 'leave');

  // call enter handlers
  recognizeAndCallHandler.call(this, newPath, oldPath, 'enter');
  this.handleAfterChange(oldPath, newPath);
}

function handleLoadEvent(e) {
  defaultLoad.call(this, e.target.URL);
  this.handleLoad(e);
}

export default class Router {
  constructor({
    unrecognizedRouteHandler = defaultUnrecognizedRouteHandler.bind(this),
    handleLoad = noop,
    handlePopState = noop,
    navigateState = defaultNavigateState,
    handleBeforeChange = noop,
    handleAfterChange = noop,
    persistState = (...args) => window.history.replaceState(...args)
  } = {}) {
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

    this.start();
  }

  start() {
    window.addEventListener('load', handleLoadEvent.bind(this));
    window.addEventListener('popstate', ::this.handlePopState);
    window.addEventListener('hashchange', handleRouteChange.bind(this));
  }

  addHandler(name, handler) {
    this.handlers[name] = handler;
  }

  map(callback) {
    this.recognizer.map(callback);
  }

  currentPath() {
    return pathFromHash(window.location.hash.split('?')[0]);
  }

  navigate(path, state = this.navigateState(), options = {}) {
    var newPath;
    var current = window.location.hash;
    if (!hasLeadingSlash(path)) {
      newPath = `#${this.currentPath()}${path}`;
    } else {
      newPath = `#${path}`;
    }
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

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }
}
