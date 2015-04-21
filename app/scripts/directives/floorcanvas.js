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
		var canvasWidth = 930 * 2; //Math.max(document.documentElement.clientWidth + 200 , window.innerWidth || 1000);
		var canvasHeight = 1260 * 2; //Math.max(document.documentElement.clientHeight, window.innerHeight || 2000);
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
			drawBaseLayer('../images/18-floor.svg');
		}

		function drawBaseLayer (imgUrl) {
			fabric.Image.fromURL(imgUrl, function (img) {
				img.left = 0;
				img.top = 0;
				img.selectable = false;
				img.setWidth(canvasWidth).setHeight(canvasHeight);
				canvas.add(img);
				img.sendToBack();
			});
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
			getPointerCoords(options);
			// updateEditBoxPosition(pointer);

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
			}
			options.target.snapSize(10);
			setSelectedObject(options);
			scope.$apply();
		}

		function onObjectSelected (options) {

			options.target.bringToFront();
			//store selected Object
			selectedObject = options.target;
			setSelectedObject(options);
		}

		function setSelectedObject (options) {
			scope.selectedObject.attr = options.target;
			scope.selectedEmployee.selected = options.target.label;
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
			console.log('mouse up');
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
				} else if (newObjectType.type === 'label-rect') {
					var newObject = new LabeledRect({
						width: 100,
						height: 50
					});
				}

				newObject.fill = '#ababab';
				newObject.left = tempObject.left;
				newObject.top = tempObject.top;
				newObject.hasRotatingPoint = true;
				newObject.stroke = '#fff';

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

			if (options.target && options.target.type !== 'image') {
				getPointerCoords(options);
				showEditBox(pointer);
			} else {
				console.log('nothing is being clicked or non-selectable object');
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
			} else if (newObjectType.type === 'label-rect') {
				tempObject = new LabeledRect({
						width: 100,
						height: 50,
						// label: defaulting it
						strokeDashArray: [5, 5],
						stroke: '#337ab7',
						fill: 'rgba(0,0,0,0.2)'
					});
			}
			
			canvas.add(tempObject);
		}

		function removeObject () {
			canvas.remove(canvas.getActiveObject());
			canvas.renderAll();
			scope.selectedObject.attr = {};
			hideEditBox();
		}

		function toggleObjectSelection () {
			lock = !lock;
			var objs = canvas.getObjects().map(function(o) {
				if (o.type !== 'image') {
					return o.set('selectable', lock);
				}
			});

		}

		function serializeCanvas () {
			var canvasObject = canvas.toObject();
			console.dir(canvasObject.objects);

			var allObjects = JSON.stringify(canvas);
			console.dir(allObjects);
		}

		function onObjectAdded () {

		}

		function onObjectRemoved () {

		}

		function beforeSelectionCleared () {

		}

		function onSelectionCleared () {

		}

		function onSelectionCreated () {

		}

		canvas.on('after:render', function (options){
			// console.log('after render');
		});

		/*Object related events*/
		canvas.on('object:added', onObjectAdded);

		canvas.on('object.removed', onObjectRemoved);

		canvas.on('object:rotating', onObjectRotating);

		canvas.on('object:modified', onObjectModified);

		canvas.on('object:moving', onObjectMoving);

		canvas.on('object:scaling', onObjectScaling);

		canvas.on('object:selected', onObjectSelected);

		//mouse event
		canvas.on('mouse:move', onMouseMove);

		canvas.on('mouse:down', onMouseDown);

		canvas.on('mouse:up', onMouseUp);

		// selection event
		canvas.on('before:selection:cleared', beforeSelectionCleared);

		canvas.on('selection:cleared', onSelectionCleared);

		canvas.on('selection:created', onSelectionCreated);

		scope.$on('addObject', addObject);

		scope.$on('removeObject', removeObject);

		scope.$on('toggleLock', function () {
			toggleObjectSelection();
		});

		scope.$on('toggleGrid', function (event, args) {
			if (args.toggle) {
				//set the grid.png as background
				canvas.setBackgroundColor({source: '../images/grid.png', repeat: 'repeat'}, function () {
				  canvas.renderAll();
				});
			} else {
				canvas.backgroundColor = 'rgb(255,255,255)';
				canvas.renderAll();
			}
		});

		scope.$on('re-render', function () {
			console.log('re-render canvas');
			canvas.renderAll();
		});

		scope.$on('serializeCanvas', serializeCanvas);

		initializeCanvas();
	}
};
});
