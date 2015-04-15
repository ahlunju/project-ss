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

		var shadow = {
			color: 'rgba(0,0,0,0.6)',
			blur: 20,
			offsetX: 0,
			offsetY: 5,
			opacity: 0.6,
			fillShadow: true,
			strokeShadow: true
		};

		var group = [];
		var gridSize = 10;
		var gridGroup = null;
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
		
		var lastClosestAngle = 0; // rotation increment of 10 deg
		var snapAfterRotate = false;

		canvas = new fabric.Canvas('floor-canvas', {
			backgroundColor: 'rgb(255,255,255)',
			selectionColor: 'rgba(100,200,200, 0.5)',
			selectionLineWidth: 2,
			width: canvasWidth,
			height: canvasHeight,
			renderOnAddRemove: false, //increase performance
			selection: false //disable group selection
		});

		function initializeCanvas() {
			canvas.loadFromJSON(scope.objects);
			drawGrid(gridSize);
		}

		function drawGrid (gridSize) {
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

				group.push(horizontalLine);
				group.push(verticalLine);

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
				width: 100,
				height: 50,
				stroke: '#337ab7',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createRoom(config) {
			return new fabric.Rect({
				fill: null,
				width: 300,
				height: 150,
				stroke: '#D725D3',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5],
				evented: false
			});
		}

		function createSquare(config) {
			return new fabric.Rect({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				width: 100,
				height: 100,
				stroke: '#337ab7',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createCircle(config) {
			return new fabric.Circle({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				radius: 50,
				stroke: '#337ab7',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createTriangle(config) {
			return new fabric.Triangle({
				fill: config.fill || 'rgba(0,0,0,0.2)',
				width: 100,
				height: 100,
				stroke: '#337ab7',
				hasRotatingPoint:false,
				strokeDashArray: [5, 5]
			});
		}

		function createPolygon(config, type) {
			return new fabric.Polygon(type, {
				fill: config.fill || 'rgba(0,0,0,0.2)',
				stroke: '#337ab7',
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

		function showEditBox (position) {
			//scope variable from controller
			// scope.editBoxPosition.top =  position.y +'px';
			// scope.editBoxPosition.left = position.x + 100 + 'px';
			scope.editBoxPosition.display = 'block';
			scope.$apply();


		}

		function hideEditBox () {
			scope.editBoxPosition.display = 'none';
			// scope.$apply();
		}

		function updateEditBoxPosition(position) {
			// scope.editBoxPosition.top =  position.y +'px';
			// scope.editBoxPosition.left = position.x + 100 + 'px';
			// scope.$apply();
		}

		function onObjectScaling (event) {
			
		}

		function onObjectRotating (event) {
			// rotation increment of 10 (round to the nearest 10)
			var targetObj = event.target;
			lastClosestAngle = Math.round(targetObj.angle / 10) * 10;
			snapAfterRotate = true;
		}

		function onObjectMoving (options) {
			// snap to grid
			options.target.set({
				left: Math.round(options.target.left / gridSize) * gridSize,
				top: Math.round(options.target.top / gridSize) * gridSize
			});

			//update edit box position
			getPointerCoords(options.target);
			updateEditBoxPosition(pointer);

			options.target.setShadow(shadow);
		}

		function resizeObject (object) {

		}

		function onObjectModified (options) {
			console.log('object modified');
			// modified fires after object has been rotated
			options.target.resizeToScale();
			if (options.target.angle && snapAfterRotate) {
				options.target.setAngle(lastClosestAngle).setCoords();
				snapAfterRotate = false;
				// canvas.renderAll();
			}
			options.target.snapWidthAndHeight();
			// setSelectedObject(options);
		}

		function onObjectSelected (options) {

			options.target.bringToFront();
			//store selected Object
			selectedObject = options.target;
			setSelectedObject(options);
		}

		function setSelectedObject (options) {
			scope.selectedObject.attr = options.target;
		}

		function onMouseMove (options){
			getPointerCoords(options);
			// getMouse(options);// its not an event its options of your canvas object
			if (tempObject instanceof fabric.Object) {
				tempObject.set({
					left: pointer.x - tempObject.width/2,
					top: pointer.y - tempObject.height/2
				});
				canvas.renderAll();
			}
		}

		function onMouseUp (options) {
			if(options.target) {
				options.target.setShadow({});
				canvas.renderAll();
			}
		}

		function onMouseDown (options) {
			console.log('mouse down');

			if (tempObject instanceof fabric.Object) {
				if (newObjectType.type === 'rectangle') {
					var newObject = new fabric.Rect({
						width: 100,
						height: 50
					});
				} else if (newObjectType.type === 'square') {
					var newObject = new fabric.Rect({
						width: 100,
						height: 100
					});
				} else if (newObjectType.type === 'circle') {
					var newObject = new fabric.Circle({
						radius: 50
					});
				} else if (newObjectType.type === 'triangle') {
					var newObject = new fabric.Triangle({
						width: 100,
						height: 100
					});
				} else if (newObjectType.type === 'L-shape') {
					var newObject = new fabric.Polygon(L, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'T-shape') {
					var newObject = new fabric.Polygon(T, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'Z-shape') {
					var newObject = new fabric.Polygon(Z, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'room') {
					var newObject = new fabric.Rect({
						width: 300,
						height: 150
					});
				}

				newObject.fill = '#bada55';
				newObject.left = tempObject.left;
				newObject.top = tempObject.top;
				newObject.hasRotatingPoint = true;
				newObject.stroke = '#666';

				if (newObjectType.type === 'room') {
					newObject.fill = null;

					newObject.stroke = '#D725D3';
					newObject.strokeWidth = 2;
				}

				canvas.remove(tempObject);
				tempObject = {};
				canvas.add(newObject);
				canvas.renderAll();
			}

			if (options.target) {
				getPointerCoords(options);
				showEditBox(pointer);
				// canvas.renderAll();
			} else {
				console.log('nothing is being clicked');
				hideEditBox();
				scope.$apply();
			}
		}

		function addObject (event, args) {
			hideEditBox();
			newObjectType = args;
			
			if (!newObjectType.type) {
				return false;
			}
			if (newObjectType.type === 'rectangle') {
				tempObject = createRect({
					// config
				});
			} else if (newObjectType.type === 'square') {
				tempObject = createSquare({
					//x:pointer.x, y: pointer.y
				});
			} else if (newObjectType.type === 'circle') {
				tempObject = createCircle({});
			} else if (newObjectType.type === 'triangle') {
				tempObject = createTriangle({});
			} else if (newObjectType.type === 'T-shape') {
				tempObject = createPolygon({}, T);
			} else if (newObjectType.type === 'L-shape') {
				tempObject = createPolygon({}, L);
			} else if (newObjectType.type === 'Z-shape') {
				tempObject = createPolygon({}, Z);
			} else if (newObjectType.type === 'room') {
				tempObject = createRoom({});
			}
			
			canvas.add(tempObject);
		}

		function removeObject () {
			console.log(selectedObject);

			scope.selectedObject.attr = {};
			canvas.remove(selectedObject);
			canvas.renderAll();

			hideEditBox();
		}

		function serializeCanvas () {
			// remove grid lines before serialize
			group.forEach(function (item) {
				canvas.remove(item);
			});

			var canvasObject = canvas.toObject();
			console.dir(canvasObject.objects);

			// var allObjects = JSON.stringify(canvas);
			// console.dir(allObjects);

			// add grid lines back to canvas
			group.forEach(function(item) {
				canvas.add(item);
				item.sendToBack();
			});
		}

		canvas.on('after:render', function (options){
			// console.log('after render');
		});

		/*Object related events*/
		canvas.on('object:rotating', onObjectRotating);

		canvas.on('object:modified', onObjectModified);

		canvas.on('object:moving', onObjectMoving);

		canvas.on('object:scaling', onObjectScaling);

		canvas.on('object:selected', onObjectSelected);

		canvas.on('mouse:move', onMouseMove);

		canvas.on('mouse:down', onMouseDown);

		canvas.on('mouse:up', onMouseUp);

		scope.$on('addObject', addObject);

		scope.$on('removeObject', removeObject);

		scope.$on('toggleLock', function () {
			lock = !lock;
		});

		scope.$on('re-render', function () {
			console.log('re-render canvas');
			canvas.renderAll();
		});

		scope.$on('serializeCanvas', serializeCanvas);

		// customise fabric.Object with a method to resize rather than just scale after tranformation
		fabric.Object.prototype.resizeToScale = function () {
			// resizes an object that has been scaled (e.g. by manipulating the handles), setting scale to 1 and recalculating bounding box where necessary
			switch (this.type) {
				case "circle":
					if (this.scaleX > this.scaleY) {
						this.radius *= this.scaleX;
					} else if (this.scaleY > this.scaleX) {
						this.radius *= this.scaleY;
					} else if (this.scaleX === this.scaleY) {
						this.radius *= this.scaleX;
					}
					this.scaleX = 1;
					this.scaleY = 1;
					this.width = this.radius*2;
					this.height = this.radius*2;
					break;
				case "ellipse":
					this.rx *= this.scaleX;
					this.ry *= this.scaleY;
					this.width = this.rx * 2;
					this.height = this.ry * 2;
					this.scaleX = 1;
					this.scaleY = 1;
					break;
				case "polygon":
				case "polyline":
					var points = this.get('points');
					for (var i = 0; i < points.length; i++) {
						var p = points[i];
						p.x *= this.scaleX
						p.y *= this.scaleY;
					}
					this.scaleX = 1;
					this.scaleY = 1;
					this.width = this.getBoundingBox().width;
					this.height = this.getBoundingBox().height;
					break;
				case "triangle":
				case "line":
				case "rect":
					this.width *= this.scaleX;
					this.height *= this.scaleY;
					this.scaleX = 1;
					this.scaleY = 1;
				default:
					break;
			}
		}

		// helper function to return the boundaries of a polygon/polyline
		// something similar may be built in but it seemed easier to write my own than dig through the fabric.js code.  This may make me a bad person.
		fabric.Object.prototype.getBoundingBox = function () {
			var minX = null;
			var minY = null;
			var maxX = null;
			var maxY = null;
			switch (this.type) {
				case "polygon":
				case "polyline":
					var points = this.get('points');

					for (var i = 0; i < points.length; i++) {
						if (typeof (minX) == undefined) {
							minX = points[i].x;
						} else if (points[i].x < minX) {
							minX = points[i].x;
						}
						if (typeof (minY) == undefined) {
							minY = points[i].y;
						} else if (points[i].y < minY) {
							minY = points[i].y;
						}
						if (typeof (maxX) == undefined) {
							maxX = points[i].x;
						} else if (points[i].x > maxX) {
							maxX = points[i].x;
						}
						if (typeof (maxY) == undefined) {
							maxY = points[i].y;
						} else if (points[i].y > maxY) {
							maxY = points[i].y;
						}
					}
					break;
				default:
					minX = this.left;
					minY = this.top;
					maxX = this.left + this.width;
					maxY = this.top + this.height;
			}
			return {
				topLeft: new fabric.Point(minX, minY),
				bottomRight: new fabric.Point(maxX, maxY),
				width: maxX - minX,
				height: maxY - minY
			}
		};

		fabric.Object.prototype.snapWidthAndHeight = function () {
			var roundedWidth = Math.round(this.width /gridSize) * gridSize;
			var roundedHeight = Math.round(this.height / gridSize) * gridSize;
			this.set({
				width: roundedWidth,
				height: roundedHeight
			});
		};

		initializeCanvas();
	}
};
});
