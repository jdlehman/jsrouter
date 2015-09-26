# Router

There are three main parts to setting up `jsrouter`:

- [Creating and configuring the router](./router-config.md)
- [Defining routes](./defining-routes.md)
- [Defining route handlers](./defining-handlers.md)

## Router Methods

## addHandler

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

`map` is used to [define routes](./defining-routes.md).

```js
router.map(function(match) {
  match('/').to('home');
  match('/profile/:id').to('profile');
  match('/page/*splat').to('page');
});
```

## currentPath

Returns the current path (`window.location.hash`). `currentPath` does not include query params and ensures a leading and trailing slash.

```js
// current hash: #/somePath/here?a=1&b=2

router.currentPath(); // => /somePath/here/
```

## navigate

`navigate` is used to change routes. It takes the path of the route as a string as the first argument, and optionally takes state as a second argument. This state is used as the state in `window.replaceState` (which is called by `navigate`, along with changing the `window.location.hash`). If no state is given, it uses [`navigateState`](./router-config.md#navigatestate) config function to get the state.

```js
router.navigate('/myRoute');

// with state
router.navigate('/myRoute', {val1: 2, val2: 'abc'});
```

## back

Calls `window.history.back`

```js
router.back();
```

## forward

Calls `window.history.forward`

```js
router.forward();
```
