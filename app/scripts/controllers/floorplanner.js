'use strict';

/**
 * @ngdoc function
 * @name projectSsApp.controller:FloorplannerCtrl
 * @description
 * # FloorplannerCtrl
 * Controller of the projectSsApp
 */
angular.module('projectSsApp').controller('FloorplannerCtrl', function (floorPlanService, $rootScope, $scope, $http) {

	$scope.desks_id = null;

	$scope.selectedEmployee = {};

	$scope.searchEmployee = {};

	$scope.onEmployeeSearch = function () {
		console.log($scope.searchEmployee);
		$scope.$broadcast('searchEmployee', {employee: $scope.searchEmployee.selected});
	};

	// $scope.getEmployees(); // use local data for now
	// $http.get('/data/employees.json').success(function (data) {
	$http.get('/api/employees').success(function (data) {
		$scope.employees = data;
	}).error(function (err) {
		console.log(err);
	});

	$scope.floorPlan = undefined;
	
	$scope.desks = {
		'objects': [],
		'background':'rgb(255,255,255)'
	};

	$http.get('/api/desks').success(function (data) {
	// $http.get('/data/desks.json').success(function (data) {
		if (data[0]) {
			$scope.desks_id = data[0]._id;
			console.log($scope.desks_id);
			console.dir(data);
			$scope.desks.objects = data[0].obj;
		}
		
		$scope.$broadcast('initializeCanvas');
	}).error(function (error) {
		console.log(error);
		return [];
	});

	$scope.updateDesks = function (desks) {
		console.log($scope.desks_id);
		if ($scope.desks_id) {
			$http.post('/api/desks/'+$scope.desks_id, {obj: desks.objects}).
				then(function (res) {
					console.log(res)
				}, function (err) {
					console.log(err);
				});
		} else {
			$http.post('/api/desks', {obj: desks.objects}).
				then(function (res) {
					console.log(res)
				}, function (err) {
					console.log(err);
				});
		}
		
	};
	

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

	$scope.fullScreen = false;
	$scope.toggleFullScreen = function () {
		$scope.fullScreen = !$scope.fullScreen;
		$scope.$broadcast('toggleFullScreen', {maximize: $scope.fullScreen});
	};

	$scope.rotateCanvas = function () {
		$scope.$broadcast('rotateCanvas');
	};

	$scope.removeObject = function () {
		$scope.$broadcast('removeObject');
		console.log('remove object');
	};

	$scope.serializeCanvas = function () {
		$scope.$broadcast('serializeCanvas');
	};

	$scope.convertSVG = function () {
		$scope.$broadcast('convertSVG');
	};

	$scope.reRenderCanvas = function () {
		$scope.$broadcast('re-render');
	};

	$scope.zoomIn = function () {
		$scope.$broadcast('zoom-in');
	};

	$scope.zoomOut = function () {
		$scope.$broadcast('zoom-out');
	};

	$scope.resetZoomPan = function () {
		$scope.$broadcast('reset-zoom-pan');
	};

	$scope.moveLeft = function () {
		$scope.$broadcast('move-left');
	};

	$scope.moveUp = function () {
		$scope.$broadcast('move-up');
	};

	$scope.moveRight = function () {
		$scope.$broadcast('move-right');
	};

	$scope.moveDown = function () {
		$scope.$broadcast('move-down');
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
				// var index = $scope.employees.indexOf($scope.selectedEmployee.selected.id);
				// $scope.employees.splice(index, 1);
				$scope.reRenderCanvas();
			}
		}
	};


});
