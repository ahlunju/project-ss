'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplannerCtrl
 * @description
 * # FloorplannerCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp').controller('FloorplannerCtrl', function (floorPlanService, $scope) {
	// $scope.getEmployees(); // use local data for now
	$scope.employees = [
		{
			"name": "Yalun Zhu",
			"employeeID": 0,
			"deskID": 0
		},
		{
			"name": "Jon Snow",
			"employeeID": 1,
			"deskID": 1
		},
		{
			"name": "Hello World",
			"employeeID": 2,
			"deskID": 4
		},
		{
			"name": "Tony Stark",
			"employeeID": 3,
			"deskID": 2
		},
		{
			"name": "Ned Stark",
			"employeeID": 4,
			"deskID": 3
		}
	];
});
