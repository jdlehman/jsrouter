# Router Configuration

Creating a router is as simple as instantiating a new `Router` object.

```js
import Router from 'jsrouter';
// or without ES6
// var Router = require('jsrouter');

var router = new Router();
```

The above will create a router with the default configuration. The `Router` constructor also takes a configuration object as an argument.

## Configuration Options

### unrecognizedRouteHandler

> (lastPath: string, path: string)

The default behavior when a route is not recognized is to navigate to `/`. We can override this behavior with the `unrecognizedRouteHandler` config option. This function receives the `path` and the `lastPath`.

```js
function myHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/unknownRoute');
}

var router = new Router({
  unrecognizedRouteHandler: myHandler
});
```

### handleLoad

> (loadEvent: object, {path: string, queryParams: object, params: object}: object)

The `handleLoad` option provides an optional function to be defined that is called on the browser's `onLoad` event. It receives the browser's `load` event object, as well as an object containing data about the current path. The `params` key receives values from the [dynamic segments](./defining-routes.md#dynamic-segments) in the route (if any).

```js
function loadHandler(ev, {path, params, queryParams}) {
  console.log(`I loaded ${path}`);
}

var router = new Router({
  handleLoad: loadHandler
});
```

### handleBeforeChange

> ({path: string, nextPath: string, queryParams: object, params: object}: object)

Called before the `leave` handler is called during a route change. See the route change [lifecycle](./lifecycle.md) for more details. If this handler returns false, then the route change is cancelled. If the route is invalid (does not match a defined route), `queryParams` and `params` will not exist. The `params` key receives values from the [dynamic segments](./defining-routes.md#dynamic-segments) in the route (if any). Invalid routes should be handled by [`unrecognizedRouteHandler`](#unrecognizedroutehandler).

```js
function beforeRouteChange({path, nextPath, queryParams, params}) {
  console.log(`Going from ${path} to ${nextPath}`);
}

var router = new Router({
  handleBeforeChange: beforeRouteChange
});
```

### handleAfterChange

> ({path: string, lastPath: string, queryParams: object, params: object}: object)

Called after the `enter` handler is called during a route change. See the route change [lifecycle](./lifecycle.md) for more details. If the route is invalid (does not match a defined route), `queryParams` and `params` will not exist. The `params` key receives values from the [dynamic segments](./defining-routes.md#dynamic-segments) in the route (if any). Invalid routes should be handled by [`unrecognizedRouteHandler`](#unrecognizedroutehandler).

```js
function afterRouteChange({path, lastPath, queryParams, params}) {
  console.log(`Went from ${lastPath} to ${path}`);
}

var router = new Router({
  handleAfterChange: afterRouteChange
});
```

### handlePopState

> (popStateEvent: object, {path: string, queryParams: object, params: object}: object)

The `handlePopState` config option provides an optional function to be called on the browser's `popstate` event. It receives the browser's `popstate` event object, as well as an object containing data about the current path. The `params` key receives values from the [dynamic segments](./defining-routes.md#dynamic-segments) in the route (if any).

You can serialize your application state with [`navigateState`](#navigatestate) and restore the state with `handlePopState` to get undo/redo functionality for your app with the browser's back/forward.

```js
function popStateHandler(ev, {path, params, queryParams}) {
  console.log(`State was popped: ${ev.state}`);
}

var router = new Router({
  handlePopState: popStateHandler
});
```

### navigateState

> (): state: any

The `navigateState` config option is a function that returns data to be used as the state in [`persistState`](#persiststate), which is called whenever the router navigates to a new route. The default behavior returns an empty object, `{}`, but can be overridden with this config option.

If you set `persistState` to `window.history.pushState`, you can serialize your application state with `navigateState` and restore the state with [`handlePopState`](#handlepopstate) to get undo/redo functionality for your app with the browser's back/forward.

```js
function myState(ev) {
  return myApp.getState();
}

var router = new Router({
  navigateState: myState
});
```

### persistState

> (state: any, '', newPath: string)

The `persistState` config option is a function called whenever [`Router#navigate`](./router.md#navigate) is called. It defaults to [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API), though you may want to use `window.history.pushState` or your own function instead. This function conforms to the `pushState`/`replaceState` API and receives the state defined by [`navigateState`](#navigatestate) an empty string and the new path as a string.
