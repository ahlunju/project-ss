'use strict';

describe('Service: employeesService', function () {

  // load the service's module
  beforeEach(module('projectSsApp'));

  // instantiate service
  var employeesService;
  beforeEach(inject(function (_employeesService_) {
    employeesService = _employeesService_;
  }));

  it('should do something', function () {
    expect(!!employeesService).toBe(true);
  });

});
