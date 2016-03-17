export function defaultUnrecognizedRouteHandler(path, lastOrNextPath, handlerName) {
  this.navigate('/');
}

export function defaultNavigateState() {
  return {};
}
