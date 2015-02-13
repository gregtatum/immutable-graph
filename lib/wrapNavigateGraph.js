var NavigateGraph = require('./navigateGraph')
var _ = require('lodash')

/*
 *	Returns an object where the graph is pre-set for every call
 */

module.exports = function( graph ) {
	
	return _.reduce( NavigateGraph, (memo, func, key) => {
		
		memo[key] = function wrappedNavigateGraphFunction() {
			var args = Array.prototype.slice.call( arguments )
			return func.apply(
				global,
				[ graph.root() ].concat( args )
			)
		}
		
		return memo
		
	}, {})
}