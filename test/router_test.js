import {assert} from 'chai';
import sinon from 'sinon';
import Router from 'router';

describe('Router', function() {
  describe('config', function() {
    describe('persistState', function() {
      it('defaults to window.history.replaceState', function() {
        const persistSpy = sinon.spy(window.history, 'replaceState');
        const router = new Router();
        router.navigate('/');
        sinon.assert.calledOnce(persistSpy);
        persistSpy.restore();
      });

      it('calls user defined function', function() {
        const persistSpy = sinon.spy();
        const router = new Router({
          persistState: persistSpy
        });
        router.navigate('/');
        sinon.assert.calledOnce(persistSpy);
      });
    });
  });

  describe('#addHandler', function() {
    it('adds the handler to handlers object', function() {
      const router = new Router();
      const handlerName = 'handlerName';
      const handler = 'handler';
      router.addHandler(handlerName, handler);
      assert.equal(router.handlers[handlerName], handler);
    });
  });

  describe('#map', function() {
    it('delegates to route-recognizer#map', function() {
      const router = new Router();
      const recognizerStub = sinon.stub(router.recognizer, 'map');
      router.map(match => {
        match('pathOne').to('oneHandler', matchh => {
          matchh('nestedOne').to('nestedOneHandler');
        });
        match('pathTwo').to('twoHandler');
      });
      sinon.assert.calledOnce(recognizerStub);
      recognizerStub.restore();
    });
  });

  describe('#currentPath', function() {
    it('gets the current path', function() {
      window.location.hash = '/myPath/rocks';
      const router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('does not include query params', function() {
      window.location.hash = '/myPath/rocks?queryParmas=2&more=3';
      const router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('ensures leading slash', function() {
      window.location.hash = 'myPath/rocks';
      const router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('ensures trailing slash', function() {
      window.location.hash = '/myPath/rocks';
      const router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });
  });

  describe('#navigate', function() {
    it('sets the history state with the given data if provided', function() {
      const router = new Router();
      const replaceStateStub = sinon.stub(window.history, 'replaceState');
      const data = {data: 'test'};
      router.navigate('/newPath', data);
      sinon.assert.calledWith(replaceStateStub, data, '', '#/newPath');
      replaceStateStub.restore();
    });

    it('sets the route correctly', function() {
      const router = new Router();
      router.navigate('/test');
      assert.equal(window.location.hash, '#/test');
    });

    it('pushes a relative route to the end of the url', function() {
      const router = new Router();
      window.location.hash = '/startingRoute/more';
      router.navigate('end');
      assert.equal(window.location.hash, '#/startingRoute/more/end');
    });

    it('does not change when handleBeforeChange returns false', function() {
      const router = new Router({
        handleBeforeChange: () => false
      });
      window.location.hash = '/startingRoute';
      router.navigate('/newRoute');
      assert.equal(window.location.hash, '#/startingRoute');
    });

    it('calls beforeChange, leaveHandlers, enterHandlers, then afterChange', function(done) {
      const queue = [];
      const router = new Router({
        handleBeforeChange: ({path}) => {
          // prevents other tests from breaking this one
          if (path === '/parent/child/child2/') {
            queue.push('before');
          }
        },
        handleAfterChange: ({path}) => {
          // prevents other tests from breaking this one
          if (path === '/newParent/newChild/newChild2/') {
            queue.push('after');
          }
        }
      });
      router.map(match => {
        match('/parent').to('parentHandler', match2 => {
          match2('/child').to('childHandler', match3 => {
            match3('/child2').to('child2Handler');
          });
        });
        match('/newParent').to('newParentHandler', match2 => {
          match2('/newChild').to('newChildHandler', match3 => {
            match3('/newChild2').to('newChild2Handler');
          });
        });
      });
      router.addHandler('parentHandler', {
        leave: () => queue.push('leaveParent'),
        enter: () => {}
      });
      router.addHandler('childHandler', {
        leave: () => queue.push('leaveChild'),
        enter: () => {}
      });
      router.addHandler('child2Handler', {
        leave: () => queue.push('leaveChild2'),
        enter: () => {}
      });

      router.addHandler('newParentHandler', {
        enter: () => queue.push('enterNewParent'),
        leave: () => {}
      });
      router.addHandler('newChildHandler', {
        enter: () => queue.push('enterNewChild'),
        leave: () => {}
      });
      router.addHandler('newChild2Handler', {
        enter: () => queue.push('enterNewChild2'),
        leave: () => {}
      });
      router.navigate('/parent/child/child2');
      router.navigate('/newParent/newChild/newChild2');
      // need to wait until next tick for enter handlers to be called
      // after the hashchange event
      setTimeout(function() {
        assert.deepEqual(queue, [
          'before',
          'leaveParent', 'leaveChild', 'leaveChild2',
          'enterNewParent', 'enterNewChild', 'enterNewChild2',
          'after'
        ]);
        done();
      }, 0);
    });

    describe('options', function(done) {
      it('trigger option calls handleRouteChange even if route has not changed', function() {
        const handleRouteChangeSpy = sinon.spy();
        const router = new Router({handleBeforeChange: handleRouteChangeSpy});
        router.map(function(match) {
          match('/test').to('test');
        });
        router.addHandler('test', {});
        window.location.hash = '/test';
        router.navigate('/test', {}, {trigger: true});
        setTimeout(() => {
          assert.equal(window.location.hash, '#/test');
          sinon.assert.called(handleRouteChangeSpy);
          done();
        }, 0);
      });
    });
  });

  describe('#back', function() {
    it('calls history.back()', function() {
      const historySpy = sinon.stub(window.history, 'back');
      const router = new Router();
      router.back();
      sinon.assert.calledOnce(historySpy);
    });
  });

  describe('#forward', function() {
    it('calls history.forward()', function() {
      const historySpy = sinon.stub(window.history, 'forward');
      const router = new Router();
      router.forward();
      sinon.assert.calledOnce(historySpy);
    });
  });

  describe('#pop', function() {
    beforeEach(function() {
      this.router = new Router();
      this.navigateSpy = sinon.spy(this.router, 'navigate');
    });

    afterEach(function() {
      this.router.currentPath.restore();
      this.router.navigate.restore();
    });

    it('does nothing when currentPath is not nested', function() {
      sinon.stub(this.router, 'currentPath').returns('/foo/');
      this.router.pop();
      sinon.assert.notCalled(this.router.navigate);
    });

    it('calls #navigate with the parent path when currentPath is nested', function() {
      sinon.stub(this.router, 'currentPath').returns('/foo/bar/');
      this.router.pop();
      sinon.assert.calledWith(this.router.navigate, '/foo/');
    });

    it('does nothing when currentPath is the root path', function() {
      sinon.stub(this.router, 'currentPath').returns('/');
      this.router.pop();
      sinon.assert.notCalled(this.router.navigate);
    });
  });
});
