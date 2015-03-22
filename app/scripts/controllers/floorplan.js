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
  	$scope.myDesks = [
  		{
  			deskID: 0,
        v: 125,
  			x: 100
  		}, {
  			deskID: 1,
        v: 20,
  			x: 100
  		}, {
  			deskID: 2,
        v: 50,
  			x: 130
  		}, {
  			deskID: 3,
        v: 60,
  			x: 150
  		}, {
  			deskID: 4,
        v: 40,
  			x: 140
  		}, {
  			deskID: 5,
        v: 250,
  			x: 250
  		}, {
  			deskID: 6,
        v: 90,
  			x: 160
  		}, {
  			deskID: 7,
        v: 100,
  			x: 190
  		}, {
  			deskID: 8,
        v: 150,
  			x: 300
	}];
    $scope.getEmployees = function () {
    	$scope.employees = floorPlanService.getEmployees();
    };

    $scope.updateEmployees = function () {
    	floorPlanService.updateEmployees();
    };

    $scope.getEmployees();
  });
