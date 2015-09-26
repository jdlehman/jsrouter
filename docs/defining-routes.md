# Defining Routes

Once you have [created](./router-config.md) your router, you can use that object to define routes.

Since `jsrouter` uses [`route-recognizer`](https://github.com/tildeio/route-recognizer) under the hood, reading that documentation might also be helpful/interesting.

## Basic routes

You can use the `map` function on the router to define routes. It takes a `match` function as an argument that provides the DSL to define our routes.

`match('/').to('home')` means when the `window.location.hash` matches `/` (aka `#/`) the `home` handler is called to handle the route.

```js
router.map(function(match) {
  match('/').to('home');
  match('/signup').to('createAccount');
  match('/signin').to('login');
});
```

So when we navigate to `/`, the `home` handler is called, and when we navigate to `/signup` the `createAccount` handler is called, etc. You can read more about defining handlers [here](./defining-handlers.md).

## Nested Routes

The `to` function also takes an optional callback for defining nested routes. We can nest as deeply as we want. When navigating to a nested route, it's parent's handler will be called first before then calling it's own handler.

```js
router.map(function(match) {
  match('/level1').to('level1', function(match) {
    match('/level2').to('level2', function(match) {
      match('/level3').to('level3');
    });
  });
});
```

This router matches routes `/level1`, `/level1/level2`, and `/level1/level2/level3`. Navigating to `/level1/level2/level3` will call the `level1` handler, then the `level2` handler, and then finally the `level3` handler.

## Dynamic Segments

We can also match [dynamic segments](https://github.com/tildeio/route-recognizer#usage) in our routes. The path `/user/:id/profile` will match `/user/abc123/profile` and `/user/1/profile` etc. The nice thing about dynamic segments is that the data will be passed to the [handler](./defining-handlers.md) on the params object, in this case `params.id`. A route can have multiple dynamic segments.

```js
router.map(function(match) {
  match('/user/:id').to('profile');
  match('/shopping/:category/items/:id').to('itemPage');
});
```

## Star Segments

We can also match [star segments](https://github.com/tildeio/route-recognizer#usage) in our routes. Star segments are similar to dynamic segments except that they greedily match the rest of the route. The path `/myPage/*everythingElse` will match `/myPage/something`, `/myPage/something/more/evenMore`, etc. The star segment data will be passed to the [handler](./defining-handlers.md) on the params object, in this case `params.everythingElse`.

```js
router.map(function(match) {
  match('/page/*theRest').to('pageHandler');
});
```
