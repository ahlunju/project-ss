'use strict';

describe('Service: floorFactory', function () {

  // load the service's module
  beforeEach(module('projectSsApp'));

  // instantiate service
  var floorFactory;
  beforeEach(inject(function (_floorFactory_) {
    floorFactory = _floorFactory_;
  }));

  it('should do something', function () {
    expect(!!floorFactory).toBe(true);
  });

});
