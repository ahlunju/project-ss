'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplanCtrl
 * @description
 * # FloorplanCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp')
  .controller('FloorplanCtrl', function ($scope, floorPlanService) {

    $scope.getEmployees = function () {
    	$scope.employees = floorPlanService.getEmployees();
    };

    $scope.updateEmployees = function () {
    	floorPlanService.updateEmployees();
    };

    $scope.getEmployees();
  });
