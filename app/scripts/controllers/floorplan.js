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
  	$scope.myEmployees = [
  		{
  			v: 25,
  			x: 10
  		}, {
  			v: 0,
  			x: 20
  		}, {
  			v: 50,
  			x: 30
  		}, {
  			v: 60,
  			x: 50
  		}, {
  			v: 40,
  			x: 40
  		}, {
  			v: 250,
  			x: 250
  		}, {
  			v: 30,
  			x: 60
  		}, {
  			v: 30,
  			x: 90
  		}, {
  			v: 50,
  			x: 100
	}];
    $scope.getEmployees = function () {
    	$scope.employees = floorPlanService.getEmployees();
    };

    $scope.updateEmployees = function () {
    	floorPlanService.updateEmployees();
    };

    $scope.getEmployees();
  });
