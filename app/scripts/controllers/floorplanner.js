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

	$scope.objects = {"objects":
	[
		{"type":"rect","originX":"left","originY":"top","left":200,"top":390,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":250,"top":390,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":200,"top":640,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":250,"top":490,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":200,"top":790,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":250,"top":590,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":250,"top":690,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":430,"top":390,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":430,"top":390,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":430,"top":490,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":430,"top":540,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":330,"top":690,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":480,"top":690,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":630,"top":380,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"rect","originX":"left","originY":"top","left":730,"top":430,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":730,"top":380,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":730,"top":530,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
		{"type":"polygon","originX":"left","originY":"top","left":730,"top":530,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"polygon","originX":"left","originY":"top","left":730,"top":780,"width":100,"height":150,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":180,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
		{"type":"rect","originX":"left","originY":"top","left":780,"top":680,"width":100,"height":50,"fill":"#ababab","stroke":"#fff","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":{"color":"rgb(0,0,0)","blur":0,"offsetX":0,"offsetY":0},"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}
	],
		"background":"rgb(255,255,255)"
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
