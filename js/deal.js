function init() {
	//Deal function
	String.prototype.deal = function() {
		var content = this,
			n		= 0,
			args	= arguments;
		
		for (var i in args) {
			if (content.search(/\{+[0-9]+\}/) !== -1) {
				content = content.replace('\{' + i + '\}', args[i])	
			} if (content.search(/\{[0-9][:][e][0-9]\}/) !== -1) {
				n = content.match(/\{[0-9][:][e][0-9]\}/)
				n = n[0].replace('\{'+i+':e','')
				n = n.replace('\}','')
				n = parseInt(n)
			
				if (content.search('\{'+i+':e'+n+'\}') !== -1) {
					args[i] = parseFloat(args[i])
					args[i] = args[i].toFixed(n)
					content = content.replace(/\{[0-9][:][e][0-9]\}/, args[i])	
				}
			}
		}
		
		return content;
	}
}


(function() {
	init();
	//Basic
	console.log('Hello: {0}'.deal('test'))
	//Decimal
	console.log('First: {0:e2}; Second: {1:e3}, Third: {2:e4}'.deal(100.384247983, 257.78432947, 387.84782947))
}())
