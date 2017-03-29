# Changelog

## 2.0.0 (2017-03-29)

Changed:

- Popping a route that is not nested will navigate to the root, rather than doing nothing. [21ef7fa](../../commit/21ef7fa)

## 1.0.2 (2016-10-26)

Added:

- Moved build to [rollup](http://rollupjs.org/) which reduces build size and adds more build file types to consume depending on a user's needs. [0d22809](../../commit/0d22809)

## 1.0.1 (2016-4-18)

Fixed:

- Fix `hashchange` on older browsers (IE8-11). Adds polyfill to provide `oldURL` and `newURL` properties on the `hashchange` event. [7d10c81](../../commit/7d10c81)

## 1.0.0 (2016-4-5)

Fixed:

- Before handlers and leave handlers called BEFORE route is actually changed.

Changed:

- Pass more information in before and after change handlers. [f0d42d5](../../commit/f0d42d5)
- Pass more information in load and popstate handlers. [dac14436](../../commit/dac14436)

Added:

- Cancel route change if `handleBeforeChange` returns false. [8a1aacf](../../commit/8a1aacf)

## 0.7.0 (2016-3-17)

Fixed:

- Call enter handler on load, but not by calling navigate as that causes issues in edge cases. [e2465c7](../../commit/e2465c7)

## 0.6.0 (2016-2-18)

Added:

- Add `pop` method to router that navigates to a new route found by popping off the last segment of the route. eg. `/route1/route2/` pops to `/route1/`. [312b1b7](../../commit/312b1b7)

## 0.5.0

Fixed:

- `unrecognizedRouteHandler` is now only called when a route is being entered, not when it is left. This prevents the handler from being called twice on unrecognized routes. [579e27a](../../commit/579e27a)

## 0.4.0 (2015-10-30)

Added:

- Added new lifecycle hooks `beforeRouteChange` and `afterRouteChange` that are called before the `leave` handler and `after` the enter handler respectively. [4f2eba7](../../commit/4f2eba7)
- Added `persistState` configuration instead of always using `window.history.replaceState`. `replaceState` is still the default, but now `pushState` or another function can be used in its stead. [ef57f12](../../commit/ef57f12)

Fixed:

- Bug where default route change behavior could be overridden with `handleRouteChange` config hook. [4f2eba7](../../commit/4f2eba7)
- Bug where `enter` route handler was not called on load. [52067c4](../../commit/52067c4)

Breaking Changes:

- Removed `handleRouteChange` hook as using it caused the router to not work. Use `beforeRouteChange` and `afterRouteChange` hooks instead. [4f2eba7](../../commit/4f2eba7)

## 0.3.0 (2015-10-26)

Added:

- Added optional `options` argument to `navigate` function. Supports `trigger` option that forces `handleRouteChange` to be called even if the route has not changed. [5e2f120](../../commit/5e2f120)

## 0.2.0 (2015-10-12)

Changed:

- Removed use of `window` external in webpack configuration. This means there is less configuration to use `jsrouter` as a `window` module does not need to be provided. [0e2bbd0](../../commit/0e2bbd0)

## 0.1.0 (2015-09-26)

- Updated dependencies and enough documentation to warrant a minor release.

## 0.0.5 (2015-07-21)

- Initial stable release.
