# Router

There are three main parts to setting up `jsrouter`:

- [Creating and configuring the router](./router-config.md)
- [Defining routes](./defining-routes.md)
- [Defining route handlers](./defining-handlers.md)

## Router Methods

## addHandler

> (handlerName: string, handlers: object): undefined

`addHandler` is used to define [route handlers](./defining-handlers.md).

```js
router.addHandler('home', {
  enter: function({path, lastPath, queryParams, params}) {
    console.log(`entered ${path} from ${lastPath}`);
  },
  leave: function({path, nextPath, queryParams, params}) {
    console.log(`left ${path} to go to ${nextPath}`);
  }
});
```

## map

> (matchCallback: function): undefined

`map` is used to [define routes](./defining-routes.md).

```js
router.map(function(match) {
  match('/').to('home');
  match('/profile/:id').to('profile');
  match('/page/*splat').to('page');
});
```

## currentPath

> (): path: string

Returns the current path (`window.location.hash`). `currentPath` does not include query params and ensures a leading and trailing slash.

```js
// current hash: #/somePath/here?a=1&b=2

router.currentPath(); // => /somePath/here/
```

## navigate

> (route: string, [state: object], [options: object]): path: string

`navigate` is used to change routes. It takes the path of the route as a string as the first argument, and optionally takes state as a second argument. This state is used as the state in `window.replaceState` (which is called by `navigate`, along with changing the `window.location.hash`). If no state is given, it uses [`navigateState`](./router-config.md#navigatestate) config function to get the state.

The third option taken by `navigate` is an optional options object.

### options

- `trigger` (boolean): If true, [`handleRouteChange`](./router-config.md#handleroutechange) will still be called on `navigate` even if the route has not changed.

```js
router.navigate('/myRoute');

// with state
router.navigate('/myRoute', {val1: 2, val2: 'abc'});

// with options
router.navigate('/myRoute', {val1: 2, val2: 'abc'}, {trigger: true});
```

## back

> (): undefined

Calls `window.history.back`

```js
router.back();
```

## forward

> (): undefined

Calls `window.history.forward`

```js
router.forward();
```
