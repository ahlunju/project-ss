'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplannerCtrl
 * @description
 * # FloorplannerCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp').controller('FloorplannerCtrl', function (floorPlanService, $scope, $http) {
	$scope.selectedEmployee = {};
	// $scope.getEmployees(); // use local data for now
	$scope.employees = [
		{
			"name": "Yalun Zhu",
			"id": 0,
			"department": 'Developer'
		},
		{
			"name": "Jon Snow",
			"id": 1,
			"department": 'HR'
		},
		{
			"name": "Hello World",
			"id": 2,
			"department": 'QA'
		},
		{
			"name": "Tony Stark",
			"id": 3,
			"department": 'PM'
		},
		{
			"name": "Ned Stark",
			"id": 4,
			"department": 'Customer Service'
		}
	];

	$scope.objects = {
		"objects": [],
		"background":"rgb(255,255,255)"
	};

	$http.get('/data/desks.json').success(function (data) {
		console.dir(data);
		$scope.objects.objects = data;
		$scope.$broadcast('initializeCanvas');
	}).error(function (error) {
		console.log(error);
		return [];
	});

	$scope.addObject = function (objectType) {
		$scope.$broadcast('addObject', {type: objectType});
	};

	$scope.updateEmployees = function () {
		console.log('update employees');
	};

	$scope.toggleLock = function () {
		console.log('edit desks');
		$scope.$broadcast('toggleLock');
	};

	$scope.editBoxPosition = {
		// top	: '0px',
		// left : '0px',
		display : 'none'
	};

	$scope.showGrid = false;

	$scope.toggleGrid = function () {
		$scope.$broadcast('toggleGrid', {toggle: $scope.showGrid});
	};

	$scope.removeObject = function () {
		$scope.$broadcast('removeObject');
		console.log('remove object');
	};

	$scope.serializeCanvas = function () {
		$scope.$broadcast('serializeCanvas');
	};

	$scope.reRenderCanvas = function () {
		$scope.$broadcast('re-render');
	};
	// edit box attributes
	// width, height, color, name, person name, person id
	$scope.selectedObject = {
		attr: {},
		updateAttr: function () {
			console.log('selected object update attr');
			
			$scope.reRenderCanvas();
		},
		assignEmployee: function () {
			if ($scope.selectedEmployee.selected) {
				this.attr.label = angular.copy($scope.selectedEmployee.selected);
				var index = $scope.employees.indexOf($scope.selectedEmployee.selected.id)
				$scope.employees.splice(index, 1);
				$scope.reRenderCanvas();
			}
		}
	};


});
