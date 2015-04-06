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

		var gridSize = 10;
		function draw_grid(gridSize) {
			var w = canvas.width,
				h = canvas.height;
			/**
			 * i is used for both x and y to draw
			 * a line every 5 pixels starting at
			 * .5 to offset the canvas edges
			 */
			for(var i = 0.5; i < w || i < h; i += gridSize) {
				// draw horizontal lines
				var horizontalLine = new fabric.Line([i, 0, i, h], {
					stroke: '#000',
					strokeWidth: 0.2,
					selectable:false
				});
				var verticalLine = new fabric.Line([0, i, w, i], {
					stroke: '#000',
					strokeWidth: 0.2,
					selectable:false
				});
				canvas.add(horizontalLine);
				horizontalLine.sendToBack();
				// draw vertical lines
				canvas.add(verticalLine);
				verticalLine.sendToBack();
			}
		}
		
		var canvas = new fabric.Canvas('floor-canvas', {
			backgroundColor: 'rgb(255,255,255)',
			selectionColor: 'rgba(100,200,200, 0.5)',
			selectionLineWidth: 2,
			width: 1500,
			height: 800
		});

		// snap to grid
		canvas.on('object:moving', function(options) {
			options.target.set({
				left: Math.round(options.target.left / gridSize) * gridSize,
				top: Math.round(options.target.top / gridSize) * gridSize
			});
		});

		// rotation increment of 10 deg
		var lastClosestAngle = 0,
		    snapAfterRotate = false;

		function calculateClosestAngle(targetObj) {
			// if angle > 360 then mod 360
			var currentAngle = targetObj.angle;
			var normalizedAngle = Math.abs(Math.round(Math.asin(Math.sin(currentAngle * Math.PI/360.0)) * 360.0/Math.PI));
			console.log("normalized: ", normalizedAngle);
			snapAfterRotate = true;
			if (normalizedAngle >= 45 && normalizedAngle < 135) {
			return 90;
			} else if (normalizedAngle >= 135 && normalizedAngle < 225) {
			return 180;
			} else if (normalizedAngle >= 225 && normalizedAngle < 315) {
			return 270;
			} else if ((normalizedAngle >= 315 && normalizedAngle <= 360) || (normalizedAngle >= 0 && normalizedAngle < 45)) {
			return 0;
			}
			return currentAngle;
		}

		// rotation increment of 10 (round to the nearest 10)
		canvas.on("object:rotating", function(rotEvtData) {
		  var targetObj = rotEvtData.target;
		  // lastClosestAngle = calculateClosestAngle(targetObj);
		  lastClosestAngle = Math.round(targetObj.angle / 10) * 10;
		  snapAfterRotate = true;
		  console.log(lastClosestAngle);
		});

		canvas.on("object:modified", function(modEvtData) {
			// modified fires after object has been rotated
			var modifiedObj = modEvtData.target;
			if (modifiedObj.angle && snapAfterRotate) {
				modifiedObj.setAngle(lastClosestAngle).setCoords();
				snapAfterRotate = false;
				canvas.renderAll();
			}
		})

		canvas.loadFromJSON(scope.objects);
		draw_grid(gridSize);
		// var rect = new fabric.Rect({
		//   left: 100,
		//   top: 100,
		//   fill: 'red',
		//   width: 20,
		//   height: 20
		// });

		// var circle = new fabric.Circle({
		//   radius: 20, fill: 'green', left: 100, top: 100
		// });
		// var triangle = new fabric.Triangle({
		//   width: 20, height: 30, fill: 'blue', left: 50, top: 50
		// });

		// canvas.add(circle, triangle);
		// canvas.renderAll();
	}
};
});
