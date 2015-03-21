'use strict';

describe('Service: floorPlanService', function () {

  // load the service's module
  beforeEach(module('projectSsApp'));

  // instantiate service
  var floorPlanService;
  beforeEach(inject(function (_floorPlanService_) {
    floorPlanService = _floorPlanService_;
  }));

  it('should do something', function () {
    expect(!!floorPlanService).toBe(true);
  });

});
