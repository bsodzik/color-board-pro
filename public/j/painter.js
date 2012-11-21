"use strict";

var painterFactory = (function () {
	var fxFactory, fyFactory;

	fxFactory = function (obj, nextObj) {
		var a = (nextObj.y - obj.y) / (nextObj.x - obj.x),
			b = obj.y - a * obj.x;
		return function (x) {
			return a * x + b;
		};
	};

	fyFactory = function (obj, nextObj) {
		var a = (nextObj.x - obj.x) / (nextObj.y - obj.y),
			b = obj.x - a * obj.y;
		return function (y) {
			return a * y + b;
		};
	};

	return function (listeners) {
		var canvas, context, isPainting, circle;

		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');

		canvas.addEventListener('mousemove', function (e) {
			if (isPainting) {
				listeners.onPaint(
					e.clientX - e.currentTarget.offsetLeft,
					e.clientY - e.currentTarget.offsetTop
				);
			}
		});
		canvas.addEventListener('mousedown', function (e) {
			isPainting = true;
		});
		canvas.addEventListener('mouseup', function (e) {
			listeners.onStop();
			isPainting = false;
		});

		circle = function (x, y) {
			context.arc(x, y, 3, 0, 2 * Math.PI, false);
		};

		return {
			paint: function (response) {
				var data = response.data;

				context.beginPath();
				context.fillStyle = response.color;

				data.forEach(function (obj, idx) {
					var nextObj, xDelta, yDelta, x, y, fx, fy;

					if (idx + 1 < data.length) {
						nextObj = data[idx + 1];

						if (obj.x === nextObj.x) {
							if (obj.y > nextObj.y) {
								for (y = nextObj.y; y <= obj.y; ++y) {
									circle(obj.x, y);
								}
							} else if (obj.y < nextObj.y) {
								for (y = obj.y; y <= nextObj.y; ++y) {
									circle(obj.x, y);
								}
							} else {
								circle(obj.x, obj.y);
							}
						} else {
							xDelta = Math.abs(obj.x - nextObj.x);
							yDelta = Math.abs(obj.y - nextObj.y);
							
							if (xDelta >= yDelta) {
								fx = fxFactory(obj, nextObj);
								if (obj.x > nextObj.x) {
									for (x = nextObj.x; x <= obj.x; ++x) {
										circle(x, fx(x));
									}
								} else {
									for (x = obj.x; x <= nextObj.x; ++x) {
										circle(x, fx(x));
									}
								}
							} else {
								fy = fyFactory(obj, nextObj);
								if (obj.y > nextObj.y) {
									for (y = nextObj.y; y <= obj.y; ++y) {
										circle(fy(y), y);
									}
								} else {
									for (y = obj.y; y <= nextObj.y; ++y) {
										circle(fy(y), y);
									}
								}
							}
						}
					} else {
						circle(obj.x, obj.y);
					}
				});
				context.fill();
			}
		};
	};

})();
