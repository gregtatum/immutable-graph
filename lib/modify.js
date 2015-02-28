var Traverse = require('./traverse')()
  , _ = require('lodash')

var internals = {
	
	ensureMovePath : function( nodePath, targetPath ) {
	
		//If a move path is disrupted by the deleteIn command, adjust it to still work
		
		var nodePathEdges = nodePath.slice(0, nodePath.length-1)
		var edgesMatch = _.reduce( nodePathEdges, (memo, nodePathPart, i ) => {
			
			return memo && nodePathPart === targetPath[i]
		}, true)
		
		var targetPathB = targetPath.slice()
		
		if( edgesMatch ) {

			let nodeIndex = nodePath[ nodePath.length - 1 ]
			let targetIndex = targetPath[ nodePath.length - 1 ]
			
			if( targetIndex > nodeIndex ) {
				
				--targetPathB[ nodePath.length - 1 ]
			}
		}
		
		return targetPathB
	}
}

var externals = {
	
	move : function( graph, nodePath, targetPath ) {
		
		graph.update( root => {
			
			var node = root.getIn( nodePath )
			root.deleteIn( nodePath )
			
			var targetPathB = internals.ensureMovePath( nodePath, targetPath )
			
			root.updateIn( targetPathB.concat('edges'), edges => {
				return edges.push( node )
			})
		})
	},
	
	add : function( graph, targetPath, node ) {
		
		graph.update( root => {
			
			root.updateIn( targetPath.concat('edges'), edges => {
				return edges.push( node )
			})
		})
	},
	
	remove : function( graph, targetPath, nodeOrIndex ) {
		
		graph.update( root => {
			
			root.updateIn( targetPath.concat('edges'), edges => {
				
				var index
				
				if( typeof nodeOrIndex === "number" ) {
					index = nodeOrIndex
				} else {
					index = edges.indexOf( nodeOrIndex )
				}
				
				if( index >= 0 && index < edges.size ) {
					
					return edges.splice( index, 1 )
					
				} else {
					return edges
				}
			})
		})
	}	
}

module.exports = function optionallyWrapApiWithPartial( optionalGraph ) {

	// Return just the external functions
	// or a partial version of them with the graph in place

	if( _.isUndefined( optionalGraph ) ) {
		return Object.freeze(externals)
	} else {
	
		let graph = optionalGraph
	
		return Object.freeze(_.reduce( externals, (memo, func, key) => {
	
			memo[key] = function wrappedTraverseFunction() {
				var args = Array.prototype.slice.call( arguments )
				return func.apply(
					global,
					[ graph ].concat( args )
				)
			}
	
			return memo
	
		}, {}))
	}
}