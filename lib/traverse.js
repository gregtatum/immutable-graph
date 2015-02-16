var Immutable = require('Immutable')
  , Cursor = require('immutable/contrib/cursor')
  , _ = require('lodash')


var internals = {
	
	recursiveEach : function( node, callback, pathA ) {
		
		var edges = node.get('edges')
		
		edges.forEach(function( edge, i ) {
			var pathB = pathA.concat( 'edges', i )
			callback( edge, pathB )
			internals.recursiveEach( edge, callback, pathB )
		})
	},
	
	recursiveReduce : function( node, callback, memoA, pathA ) {
		
		var edges = node.get('edges')
		
		return edges.reduce(function( memoB, edge, i ) {
			
			var pathB = pathA.concat( 'edges', i )
			var result = callback( memoB, edge, pathB )
			
			return internals.recursiveReduce(
				edge
			  , callback
			  , result
			  , pathB
			)
		}, memoA )
	}
}

var externals = {
	
	down : function( root, cursor, childIndex = 0 ) {
		
		var downPath = cursor._keyPath.concat( 'edges', childIndex )
		
		return Cursor.from( root, downPath )

	},
	
	downAll : function( root, cursor ) {
		
		var downPath = cursor._keyPath.concat( 'edges' )
		
		return Cursor.from( root, downPath )

	},
	
	up : function( root, cursor ) {
		
		return Cursor.from( root, cursor._keyPath.slice(0,-2) )

	},
		
	sibling : function( root, cursor, directionOrIndexCallback ) {
		
		var siblingsPath = cursor._keyPath.slice()
		var currentIndex = siblingsPath.pop()
		var siblings = Cursor.from( root, siblingsPath )		
		
		if( _.isFunction( directionOrIndexCallback ) ) {
			
			var newIndex = directionOrIndexCallback( siblings )
			
		} else {
			
			if( directionOrIndexCallback !== -1 && directionOrIndexCallback !== 1 ) {
				directionOrIndexCallback = 1
			}
			
			var newIndex = ( currentIndex + directionOrIndexCallback + siblings.size ) % siblings.size
		
		}
		
		return Cursor.from( root, siblingsPath.concat( newIndex ) )
	},
	
	each : function( node, callback, path = [] ) {
		callback( node, path )
		internals.recursiveEach( node, callback, path )
	},
	
	reduce : function( node, callback, memo, path = [] ) {
		
		return internals.recursiveReduce( node, callback, callback( memo, node, path ), path )
	},
	
	filter : function( root, callback, path = [] ) {
		
		return externals.reduce( root, (memo, node, path) => {
			
			if( callback( node, path ) ) {
				return memo.concat( Cursor.from(root, path) )
			} else {
				return memo
			}
			
		}, [], path)
	}
}

module.exports = function traverseInternalsOrWrappedTraverse( optionalGraph ) {

	// Return just the externals functions, or a wrapped version of them with the graph in place

	if( _.isUndefined( optionalGraph ) ) {
		return externals
	} else {
	
		let graph = optionalGraph
	
		return _.reduce( externals, (memo, func, key) => {
	
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