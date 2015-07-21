export function hasLeadingSlash(path) {
  return path.charAt(0) === '/';
}

export function ensureLeadingSlash(path) {
  return hasLeadingSlash(path) ? path : `/${path}`;
}

export function ensureTrailingSlash(path) {
  return path.slice(-1) !== '/' ? `${path}/` : path;
}

export function pathFromURL(url) {
  return ensureTrailingSlash(
    ensureLeadingSlash(url.split('#')[1] || '/')
  );
}
