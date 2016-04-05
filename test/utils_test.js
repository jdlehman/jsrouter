import {assert} from 'chai';
import sinon from 'sinon';
import Recognizer from 'route-recognizer';
import {
  noop,
  isFalse,
  hasLeadingSlash,
  ensureLeadingSlash,
  ensureTrailingSlash,
  pathFromHash,
  getHandlers,
  callHandlers,
  getFlattenedHandlerArgs
} from 'utils';

describe('utils', function() {
  describe('noop', function() {
    it('is a function', function() {
      assert.isFunction(noop);
    });
  });

  describe('isFalse', function() {
    it('returns false if value is undefined and not falsey', function() {
      assert.isFalse(isFalse(undefined));
      assert.isFalse(isFalse(true));
      assert.isFalse(isFalse(2));
    });

    it('returns true if value is false or null', function() {
      assert.isTrue(isFalse(false));
      assert.isTrue(isFalse(null));
    });
  });

  describe('hasLeadingSlash', function() {
    it('returns true if it has a leading slash', function() {
      const path = '/test/something';
      assert.isTrue(hasLeadingSlash(path));
    });

    it('returns false if it does not have a leading slash', function() {
      const path = 'test/something';
      assert.isFalse(hasLeadingSlash(path));
    });
  });

  describe('ensureLeadingSlash', function() {
    it('adds leading slash to path without it', function() {
      const path = 'test/something/more';
      const newPath = ensureLeadingSlash(path);
      assert.equal(newPath, `/${path}`);
    });

    it('returns unmodified path if it already has leading slash', function() {
      const path = '/test/something/more';
      const newPath = ensureLeadingSlash(path);
      assert.equal(newPath, path);
    });
  });

  describe('ensureTrailingSlash', function() {
    it('adds trailing slash to path without it', function() {
      const path = '/test/something/more';
      const newPath = ensureTrailingSlash(path);
      assert.equal(newPath, `${path}/`);
    });

    it('returns unmodified path if it already has trailing slash', function() {
      const path = '/test/something/more/';
      const newPath = ensureTrailingSlash(path);
      assert.equal(newPath, path);
    });
  });

  describe('pathFromHash', function() {
    it('returns the path after hash from url', function() {
      const path = 'www.example.com/site/#/path/here';
      const newPath = pathFromHash(path);
      assert.equal(newPath, '/path/here/');
    });

    it('returns root if nothing after hash', function() {
      const path = 'www.example.com/site/#';
      const newPath = pathFromHash(path);
      assert.equal(newPath, '/');
    });

    it('ensures leading slash', function() {
      const path = 'www.example.com/site/#path/';
      const newPath = pathFromHash(path);
      assert.equal(newPath, '/path/');
    });

    it('ensures trailing slash', function() {
      const path = 'www.example.com/site/#/path';
      const newPath = pathFromHash(path);
      assert.equal(newPath, '/path/');
    });
  });

  describe('getHandlers', function() {
    beforeEach(function() {
      this.recognizer = new Recognizer();
      this.recognizer.map(match => {
        match('/home/:data').to('home');
        match('/nested').to('nested', matchh => {
          matchh('/second').to('second', matchhh => {
            matchhh('/third/:id').to('third');
          });
        });
      });
      this.handlers = {
        home: {enter: 'homeEnter', leave: 'homeLeave'},
        nested: {enter: 'nestedEnter', leave: 'nestedLeave'},
        second: {enter: 'secondEnter', leave: 'secondLeave'},
        third: {enter: 'thirdEnter', leave: 'thirdLeave'}
      };
    });

    it('returns null if route is not recognized', function() {
      const handlers = getHandlers(
        this.handlers,
        this.recognizer,
        {path: '/notRecognized', lastPath: '/home'},
        'enter'
      );
      assert.isNull(handlers);
    });

    it('returns handlers for route', function() {
      const enterHandlers = getHandlers(
        this.handlers,
        this.recognizer,
        {path: '/home/hello?query1=2&query2=abc', lastPath: '/last'},
        'enter'
      );
      const leaveHandlers = getHandlers(
        this.handlers,
        this.recognizer,
        {path: '/home/hello?query1=2&query2=abc', nextPath: '/next'},
        'leave'
      );
      const sharedArgs = {
        queryParams: {query1: '2', query2: 'abc'},
        params: {data: 'hello'}
      };
      assert.deepEqual(enterHandlers, [
        {
          handler: 'homeEnter',
          args: {...sharedArgs, path: '/home/hello', lastPath: '/last'}
        }
      ]);
      assert.deepEqual(leaveHandlers, [
        {
          handler: 'homeLeave',
          args: {...sharedArgs, path: '/home/hello', nextPath: '/next'}
        }
      ]);
    });

    it('returns handlers for nested route', function() {
      const enterHandlers = getHandlers(
        this.handlers,
        this.recognizer,
        {path: '/nested/second/third/123?query1=24&query2=abc', lastPath: '/last'},
        'enter'
      );
      const leaveHandlers = getHandlers(
        this.handlers,
        this.recognizer,
        {path: '/nested/second/third/123?query1=24&query2=abc', nextPath: '/next'},
        'leave'
      );
      const queryParams = {query1: '24', query2: 'abc'};
      assert.deepEqual(enterHandlers, [
        {
          handler: 'nestedEnter',
          args: {queryParams, params: {}, path: '/nested/second/third/123', lastPath: '/last'}
        },
        {
          handler: 'secondEnter',
          args: {queryParams, params: {}, path: '/nested/second/third/123', lastPath: '/last'}
        },
        {
          handler: 'thirdEnter',
          args: {queryParams, params: {id: '123'}, path: '/nested/second/third/123', lastPath: '/last'}
        }
      ]);
      assert.deepEqual(leaveHandlers, [
        {
          handler: 'nestedLeave',
          args: {queryParams, params: {}, path: '/nested/second/third/123', nextPath: '/next'}
        },
        {
          handler: 'secondLeave',
          args: {queryParams, params: {}, path: '/nested/second/third/123', nextPath: '/next'}
        },
        {
          handler: 'thirdLeave',
          args: {queryParams, params: {id: '123'}, path: '/nested/second/third/123', nextPath: '/next'}
        }
      ]);
    });
  });

  describe('callHandlers', function() {
    it('calls valid handlers with their args', function() {
      const handlerSpy1 = sinon.spy();
      const handlerSpy2 = sinon.spy();
      const args1 = ['args1', 'stuff'];
      const args2 = 'args2';
      const handlers = [
        {handler: 'invalid'},
        {handler: handlerSpy1, args: args1},
        {handler: handlerSpy2, args: args2}
      ];

      callHandlers(handlers);
      sinon.assert.calledWith(handlerSpy1, args1);
      sinon.assert.calledWith(handlerSpy2, args2);
    });
  });

  describe('getFlattendHandlerArgs', function() {
    it('flattens and returns handler args', function() {
      const handlers = [
        {
          handler: function() {},
          args: {
            queryParams: {a: '2', b: '3'},
            path: '/test',
            nextPath: '/nextTest/something',
            params: {key1: 'firstHandler', duplicateKey: 'firstHandler'}
          }
        },
        {
          handler: function() {},
          args: {
            queryParams: {a: '2', b: '3'},
            path: '/test',
            nextPath: '/nextTest/something',
            params: {duplicateKey: 'secondHandler', key4: 'secondHandler'}
          }
        }
      ];
      const flattened = getFlattenedHandlerArgs(handlers, 'startingArgs');
      assert.deepEqual(flattened, {
        queryParams: {a: '2', b: '3'},
        path: '/test',
        nextPath: '/nextTest/something',
        params: {key1: 'firstHandler', duplicateKey: 'secondHandler', key4: 'secondHandler'}
      });
    });

    it('returns startingArgs if no handlers', function() {
      const startingArgs = {
        nextPath: '/test',
        path: '/current'
      };
      const flattened = getFlattenedHandlerArgs(null, startingArgs);
      assert.deepEqual(flattened, startingArgs);
    });
  });
});
