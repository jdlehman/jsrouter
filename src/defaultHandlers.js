export function defaultUnrecognizedRouteHandler(lastPath, path) {
  this.navigate('/');
}

export function defaultNavigateState() {
  return {};
}
