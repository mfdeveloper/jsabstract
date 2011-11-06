//Mop for no tipically operations
function init() {
	String.prototype.mop = function () {
		var capture = this,
			clone = capture.toString();
			args = arguments;
		
		if (capture !== '' && args !== 'undefined' && args[0] !== '') {
			capture = capture.toString()
			var i = 1;
			
			while(true) {
				if (i < args[0]) {
					i++;
					capture += clone;
				} else {
					break;
				}
			}
			
			return capture;
		} else {
			return false;
		}
	}
}

(function () {
	init();
} ())
