// @flow

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
import {hashchange as addHashChangeListener} from './polyfills';

function handleRouteChange(e) {
  const oldPath = pathFromHash(e.oldURL);
  const newPath = pathFromHash(e.newURL);
  const enterPaths = {lastPath: oldPath, path: newPath};
  const enterHandlers = getHandlers(this.handlers, this.recognizer, enterPaths, 'enter');
  const enterArgs = getFlattenedHandlerArgs(enterHandlers, enterPaths);

  // call enter handlers
  enterHandlers ? callHandlers(enterHandlers) : this.unrecognizedRouteHandler(oldPath, newPath);
  this.handleAfterChange(enterArgs);
}

function handleLoadEvent(e) {
  const path = pathFromHash(e.target.URL);
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
  addHashChangeListener(handleRouteChange.bind(this));
}

type RouteHandler = (oldPath: string, newPath: string) => void;
type EventHandler = (event: UIEvent, args: *) => void;

type RouterConfig = {
  unrecognizedRouteHandler?: RouteHandler,
  handleLoad?: (event: UIEvent, args: *) => void,
  handlePopState?: (event: UIEvent, args: *) => void,
  navigateState?: () => {};
  handleBeforeChange?: (leaveArgs: *) => void,
  handleAfterChange?: (enterArgs: *) => void,
  persistState?: * => void
}
export default class Router {
  recognizer: Recognizer;
  handlers: {};
  unrecognizedRouteHandler: RouteHandler;
  handleLoad: EventHandler;
  handlePopState: EventHandler;
  navigateState: () => {};
  handleBeforeChange: (leaveArgs: *) => void;
  handleAfterChange: (enterArgs: *) => void;
  persistState: ({}, title: string, url: string) => void;


  constructor(config: RouterConfig) {
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

  addHandler(name: string, handler: () => *) {
    this.handlers[name] = handler;
  }

  map = this.recognizer.map.bind(this.recognizer);

  currentPath() {
    return pathFromHash(window.location.hash.split('?')[0]);
  }

  navigate(path: string, state: {} = this.navigateState(), options:{} = {}) {
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
    const matches = this.currentPath().match(/(.*)(?:\/.+\/?)/);
    if (matches) {
      this.navigate(`${matches[1]}/`);
    }
  }
}
