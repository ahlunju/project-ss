'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplannerCtrl
 * @description
 * # FloorplannerCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp').controller('FloorplannerCtrl', function (floorPlanService, $scope) {
	$scope.selectedEmployee = {};
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

	$scope.objects = {
		"objects":[
		{
			"type":"rect","left":50,"top":50,"width":100,"height":50,
			"fill":"green","strokeWidth":1,"angle":0,"selectable":true,
			"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0
		},{
			"type":"circle",
			"left":500,"top":500,"width":100,"height":100,
			"fill":"red","strokeWidth":1,"angle":0,"selectable":true,
			"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,"perPixelTargetFind":false,"radius":50
		},{
			"type":"rect","left":200,"top":50,"width":100,"height":50,
			"fill":"orange","strokeWidth":1,"angle":90,"selectable":true,
			"hasControls":true,"hasBorders":true,"hasRotatingPoint":true,"transparentCorners":true,"perPixelTargetFind":false,"rx":0,"ry":0
		}]
	};

	$scope.addObject = function () {
		$scope.$broadcast('addObject');
	};

	$scope.updateEmployees = function () {
		console.log('update employees');
	};

	$scope.editDesks = function () {
		console.log('edit desks');
		$scope.$broadcast('toggleLock');
	};

	$scope.editBoxPosition = {
		top	: '0px',
		left : '0px',
		display : 'none'
	};

	$scope.removeObject = function () {
		$scope.$broadcast('removeObject');
		console.log('remove object');
	};

});
