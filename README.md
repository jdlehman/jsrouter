[![npm version](https://badge.fury.io/js/jsrouter.svg)](http://badge.fury.io/js/jsrouter)
[![Build Status](https://secure.travis-ci.org/jdlehman/jsrouter.svg?branch=master)](http://travis-ci.org/jdlehman/jsrouter)
[![Dependency Status](https://david-dm.org/jdlehman/jsrouter.svg)](https://david-dm.org/jdlehman/jsrouter)

# jsrouter

`jsrouter` is a minimal client side router based on `window.location.hash`. It utilizes [route-recognizer](https://github.com/tildeio/route-recognizer) to match routes and leans on this library for the API as well. For this reason, you will notice that the API is very similar to [Ember](http://emberjs.com/)'s [router](https://github.com/tildeio/router.js), though more minimal and with less lifecycle states.

## Installation

`npm install jsrouter`

## Usage

This is to provide a good idea of what the API looks like and what `jsrouter` can do. Check out the [documentation](docs/router.md) for more details as well as an in depth breakdown of the API.

### Create the router

```js
import Router from 'jsrouter';

// create a new router
var router = new Router();
```

### Define routes

```js
// define routes
router.map(function(match) {
  match('/').to('home'); // where "/" is the route and "home" is the handler name
  match('/signup').to('createAccount');
  match('/signin').to('login');
  match('/profile/:id').to('profile'); // where id is a dynamic route segment
  match('/parent').to('parent', function(match) { // nested routes
    match('/child').to('child', function(match) { // matches /parent/child and calls both handlers
      match('/*splat').to('everythingElse'); // "*splat" will match everything
    });
  });
});
```

[In depth documentation](/docs/defining-routes.md)

### Define handlers

```js
// define handlers
router.addHandler('home', {
  // enter/leave called when route is entered and left
  enter: function({path, lastPath, queryParams, params}) {
    // path === current path
    // lastPath === last path
    // queryParams === query parameters
    // params === dynamic matched segments or splats
  },
  leave: function({path, nextPath, queryParams, params}) {
  }
});
// etc...
```

[In depth documentation](/docs/defining-handlers.md)

### Using the router

```js
// using the router
router.navigate('/');
router.navigate('/signup', {promo: 'test'}); // optionally takes data to store in window.history.replaceState
router.navigate('/profile/1');

router.back(); // window.history.back();
router.forward(); // window.history.forward();
```

[In depth documentation](/docs/router.md)

## Configuration

The router takes an optional object as an argument that allows it to override default [configuration](/docs/router-config.md) and customize the behavior of the router.

```js
var router = new Router({
  unrecognizedRouteHandler: function() {
    this.navigate('/notFound');
  },
  // ...
  // etc.
});
```
