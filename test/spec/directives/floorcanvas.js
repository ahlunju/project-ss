'use strict';

describe('Directive: floorCanvas', function () {

  // load the directive's module
  beforeEach(module('projectSsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<floor-canvas></floor-canvas>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the floorCanvas directive');
  }));
});
