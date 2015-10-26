import Recognizer from 'route-recognizer';
import {
  defaultUnrecognizedRouteHandler,
  defaultHandleRouteChange,
  defaultNavigateState
} from './defaultHandlers';
import {
  hasLeadingSlash,
  pathFromURL
} from './utils';

function noop() {}

export default class Router {
  constructor(config = {}) {
    this.recognizer = new Recognizer();
    this.handlers = {};

    // handle config
    this.unrecognizedRouteHandler = config.unrecognizedRouteHandler || defaultUnrecognizedRouteHandler;
    this.handleLoad = config.handleLoad || noop;
    this.handleRouteChange = config.handleRouteChange || defaultHandleRouteChange;
    this.handlePopState = config.handlePopState || noop;
    this.navigateState = config.navigateState || defaultNavigateState;

    this.start();
  }

  start() {
    window.addEventListener('load', ::this.handleLoad);
    window.addEventListener('popstate', ::this.handlePopState);
    window.addEventListener('hashchange', ::this.handleRouteChange);
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
      this.handleRouteChange({
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
