var Immutable = require('Immutable')
  , Cursor = require('immutable/contrib/cursor')
  , _ = require('lodash')

var internal = {
	
	down : function( graph, cursor, childIndex = 0 ) {
		
		var downPath = cursor._keyPath.concat( 'edges', childIndex )
		
		return Cursor.from( graph, downPath )

	},
	
	downAll : function( graph, cursor ) {
		
		var downPath = cursor._keyPath.concat( 'edges' )
		
		return Cursor.from( graph, downPath )

	},
	
	up : function( graph, cursor ) {
		
		return Cursor.from( graph, cursor._keyPath.slice(0,-2) )

	},
		
	sibling : function( graph, cursor, directionOrIndexCallback ) {
		
		var siblingsPath = cursor._keyPath.slice()
		var currentIndex = siblingsPath.pop()
		var siblings = Cursor.from( graph, siblingsPath )		
		
		if( _.isFunction( directionOrIndexCallback ) ) {
			
			var newIndex = directionOrIndexCallback( siblings )
			
		} else {
			
			if( directionOrIndexCallback !== -1 && directionOrIndexCallback !== 1 ) {
				directionOrIndexCallback = 1
			}
			
			var newIndex = ( currentIndex + directionOrIndexCallback + siblings.size ) % siblings.size
		
		}
		
		return Cursor.from( graph, siblingsPath.concat( newIndex ) )
	}
}

module.exports = function createTraverse( optionalGraph ) {
	
	// Return just the internal functions, or a wrapped version of them with the graph in place
	
	if( _.isUndefined( optionalGraph ) ) {
		return internal
	} else {
		
		let graph = optionalGraph
		
		return _.reduce( internal, (memo, func, key) => {
		
			memo[key] = function wrappedTraverseFunction() {
				var args = Array.prototype.slice.call( arguments )
				return func.apply(
					global,
					[ graph.root() ].concat( args )
				)
			}
		
			return memo
		
		}, {})
	}
}