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

> (currentPath: string, lastOrNextPath: string, handlerName: string)

The default behavior when a route is not recognized is to navigate to `/`. We can override this behavior with the `unrecognizedRouteHandler` config option. This function receives the `currentPath`, the `lastOrNextPath` (the last path if the router is entering a new route, and the next path if the router is leaving a route), and the `handlerName` ("enter" or "leave") as arguments.

```js
function myHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/unknownRoute');
}

var router = new Router({
  unrecognizedRouteHandler: myHandler
});
```

### handleLoad

> (loadEvent: object)

The `handleLoad` option provides an optional function to be define that is called on the browser's `onLoad` event.

```js
function loadHandler(ev) {
  console.log('I loaded');
}

var router = new Router({
  handleLoad: loadHandler
});
```

### beforeRouteChange

> (oldPath: string, newPath: string)

Called before the `leave` handler is called during a route change. See the route change [lifecycle](./lifecycle.md) for more details.

```js
function beforeRouteChange(oldPath, newPath) {
  console.log(`Going from ${oldPath} to ${newPath}`);
}

var router = new Router({
  handleBeforeChange: beforeRouteChange
});
```

### afterRouteChange

> (oldPath: string, newPath: string)

Called after the `enter` handler is called during a route change. See the route change [lifecycle](./lifecycle.md) for more details.

```js
function afterRouteChange(oldPath, newPath) {
  console.log(`Went from ${oldPath} to ${newPath}`);
}

var router = new Router({
  afterBeforeChange: afterRouteChange
});
```

### handlePopState

> (popStateEvent: object)

The `handlePopState` config option provides an optional function to be called on the browser's `popstate` event. This function takes the event object from the `popstate` event as an argument. There is no default behavior in the router for `popstate`.

You can serialize your application state with [`navigateState`](#navigatestate) and restore the state with `handlePopState` to get undo/redo functionality for your app with the browser's back/forward.

```js
function popStateHandler(ev) {
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
