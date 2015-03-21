'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplanCtrl
 * @description
 * # FloorplanCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp')
  .controller('FloorplanCtrl', function ($scope, employeesService) {
    $scope.getEmployees = function () {
    	employeesService.query(function (data) {
    		$scope.employees = data;
    		console.log(data);
    	});
    };

    $scope.getEmployees();
  });
