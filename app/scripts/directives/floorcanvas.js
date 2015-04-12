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

		// polygon shapes (Tetris)
		// L-shape
		var L = [
			{x: 0, y: 0},
			{x: 50, y: 0},
			{x: 50, y: 100},
			{x: 100, y: 100},
			{x: 100, y: 150},
			{x: 0, y: 150}
		];

		var T = [
			{x: 50, y: 0},
			{x: 100, y: 0},
			{x: 100, y: 50},
			{x: 150, y: 50},
			{x: 150, y: 100},
			{x: 0, y: 100},
			{x: 0, y: 50},
			{x: 50, y: 50}
		];

		var Z = [
			{x: 0, y: 0},
			{x: 100, y: 0},
			{x: 100, y: 50},
			{x: 150, y: 50},
			{x: 150, y: 100},
			{x: 50, y: 100},
			{x: 50, y: 50},
			{x: 0, y: 50}
		];


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
		var newObjectType = {};

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
		
		function createRect(config) {
			return new fabric.Rect({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				left: config.x - 50,
				top: config.y - 25,
				width: 100,
				height: 50,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createSquare(config) {
			return new fabric.Rect({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				left: config.x - 50,
				top: config.y - 50,
				width: 100,
				height: 100,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createCircle(config) {
			return new fabric.Circle({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				left: config.x,
				top: config.y,
				// width: 100,
				// height: 100,
				radius: 50,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createTriangle(config) {
			return new fabric.Triangle({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				left: config.x,
				top: config.y,
				width: 100,
				height: 100,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createPolygon(config, type) {
			return new fabric.Polygon(type, {
				fill: config.fill || 'rgba(0,0,0,0.2)',
				left: config.x,
				top: config.y,
				stroke: 'blue',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
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
				if (newObjectType.type === 'rectangle') {
					tempObject.set({
						left: pointer.x - 50,
						top: pointer.y - 25
					});
				} else {
					tempObject.set({
						left: pointer.x - 50,
						top: pointer.y - 50
					});
				}
				canvas.renderAll();
			}
		});

		canvas.on('mouse:down', function (options) {
			// console.log(options);
			if (tempObject instanceof fabric.Object) {
				console.log(tempObject);
				if (newObjectType.type === 'rectangle') {
					var newObject = new fabric.Rect({
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						width: 100,
						height: 50,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'square') {
					var newObject = new fabric.Rect({
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						width: 100,
						height: 100,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'circle') {
					var newObject = new fabric.Circle({
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						// width: 125,
						// height: 125,
						radius: 50,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'triangle') {
					var newObject = new fabric.Triangle({
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						width: 100,
						height: 100,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'L-shape') {
					var newObject = new fabric.Polygon(L, {
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'T-shape') {
					var newObject = new fabric.Polygon(T, {
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						hasRotatingPoint: true,
					});
				} else if (newObjectType.type === 'Z-shape') {
					var newObject = new fabric.Polygon(Z, {
						fill: 'orange',
						left: tempObject.left,
						top: tempObject.top,
						hasRotatingPoint: true,
					});
				}
				
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

		scope.$on('addObject', function (event, args) {
			newObjectType = args;
			hideEditBox();
			if (!newObjectType.type) {
				return false;
			}
			if (newObjectType.type === 'rectangle') {
				tempObject = createRect({x:pointer.x, y: pointer.y});
			} else if (newObjectType.type === 'square') {
				tempObject = createSquare({x:pointer.x, y: pointer.y});
			} else if (newObjectType.type === 'circle') {
				tempObject = createCircle({x: pointer.x, y: pointer.y});
			} else if (newObjectType.type === 'triangle') {
				tempObject = createTriangle({x:pointer.x, y:pointer.y});
			} else if (newObjectType.type === 'T-shape') {
				tempObject = createPolygon({x:pointer.x, y:pointer.y}, T);
			} else if (newObjectType.type === 'L-shape') {
				tempObject = createPolygon({x:pointer.x, y:pointer.y}, L);
			} else if (newObjectType.type === 'Z-shape') {
				tempObject = createPolygon({x:pointer.x, y:pointer.y}, Z);
			}
			
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
