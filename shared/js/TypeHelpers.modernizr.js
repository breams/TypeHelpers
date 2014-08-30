/*! TypeHelpers Modernizr Plugin v1.0 | (c) Zoltan Hawryluk, Jasper Palfree 2009-2014 | MIT License | opensource.org/licenses/mit-license.php */

Modernizr.addTest("fontsmoothing", function() {
	var _screen = screen,
		_document = document,
		_documentElement = _document.documentElement,
		_documentElementStyle = _documentElement.style,
		fake,
		ctx;

	if ("fontSmoothingEnabled" in _screen) {
		return _screen.fontSmoothingEnabled;
	}

	try {
		// Create a 20x20 Canvas block.
		var canvasNode = _document.createElement("canvas"),
			root = _document.body || (function () {
				fake = true;
				return _documentElement.appendChild(_document.createElement("body"));
			}());

		canvasNode.width = canvasNode.height = "20";

		// We must put this node into the body, otherwise Safari Windows does not report correctly.
		canvasNode.style.display = "none";
		root.appendChild(canvasNode);

		if ( fake ){
			//Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
			root.style.overflow = "hidden";
			_documentElementStyle.overflow = "hidden";
			_documentElement.appendChild(root);
		}

		ctx = canvasNode.getContext("2d");

		// draw a black letter "a", 32px Arial.
		ctx.textBaseline = "top";
		ctx.font = "32px Arial";
		ctx.strokeStyle = ctx.fillStyle = "black";

		ctx.fillText("a", 0, -10);

		// Search algorithm thanks to jefkin (jsperf.com/canvas-loops/5)
		// 2 pixel strip by "x"
		for (var x = 8, j, y, idx, alpha, imageData; x <= 32; x += 2) {
			imageData = ctx.getImageData(x, 0, 2, canvasNode.height);

			for (j = x; j <= x + 1; j++) {
				for (y = 1; y <= 32; y++) {
					idx = (x + y * imageData.width) * 4;
					alpha = imageData.data[idx + 3];

					if (alpha != 255 && alpha != 0) {
						_cleanup();
						return true; // font-smoothing must be on.
					}
				}
			}
		}

		_cleanup();

	} catch (ex) {
		// Something went wrong (for example, Opera cannot use the canvas fillText() method).
		_cleanup();
	}

	function _cleanup() {
		if (fake) {
			_documentElement.removeChild(root);
			_documentElementStyle.overflow = "";
		} else {
			root.removeChild(canvasNode);
		}
	}

	return false;
});