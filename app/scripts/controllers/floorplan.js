'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplanCtrl
 * @description
 * # FloorplanCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp')
.controller('FloorplanCtrl', function ($scope, floorPlanService, floorFactory) {
	$scope.FloorFactory = floorFactory;
	$scope.myDesks = [
		{
			deskID: 9,
		y: 210,
			x: 650
		},
		{
			deskID: 0,
		y: 150,
			x: 510
		}, {
			deskID: 1,
		y: 210,
			x: 380
		}, {
			deskID: 2,
		y: 210,
			x: 510
		}, {
			deskID: 3,
		y: 90,
			x: 510
		}, {
			deskID: 4,
		y: 280,
			x: 510
		}, {
			deskID: 5,
		y: 150,
			x: 380
		}, {
			deskID: 6,
		y: 280,
			x: 650
		}, {
			deskID: 7,
		y: 270,
			x: 380
		}, {
			deskID: 8,
		y: 90,
			x: 380
	}];

	$scope.getEmployees = function () {
		$scope.employees = floorPlanService.getEmployees();
	};

	$scope.updateEmployees = function () {
		floorPlanService.updateEmployees();
	};

	$scope.editMode = false;
	$scope.editDesks = function () {
		$scope.editMode = !$scope.editMode;
		$scope.$broadcast("editDeskPosition", $scope.editMode);
	};

	$scope.addMode = false;
	$scope.addDesk = function () {
		// $scope.myDesks.push({
		// 	deskID : Math.floor(Math.random() * 12345),
		// 	y : 500,
		// 	x : 500
		// });
		$scope.editMode = false; //switch off edit mode
		$scope.addMode = !$scope.addMode;
		$scope.$broadcast('addDesk', {
			// desks: $scope.myDesks,
			addMode: $scope.addMode
		});
		floorFactory.addNewDesk();
	};

	$scope.removeDesk = function () {
		// $scope.myDesks
	};

	$scope.editBoxPosition = floorFactory.editBoxPosition;
	
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
