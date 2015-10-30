import {pathFromHash} from './utils';

export function defaultUnrecognizedRouteHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/');
}

export function defaultNavigateState() {
  return {};
}

export function defaultLoad(url) {
  var path = pathFromHash(url);
  this.navigate(path, this.navigateState(), {trigger: true});
}
