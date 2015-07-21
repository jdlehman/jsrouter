import {assert} from 'chai';
import {
  hasLeadingSlash,
  ensureLeadingSlash,
  ensureTrailingSlash,
  pathFromURL
} from 'utils';

describe('utils', function() {
  describe('hasLeadingSlash', function() {
    it('returns true if it has a leading slash', function() {
      var path = '/test/something';
      assert.isTrue(hasLeadingSlash(path));
    });

    it('returns false if it does not have a leading slash', function() {
      var path = 'test/something';
      assert.isFalse(hasLeadingSlash(path));
    });
  });

  describe('ensureLeadingSlash', function() {
    it('adds leading slash to path without it', function() {
      var path = 'test/something/more';
      var newPath = ensureLeadingSlash(path);
      assert.equal(newPath, `/${path}`);
    });

    it('returns unmodified path if it already has leading slash', function() {
      var path = '/test/something/more';
      var newPath = ensureLeadingSlash(path);
      assert.equal(newPath, path);
    });
  });

  describe('ensureTrailingSlash', function() {
    it('adds trailing slash to path without it', function() {
      var path = '/test/something/more';
      var newPath = ensureTrailingSlash(path);
      assert.equal(newPath, `${path}/`);
    });

    it('returns unmodified path if it already has trailing slash', function() {
      var path = '/test/something/more/';
      var newPath = ensureTrailingSlash(path);
      assert.equal(newPath, path);
    });
  });

  describe('pathFromURL', function() {
    it('returns the path after hash from url', function() {
      var path = 'www.example.com/site/#/path/here';
      var newPath = pathFromURL(path);
      assert.equal(newPath, '/path/here/');
    });

    it('returns root if nothing after hash', function() {
      var path = 'www.example.com/site/#';
      var newPath = pathFromURL(path);
      assert.equal(newPath, '/');
    });

    it('ensures leading slash', function() {
      var path = 'www.example.com/site/#path/';
      var newPath = pathFromURL(path);
      assert.equal(newPath, '/path/');
    });

    it('ensures trailing slash', function() {
      var path = 'www.example.com/site/#/path';
      var newPath = pathFromURL(path);
      assert.equal(newPath, '/path/');
    });
  });
});
