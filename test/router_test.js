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

    describe('options', function() {
      it('trigger option calls handleRouteChange even if route has not changed', function() {
        const handleRouteChangeSpy = sinon.spy();
        const router = new Router({handleBeforeChange: handleRouteChangeSpy});
        router.map(function(match) {
          match('/test').to('test');
        });
        router.addHandler('test', {});
        window.location.hash = '/test';
        router.navigate('/test', {}, {trigger: true});
        assert.equal(window.location.hash, '#/test');
        sinon.assert.called(handleRouteChangeSpy);
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
