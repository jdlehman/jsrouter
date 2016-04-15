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
  noop,
  isFalse
} from './utils';

let IEoldURL = '';

function handleRouteChange(e) {
  const oldURL = e.oldURL || IEoldURL;
  const newURL = e.newURL || window.location.hash;
  IEoldURL = newURL;
  const oldPath = pathFromHash(oldURL);
  const newPath = pathFromHash(newURL);
  const enterPaths = {lastPath: oldPath, path: newPath};
  const enterHandlers = getHandlers(this.handlers, this.recognizer, enterPaths, 'enter');
  const enterArgs = getFlattenedHandlerArgs(enterHandlers, enterPaths);

  // call enter handlers
  enterHandlers ? callHandlers(enterHandlers) : this.unrecognizedRouteHandler(oldPath, newPath);
  this.handleAfterChange(enterArgs);
}

function handleLoadEvent(e) {
  const path = pathFromHash(e.target.URL);
  IEoldURL = e.target.URL;
  const enterHandlers = getHandlers(this.handlers, this.recognizer, {path}, 'enter');
  enterHandlers && callHandlers(enterHandlers);
  const args = getFlattenedHandlerArgs(enterHandlers, {path});
  this.handleLoad(e, args);
}

function handlePop(e) {
  const path = this.currentPath();
  const handlers = getHandlers(this.handlers, this.recognizer, {path});
  const args = getFlattenedHandlerArgs(handlers, {path});
  this.handlePopState(e, args);
}

function registerListeners() {
  window.addEventListener('load', handleLoadEvent.bind(this));
  window.addEventListener('popstate', handlePop.bind(this));
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
    const newPath = hasLeadingSlash(path) ? `#${path}` : `#${this.currentPath()}${path}`;
    const current = window.location.hash;

    // call leave handlers
    const leavePaths = {path: pathFromHash(current), nextPath: pathFromHash(newPath)};
    const leaveHandlers = getHandlers(this.handlers, this.recognizer, leavePaths, 'leave');
    const leaveArgs = getFlattenedHandlerArgs(leaveHandlers, leavePaths);
    const shouldChange = this.handleBeforeChange(leaveArgs);
    if (isFalse(shouldChange)) { return; } // prevent path change if false
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
