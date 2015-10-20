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

The default behavior when a route is not recognized is to navigate to `/`. We can override this behavior with the `unrecognizedRouteHandler` config option. This function receives the `currentPath`, the `lastOrNextPath` (the last path if the router is entering a new route, and the next path if the router is leaving a route), and the `handlerName` as arguments.

```js
function myHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/unknownRoute');
}

var router = new Router({
  unrecognizedRouteHandler: myHandler
});
```

### handleLoad

The `handleLoad` option provides an optional function to be define that is called on the browser's `onLoad` event.

```js
function loadHandler(ev) {
  console.log('I loaded');
}

var router = new Router({
  handleLoad: loadHandler
});
```

### handleRouteChange

The default behavior when the hash changes is to call the leave handler and then call the enter handler. The `handleRouteChange` config option can be used to override this default behavior. This function receives an event object from the browser's `hashchange` event as an argument.

```js
function routeChange(ev) {
  var oldPath = pathFromURL(ev.oldURL);
  var newPath = pathFromURL(ev.newURL);

  console.log(`Going from ${oldPath} to ${newPath}`);
}

var router = new Router({
  handleRouteChange: routeChange
});
```

### handlePopState

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

The `navigateState` config option is a function that returns data to be used as the state in `window.history.replaceState` (which is called whenever the router navigates to a new route). The default behavior returns an empty object, `{}`, but can be overridden with this config option.

You can serialize your application state with `navigateState` and restore the state with [`handlePopState`](#handlepopstate) to get undo/redo functionality for your app with the browser's back/forward.

```js
function myState(ev) {
  return myApp.getState();
}

var router = new Router({
  navigateState: myState
});
```
