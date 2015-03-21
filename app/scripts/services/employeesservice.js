'use strict';

/**
 * @ngdoc service
 * @name projectSsApp.employeesService
 * @description
 * # employeesService
 * Service in the projectSsApp.
 */
angular.module('projectSsApp')
  .factory('employeesService', function ($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var employeesUrl = 'http://loopbackapi.com:3000/api/Employees';
    return $resource(employeesUrl);
  });
