import Recognizer from 'route-recognizer';
import {
  defaultUnrecognizedRouteHandler,
  defaultNavigateState
} from './defaultHandlers';
import {
  hasLeadingSlash,
  pathFromHash,
  callHandlers,
  getHandlers,
  getFlattenedHandlerArgs,
  noop
} from './utils';

function handleRouteChange(e) {
  const oldPath = pathFromHash(e.oldURL);
  const newPath = pathFromHash(e.newURL);

  const leavePaths = {path: oldPath, nextPath: newPath};
  const enterPaths = {lastPath: oldPath, path: newPath};
  const leaveHandlers = getHandlers(this.handlers, this.recognizer, leavePaths, 'leave');
  const enterHandlers = getHandlers(this.handlers, this.recognizer, enterPaths, 'enter');
  const leaveArgs = getFlattenedHandlerArgs(leaveHandlers, leavePaths);
  const enterArgs = getFlattenedHandlerArgs(enterHandlers, enterPaths);

  // call leave handlers
  this.handleBeforeChange(leaveArgs);
  leaveHandlers && callHandlers(leaveHandlers);

  // call enter handlers
  enterHandlers ? callHandlers(enterHandlers) : this.unrecognizedRouteHandler(oldPath, newPath);
  this.handleAfterChange(enterArgs);
}

function handleLoadEvent(e) {
  const path = pathFromHash(e.target.URL);
  const enterHandlers = getHandlers(this.handlers, this.recognizer, {path}, 'enter');
  enterHandlers && callHandlers(enterHandlers);
  this.handleLoad(e);
}

function registerListeners() {
  window.addEventListener('load', handleLoadEvent.bind(this));
  window.addEventListener('popstate', this.handlePopState);
  window.addEventListener('hashchange', handleRouteChange.bind(this));
}

export default class Router {
  constructor(config) {
    const defaults = {
      unrecognizedRouteHandler: defaultUnrecognizedRouteHandler.bind(this),
      handleLoad: noop,
      handlePopState: noop,
      navigateState: defaultNavigateState,
      handleBeforeChange: noop,
      handleAfterChange: noop,
      persistState: (...args) => window.history.replaceState(...args)
    };

    const {
      unrecognizedRouteHandler,
      handleLoad,
      handlePopState,
      navigateState,
      handleBeforeChange,
      handleAfterChange,
      persistState
    } = {...defaults, ...config};

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
    let newPath;
    const current = window.location.hash;
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

  pop() {
    const matches = this.currentPath().match(/(.+)(?:\/.+\/?)/);
    if (matches) {
      this.navigate(`${matches[1]}/`);
    }
  }
}
