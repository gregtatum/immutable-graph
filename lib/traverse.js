var Immutable = require('immutable')
  , _ = require('lodash')


var internals = {
	
	recursiveEach : function( root, callback, pathA ) {

		var edgesPath = pathA.concat('edges')
		var edges = root.getIn( edgesPath )
		
		if( !edges ) debugger

		edges.forEach(function( edge, i ) {
			var pathB = edgesPath.concat( i )
			callback( pathB, edge, root )
			internals.recursiveEach( root, callback, pathB )
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
	
	down : function( root, path, childIndex = 0 ) {
		
		var downPath = path.concat( 'edges', childIndex )
		
		return downPath

	},
	
	downAll : function( root, path ) {
		
		var downPath = path.concat( 'edges' )
		
		return downPath

	},
	
	up : function( root, path ) {
		
		return path.slice(0,-2)

	},
		
	sibling : function( root, path, directionOrIndexCallback ) {
		
		var siblingsPath = path.slice()
		var currentIndex = siblingsPath.pop()
		var siblings = root.getIn( siblingsPath )
		
		if( _.isFunction( directionOrIndexCallback ) ) {
			
			var newIndex = directionOrIndexCallback( siblingsPath, siblings )
			
		} else {
			
			if( directionOrIndexCallback !== -1 && directionOrIndexCallback !== 1 ) {
				directionOrIndexCallback = 1
			}
			
			var newIndex = ( currentIndex + directionOrIndexCallback + siblings.size ) % siblings.size
		
		}
		
		return siblingsPath.concat( newIndex )
	},
	
	each : function( root, callback, path = [] ) {
		
		callback( path, root.getIn(path), root )
		internals.recursiveEach( root, callback, path )
	},
	
	reduce : function( node, callback, memo, path = [] ) {
		
		return internals.recursiveReduce( node, callback, callback( memo, node, path ), path )
	},
	
	filter : function( root, callback, path = [] ) {
		
		return externals.reduce( root, (memo, node, path) => {
			
			if( callback( node, path ) ) {
				return memo.concat( [path] )
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