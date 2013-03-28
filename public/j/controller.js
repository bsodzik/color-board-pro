"use strict";

var controller = function (canvas, listeners) {
	var isPainting, onStart, onStop, onMousePaint, onTouchPaint,
		isTouchSupported = (typeof Touch === 'object');

	onStart = function () {
		isPainting = true;
	};
	onStop = function () {
		listeners.onStop();
		isPainting = false;
	};
	onMousePaint = function (e) {
		listeners.onPaint(
			e.clientX - e.currentTarget.offsetLeft,
			e.clientY - e.currentTarget.offsetTop
		);
	};
	onTouchPaint = function (e) {
		listeners.onPaint(
			e.touches[0].clientX,
			e.touches[0].clientY
		);
	};

	if (isTouchSupported) {
		canvas.addEventListener('touchmove', function (e) {
			e.preventDefault();
			if (isPainting) {
				onTouchPaint(e);
			}
		});
		canvas.addEventListener('touchstart', onStart);
		canvas.addEventListener('touchend', onStop);
	} else {
		canvas.addEventListener('mousemove', function (e) {
			if (isPainting) {
				onMousePaint(e);
			}
		});
		canvas.addEventListener('mousedown', onStart);
		canvas.addEventListener('mouseup', onStop);
		canvas.addEventListener('mouseout', function (e) {
			onMousePaint(e);
			onStop();
		});
	}
};
