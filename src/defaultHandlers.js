// @flow

export function defaultUnrecognizedRouteHandler() {
  this.navigate('/');
}

export function defaultNavigateState() {
  return {};
}
