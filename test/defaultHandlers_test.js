import {assert} from 'chai';
import sinon from 'sinon';
import Router from 'router';
import {
  defaultUnrecognizedRouteHandler,
  defaultNavigateState,
  defaultLoad
} from 'defaultHandlers';

describe('defaultHandlers', function() {
  describe('defaultUnrecognizedRouteHandler', function() {
    it('navigates to the root', function() {
      var router = new Router();
      var navigateSpy = sinon.spy(router, 'navigate');
      defaultUnrecognizedRouteHandler.call(router);
      sinon.assert.calledWith(navigateSpy, '/');
      navigateSpy.restore();
    });
  });

  describe('defaultNavigateState', function() {
    it('returns an empty object', function() {
      assert.deepEqual(defaultNavigateState(), {});
    });
  });

  describe('defaultLoad', function() {
    it('calls navigate on the current path', function() {
      var router = new Router();
      var navigateSpy = sinon.spy(router, 'navigate');
      var navigateStateStub = sinon.stub(router, 'navigateState').returns('data');
      defaultLoad.call(router, '#/test');
      sinon.assert.calledWith(navigateSpy, '/test/', 'data', {trigger: true});
      navigateSpy.restore();
      navigateStateStub.restore();
    });
  });
});
