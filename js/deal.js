//Deal function
function init() {
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
	console.log('Functionando: {0:e2}, {1}'.deal('389.8713978', 'test'))
}())
