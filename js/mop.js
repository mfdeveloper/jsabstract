//Mop for no tipically operations
function init() {
	Function.prototype.mop = function () {
		var args = arguments,
			operators = ['*','+','-','/'];
		
		return 'Funcionando!';
	};
	
	mop = Function.mop;
}

(function () {
	init();
} ())
