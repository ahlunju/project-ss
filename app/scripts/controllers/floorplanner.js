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

	$scope.objects = {"objects":
	[
	// 	{"type":"rect","originX":"left","originY":"top","left":50,"top":50,"width":100,"height":50,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0
	// },{"type":"circle","originX":"left","originY":"top","left":190,"top":320,"width":100,"height":100,"fill":"red","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","radius":50,"startAngle":0,"endAngle":6.283185307179586},
	// {"type":"rect","originX":"left","originY":"top","left":200,"top":50,"width":100,"height":50,"fill":"#bada55","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":90,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
	{"type":"rect","originX":"left","originY":"top","left":430,"top":240,"width":100,"height":50,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
	{"type":"polygon","originX":"left","originY":"top","left":530,"top":140,"width":100,"height":150,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
	{"type":"polygon","originX":"left","originY":"top","left":580,"top":190,"width":150,"height":100,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-75,"y":-50},{"x":25,"y":-50},{"x":25,"y":0},{"x":75,"y":0},{"x":75,"y":50},{"x":-25,"y":50},{"x":-25,"y":0},{"x":-75,"y":0}]},
	{"type":"polygon","originX":"left","originY":"top","left":380,"top":290,"width":100,"height":150,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-50,"y":-75},{"x":0,"y":-75},{"x":0,"y":25},{"x":50,"y":25},{"x":50,"y":75},{"x":-50,"y":75}]},
	{"type":"rect","originX":"left","originY":"top","left":730,"top":240,"width":100,"height":50,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
	{"type":"polygon","originX":"left","originY":"top","left":830,"top":190,"width":150,"height":100,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","points":[{"x":-25,"y":-50},{"x":25,"y":-50},{"x":25,"y":0},{"x":75,"y":0},{"x":75,"y":50},{"x":-75,"y":50},{"x":-75,"y":0},{"x":-25,"y":0}]},
	{"type":"rect","originX":"left","originY":"top","left":380,"top":440,"width":100,"height":100,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
	{"type":"rect","originX":"left","originY":"top","left":380,"top":540,"width":100,"height":100,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0},
	{"type":"triangle","originX":"left","originY":"top","left":430,"top":140,"width":100,"height":100,"fill":"#bada55","stroke":"#666","strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over"}
	],
		"background":"rgb(255,255,255)"
	};

	$scope.addObject = function (objectType) {
		$scope.$broadcast('addObject', {type: objectType});
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
			console.log('selected object assign employee');
		}
	};
});
