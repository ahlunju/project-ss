'use strict';

describe('Controller: FloorplannerCtrl', function () {

  // load the controller's module
  beforeEach(module('projectSsApp'));

  var FloorplannerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FloorplannerCtrl = $controller('FloorplannerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
