// LabelRect, extension of fabric.Rect, with an additional property: label
(function (fabric, global) {
	fabric.LabeledRect = fabric.util.createClass(fabric.Rect, {

		type: 'labeled-rect',

		initialize: function(options) {
			options || (options = { });
			var person = {
				id: null,
				name: null,
				department: null
			};
			this.callSuper('initialize', options);
			// this.set('label', options.label || '');
			this.set('label', options.label || person);
			console.log(this.get('label'));
		},

		toObject: function() {
			// toObject responsible for object (and JSON) representation of an instance
			return fabric.util.object.extend(this.callSuper('toObject'), {
				label: this.get('label')
			});
		},

		_render: function(ctx) {
			this.callSuper('_render', ctx);

			ctx.font = '16px Helvetica';
			ctx.fillStyle = '#333';
			if (this.label.name) {
				ctx.fillText(this.label.name, -this.width/2, -this.height/2 + 20);
			}
		}
	});

	fabric.LabeledRect.async = true;
	fabric.LabeledRect.fromObject = function(object, callback) {
		fabric.util.enlivenObjects(object, function() {
			callback && callback(new fabric.LabeledRect(object));
		});
	};

	var extendedSquare = fabric.util.createClass(fabric.Rect, {

		type: 'extendedSquare',

		initialize: function(options) {
			options || (options = { });

			this.callSuper('initialize', options);
			this.set('label', options.label || '');
		},

		toObject: function() {
			return fabric.util.object.extend(this.callSuper('toObject'), {
				label: this.get('label')
			});
		},

		_render: function(ctx) {
			this.callSuper('_render', ctx);

			ctx.font = '20px Helvetica';
			ctx.fillStyle = '#333';
			ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
		}
	});

	// Monkey patch fabric.Object.prototype.toObject with custom label attribute
	fabric.Object.prototype.toObject = (function (toObject) {
		return function () {
			return fabric.util.object.extend(toObject.call(this), {
				label: this.get('label')
			});
		};
	})(fabric.Object.prototype.toObject);
	
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
					p.x *= this.scaleX;
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
	// something similar may be built in but it seemed easier to write my own than dig through the fabric.js code.	This may make me a bad person.
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

	fabric.Object.prototype.snapSize = function (gridSize) {
		var gridSize = gridSize || 10;
		var roundedWidth = Math.round(this.width /gridSize) * gridSize;
		var roundedHeight = Math.round(this.height / gridSize) * gridSize;
		this.set({
			width: roundedWidth,
			height: roundedHeight
		});
	};

	// expose to global
	var global = global;
	// global.LabeledRect = LabeledRect;
	global.extendedSquare = extendedSquare;
})(fabric, this);

// temporary
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

		// canvas.add(horizontalLine);
		// horizontalLine.sendToBack();
		// // draw vertical lines
		// canvas.add(verticalLine);
		// verticalLine.sendToBack();
	}
}

function excludeGrid () {
	group.forEach(function(item) {
		canvas.remove(item);
	});
}

function includeGrid () {
	group.forEach(function(item) {
		canvas.add(item);
		item.sendToBack();
	});
}