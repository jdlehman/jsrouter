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
});
