import {assert} from 'chai';
import sinon from 'sinon';
import Router from 'router';
import window from 'window';

describe('Router', function() {
  describe('#addHandler', function() {
    it('adds the handler to handlers object', function() {
      var router = new Router();
      var handlerName = 'handlerName';
      var handler = 'handler';
      router.addHandler(handlerName, handler);
      assert.equal(router.handlers[handlerName], handler);
    });
  });

  describe('#currentPath', function() {
    it('gets the current path', function() {
      window.location.hash = '/myPath/rocks';
      var router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('does not include query params', function() {
      window.location.hash = '/myPath/rocks?queryParmas=2&more=3';
      var router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('ensures leading slash', function() {
      window.location.hash = 'myPath/rocks';
      var router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });

    it('ensures trailing slash', function() {
      window.location.hash = '/myPath/rocks';
      var router = new Router();
      assert.equal(router.currentPath(), '/myPath/rocks/');
    });
  });

  describe('#navigate', function() {
    it('sets the history state with the given data if provided', function() {
      var router = new Router();
      var replaceStateStub = sinon.stub(window.history, 'replaceState');
      var data = {data: 'test'};
      router.navigate('/newPath', data);
      sinon.assert.calledWith(replaceStateStub, data, '', '/newPath');
      replaceStateStub.restore();
    });
  });

  describe('#back', function() {
    it('calls history.back()', function() {
      var historySpy = sinon.stub(window.history, 'back');
      var router = new Router();
      router.back();
      sinon.assert.calledOnce(historySpy);
    });
  });

  describe('#forward', function() {
    it('calls history.forward()', function() {
      var historySpy = sinon.stub(window.history, 'forward');
      var router = new Router();
      router.forward();
      sinon.assert.calledOnce(historySpy);
    });
  });
});
