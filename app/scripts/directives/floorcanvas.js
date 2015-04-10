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
	link: function postLink (scope, element, attrs) {
		/**controller variable:
			editBoxPosition
		**/
		var gridSize = 10;
		var mouseX = 0;
		var mouseY = 0;
		var pointer = {
			x: 0,
			y: 0
		};
		var tempObject = {};
		var lock = true;
		var canvas = {};
		var canvasWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 1000);
		var canvasHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 1000);
		var selectedObject = {};

		canvas = new fabric.Canvas('floor-canvas', {
			backgroundColor: 'rgb(255,255,255)',
			selectionColor: 'rgba(100,200,200, 0.5)',
			selectionLineWidth: 2,
			width: canvasWidth,
			height: canvasHeight,
			renderOnAddRemove: false //increase performance
		});

		function initializeCanvas() {
			canvas.loadFromJSON(scope.objects);
			draw_grid(gridSize);
		}

		function draw_grid (gridSize) {
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
		
		function getMouse (options) {
			//console.log(options);// you can check all options here
			mouseX = options.e.clientX;
			mouseY = options.e.clientY;
			console.log(options.e.clientX, options.e.clientY);
		}

		function getPointerCoords(options) {
			pointer = canvas.getPointer(options.e);
		}

		canvas.on("after:render", function (){
			
		});

		// rotation increment of 10 deg
		var lastClosestAngle = 0,
		    snapAfterRotate = false;

		/*Object related events*/

		// rotation increment of 10 (round to the nearest 10)
		canvas.on("object:rotating", function (rotEvtData) {
			var targetObj = rotEvtData.target;
			lastClosestAngle = Math.round(targetObj.angle / 10) * 10;
			snapAfterRotate = true;
		});

		canvas.on("object:modified", function (modEvtData) {
			// modified fires after object has been rotated
			var modifiedObj = modEvtData.target;
			if (modifiedObj.angle && snapAfterRotate) {
				modifiedObj.setAngle(lastClosestAngle).setCoords();
				snapAfterRotate = false;
				canvas.renderAll();
			}
		});

		canvas.on('object:moving', function (movEvtData) {
			// snap to grid
			movEvtData.target.set({
				left: Math.round(movEvtData.target.left / gridSize) * gridSize,
				top: Math.round(movEvtData.target.top / gridSize) * gridSize
			});

			//update edit box position
			getPointerCoords(movEvtData.target);
			updateEditBoxPosition(pointer);
		});

		canvas.on('object:selected', function (selectData) {
			console.log('selected');
			console.log(selectData);
			selectedObject = selectData.target;
		});

		canvas.on('mouse:move', function (options){
			getPointerCoords(options);
			// getMouse(options);// its not an event its options of your canvas object
			if (tempObject instanceof fabric.Object) {
				console.log('update tempObject pos');
				tempObject.set({
					left: pointer.x - 64.5,
					top: pointer.y - 64.5
				});
				canvas.renderAll();
			}
		});

		canvas.on('mouse:down', function (options) {
			// console.log(options);
			if (tempObject instanceof fabric.Object) {
				console.log(tempObject);
				
				var newObject = new fabric.Rect({
					fill: 'orange',
					left: tempObject.left,
					top: tempObject.top,
					width: 125,
					height: 125,
					hasRotatingPoint: true,
				});
				
				canvas.remove(tempObject);
				tempObject = {};
				canvas.add(newObject);
				canvas.renderAll();
			}

			if (options.target) {
				getPointerCoords(options);
				showEditBox(pointer);
			}
		});

		scope.$on('addObject', function () {

			tempObject = new fabric.Rect({
				fill: 'rgba(0,0,0,0.2)',
				left: pointer.x - 64.5,
				top: pointer.y - 64.5,
				width: 125,
				height: 125,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
			canvas.add(tempObject);
		});

		scope.$on('removeObject', function () {
			canvas.remove(selectedObject);
			canvas.renderAll();

			hideEditBox();
		});

		scope.$on('toggleLock', function () {
			lock = !lock;
		});

		function showEditBox (position) {
			//scope variable from controller
			scope.editBoxPosition.top =  position.y +'px';
			scope.editBoxPosition.left = position.x + 100 + 'px';
			scope.editBoxPosition.display = 'block';
			scope.$apply();
		}

		function hideEditBox () {
			scope.editBoxPosition.display = 'none';
		}

		function updateEditBoxPosition(position) {
			scope.editBoxPosition.top =  position.y +'px';
			scope.editBoxPosition.left = position.x + 100 + 'px';
			scope.$apply();
		}

		initializeCanvas();
	}
};
});
