var Immutable = require('Immutable')
  , Cursor = require('immutable/contrib/cursor')
  , _ = require('lodash')

module.exports = {
	
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