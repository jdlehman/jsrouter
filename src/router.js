import Recognizer from 'route-recognizer';
import {
  defaultUnrecognizedRouteHandler,
  defaultNavigateState
} from './defaultHandlers';
import {
  hasLeadingSlash,
  pathFromURL,
  recognizeAndCallHandler,
  noop
} from './utils';

function handleRouteChange(e) {
  var oldPath = pathFromURL(e.oldURL);
  var newPath = pathFromURL(e.newURL);
  // call leave handlers
  this.handleBeforeChange(oldPath, newPath);
  recognizeAndCallHandler.call(this, oldPath, newPath, 'leave');

  // call enter handlers
  recognizeAndCallHandler.call(this, newPath, oldPath, 'enter');
  this.handleAfterChange(oldPath, newPath);
}

export default class Router {
  constructor({
    unrecognizedRouteHandler = defaultUnrecognizedRouteHandler.bind(this),
    handleLoad = noop,
    handlePopState = noop,
    navigateState = defaultNavigateState,
    handleBeforeChange = noop,
    handleAfterChange = noop,
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

    this.start();
  }

  start() {
    window.addEventListener('load', ::this.handleLoad);
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
    return pathFromURL(window.location.hash.split('?')[0]);
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
    window.history.replaceState(state, '', newPath);
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
