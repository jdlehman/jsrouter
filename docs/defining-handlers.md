# Defining Handlers

Once you have [created](./router-config.md) your router and [defined](./defining-routes.md) your routes you need to add the handlers defined in your routes.

Each handler has an `enter` function that is called on entering the route as well as a `leave` function that is called on leaving a route.

Let's assume we have defined our routes:

```js
router.map(function(match) {
  match('/').to('home');
  match('/profile/:id').to('profile');
  match('/page/*splat').to('page');
});
```

## Adding a Handler

Navigating to `/` from `/something` calls the `enter` function below. Then navigating from `/` to `/something` calls the `leave` function below.

```js
router.addHandler('home', {
  enter: function({path, lastPath, queryParams, params}) {
    // path === '/'
    // lastPath === `/something'
    // queryParams === {}
    // params === {}
  },
  leave: function({path, nextPath, queryParams, params}) {
    // path === '/something'
    // lastPath === `/'
    // queryParams === {}
    // params === {}
  }
});
```

## Handlers With Query Params

Navigating to `/?name=test&num=2` from `/something`.

```js
router.addHandler('home', {
  enter: function({path, lastPath, queryParams, params}) {
    // path === '/?name=test&num=2'
    // lastPath === `/something'
    // queryParams === {name: 'test', num: '2'}
    // params === {}
  },
  leave: function({path, nextPath, queryParams, params}) {
  }
});
```

## Handlers With Dynamic Segments

Navigating to `/profile/123` from `/something`.

```js
router.addHandler('profile', {
  enter: function({path, lastPath, queryParams, params}) {
    // path === '/profile/123'
    // lastPath === `/something'
    // queryParams === {}
    // params === {id: '123'}
  },
  leave: function({path, nextPath, queryParams, params}) {
  }
});
```

## Handlers With Star Segments

Navigating to `/page/stuff/moreStuff` from `/something`.

```js
router.addHandler('page', {
  enter: function({path, lastPath, queryParams, params}) {
    // path === '/page/stuff/moreStuff'
    // lastPath === `/something'
    // queryParams === {}
    // params === {splat: 'stuff/moreStuff'}
  },
  leave: function({path, nextPath, queryParams, params}) {
  }
});
```
