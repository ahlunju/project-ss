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
		
		var complexDesk = {};
		var complexDeskOptions = {};
		fabric.loadSVGFromURL('../images/l-desk2.svg', function(objects, options) {
			complexDesk = objects;
			complexDeskOptions = options;
		});

		var gridSize = 10;
		var pointer = {
			x: 0,
			y: 0
		};

		var newObject = {};
		var tempObject = {};
		var lock = true;
		var canvas = {};
		var canvasWidth = 1500;
		var canvasHeight = 1500;
		var selectedObject = {};
		var newObjectType = {};
		
		var lastClosestAngle = 0; // rotation increment of 10 deg
		var snapAfterRotate = false;
		var baseLayer;
		var canvasScale = 1;
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
			canvas.loadFromJSON(scope.desks);
			drawBaseLayer('../images/drawing.svg');
		}

		function drawBaseLayer (imgUrl) {
			fabric.Image.fromURL(imgUrl, function (img) {
				baseLayer = img;
				var imgWidth = img.width;
				var imgHeight = img.height;
				img.left = 0;
				img.top = 0;
				img.selectable = false;
				img.setWidth(canvasWidth).setHeight(canvasWidth * (imgHeight / imgWidth));
				// resize canvas dimension
				canvas.setHeight(canvasWidth * (imgHeight/imgWidth));
				console.log(canvas.width, canvas.height);
				canvas.add(img);
				img.sendToBack();
				return img;
			});
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

			options.target.setShadow(Ss.shadow);
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
					newObject = new fabric.Rect({
						width: 100,
						height: 50
					});
				} else if (newObjectType.type === 'square') {
					newObject = new fabric.ExtendedSquare({
						width: 100,
						height: 100
					});
				} else if (newObjectType.type === 'circle') {
					newObject = new fabric.Circle({
						radius: 50
					});
				} else if (newObjectType.type === 'triangle') {
					newObject = new fabric.Triangle({
						width: 100,
						height: 100
					});
				} else if (newObjectType.type === 'L-shape') {
					newObject = new fabric.Polygon(Ss.L, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'T-shape') {
					newObject = new fabric.Polygon(Ss.T, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'Z-shape') {
					newObject = new fabric.Polygon(Ss.Z, {
						lockUniScaling: true
					});
				} else if (newObjectType.type === 'room') {
					newObject = new fabric.Rect({
						width: 300,
						height: 150
					});
				} else if (newObjectType.type === 'label-rect') {
					newObject = new fabric.LabeledRect({
						width: 100,
						height: 50
					});
				} else if (newObjectType.type === 'l-desk') {
					console.log('l-desk');
					newObject = new fabric.PathGroup(complexDesk, complexDeskOptions);
				}

				newObject.fill = '#818181';
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
				console.log('clicked on something');
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
				tempObject = Ss.createRect({
					// config
				});
			} else if (newObjectType.type === 'square') {
				tempObject = Ss.createSquare({
					//x:pointer.x, y: pointer.y
				});
			} else if (newObjectType.type === 'circle') {
				tempObject = Ss.createCircle({});
			} else if (newObjectType.type === 'triangle') {
				tempObject = Ss.createTriangle({});
			} else if (newObjectType.type === 'T-shape') {
				tempObject = Ss.createPolygon({}, Ss.T);
			} else if (newObjectType.type === 'L-shape') {
				tempObject = Ss.createPolygon({}, Ss.L);
			} else if (newObjectType.type === 'Z-shape') {
				tempObject = Ss.createPolygon({}, Ss.Z);
			} else if (newObjectType.type === 'label-rect') {
				tempObject = new fabric.LabeledRect({
						width: 100,
						height: 50,
						// label: defaulting it
						strokeDashArray: [5, 5],
						stroke: '#337ab7',
						fill: 'rgba(0,0,0,0.2)'
					});
			} else if (newObjectType.type === 'l-desk') {
				console.log(complexDeskOptions);
				console.dir(complexDesk);
				tempObject = new fabric.PathGroup(complexDesk, complexDeskOptions);
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
			canvas.remove(baseLayer);
			scope.desks = canvas.toObject();
			canvas.add(baseLayer);
			console.dir(scope.desks.objects);
			console.log(scope.desks.objects.length);

			// var allObjects = JSON.stringify(canvas);
			// console.dir(allObjects);
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

		scope.$on('initializeCanvas', initializeCanvas);

		scope.$on('toggleFullScreen', toggleFullScreen);

		scope.$on('searchEmployee', searchEmployee);

		function searchEmployee (event, args) {
			var employeeId = args.employee.id;
			var objs = canvas.getObjects();
			for (var i = 0; i < objs.length; i++) {
				if (objs[i].label && objs[i].label.id === employeeId) {
					console.log(objs[i]);
					highlightDesk(objs[i]);
				} else {
					objs[i].fill = '#818181';
					canvas.renderAll();
				}
			}
		}

		function highlightDesk (desk) {
			desk.fill = '#bada55';
			canvas.renderAll();
		}

		function scaleObjects (scale) {
			var objs = canvas.getObjects().map(function(o) {
				o.scaleX *= scale;
				o.scaleY *= scale;
			});

		}

		function toggleFullScreen (event, args) {
			var aspectRatio = baseLayer.height/ baseLayer.width;
			var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			
			if (args.maximize) {
				console.log('maximize');
				baseLayer.setWidth(w).setHeight(w * aspectRatio);
				canvas.setWidth(w).setHeight(w * aspectRatio);
				canvasScale = w / canvasWidth;

			} else {
				console.log('original size');
				baseLayer.setWidth(canvasWidth).setHeight(canvasWidth * aspectRatio);
				canvas.setWidth(canvasWidth).setHeight(canvasWidth * aspectRatio);
				canvasScale = canvasWidth / w;
			}
			console.log(canvasScale);
			scaleObjects(canvasScale);
			canvas.renderAll();
		}
	}
};
});
