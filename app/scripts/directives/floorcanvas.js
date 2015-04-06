'use strict';

/**
 * @ngdoc directive
 * @name projectSsApp.directive:floorCanvas
 * @description
 * # floorCanvas
 */
angular.module('projectSsApp').directive('floorCanvas', function () {
return {
	template: '<canvas id="floor-canvas"></canvas>',
	restrict: 'E',
	link: function postLink(scope, element, attrs) {
		var canvas = new fabric.Canvas('floor-canvas', {
			backgroundColor: 'rgb(100,100,200)',
			selectionColor: 'blue',
			selectionLineWidth: 2
			// ...
		});
		scope.$apply();
	}
};
});
