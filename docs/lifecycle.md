# Route Change Lifecycle Hooks

When the hash changes the `leave` handler is called and then the `enter` handler is called. The before and after config options, `handleBeforeChange` and `handleAfterChange` respectively, can be used to perform extra logic during this behavior. These functions receive the old url and the new url as arguments and are called before enter and after leave.

```js
function beforeRouteChange({path, nextPath, queryParams, params}) {
  console.log(`Going from ${path} to ${nextPath}`);
}

function afterRouteChange({path, lastPath, queryParams, params}) {
  console.log(`Went from ${lastPath} to ${path}`);
}

var router = new Router({
  handleBeforeChange: beforeRouteChange,
  handleAfterChange: afterRouteChange
});

router.map(function(match) {
  match('/').to('home');
  match('/page').to('page');
});

router.addHandler('home', {
  enter: function({path, lastPath, queryParams, params}) {
    console.log('entering home');
  },
  leave: function({path, lastPath, queryParams, params}) {
    console.log('leaving home');
  },
});

router.addHandler('page', {
  enter: function({path, lastPath, queryParams, params}) {
    console.log('entering page');
  },
  leave: function({path, lastPath, queryParams, params}) {
    console.log('leaving page');
  },
});
```

Assuming the above configuration and if we are already the `home` route (our browser is at `/`), navigating to the `page` route would produce the following output:

```js
router.navigate('/page');

// Going from / to /page
// leaving home
// entering page
// Went from / to /page
```
