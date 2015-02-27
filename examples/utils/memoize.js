var shallowEquals = require('shallow-equals')

module.exports = function memoize(fn) {
	
	var cachedArguments
	var cachedResult
	
	return function(...args) {
		
		if( !shallowEquals( args, cachedArguments ) ) {
			
			cachedArguments = args
			cachedResult = fn.apply(this, args)
		}
		
		return cachedResult
	}
}