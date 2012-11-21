"use strict";

window.addEventListener('load', function() {
	var url, socket, messages = [], init, painter;

	url = location.origin;
	socket = io.connect(url, { reconnect: false });

	socket.on('init', function (color) {
		var listeners = {
			onPaint: function (x, y) {
				messages.push({ x: x, y: y });
			},
			onStop: function () {
				if (messages.length) {
					socket.emit('paint', messages, function () {
						socket.emit('stop');
					});
					messages.length = 0;
				} else {
					socket.emit('stop');
				}
			}
		};

		painter = painterFactory(listeners);

		socket.on('paint', function (data) {
			painter.paint(data);
		});

		(function sendData() {
			if (messages.length) {
				socket.emit('paint', messages);
				messages.length = 0;
			}
			setTimeout(sendData, 20);
		})();
	});
});
