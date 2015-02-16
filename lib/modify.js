var Traverse = require('./traverse')()
  , _ = require('lodash')

var internal = {
	
	move : function( graph, node, target ) {
		
		var path
		
		if( _.isObject( target ) ) {
			path = target._keyPath
		} else {
			path = target
		}
		
		graph.update( root => {
				
			var nodeParent = Traverse.up( root, node )
			var nodeIndex = nodeParent.get('edges').indexOf( node )
			
			var nodeParentEdges = path.concat('edges')
			var targetEdges = target._keyPath.concat('edges')
			
			root.deleteIn( nodeParentEdges, nodeIndex )
			root.updateIn( targetEdges, edges => {
				edges.push( node )
			})
		})
		
		graph.emitter.emit('structurechange')
	},
	
	add : function( graph, node, target ) {
		
		var path
		
		if( _.isObject( target ) ) {
			path = target._keyPath
		} else {
			path = target
		}
		
		var existing = Traverse.filter( graph.root(), nodeB => node === nodeB )
		
		if( existing.length !== 0 )
			throw new Error("Attempting to add a duplicate node to a tree graph")
		
		graph.update( root => {
			
			root.updateIn( path.concat('edges'), edges => {
				edges.push( node )
			})
		})
		
		graph.emitter.emit('structurechange')
	},
	
	remove : function( graph, nodeOrIndex, target ) {
		
		var path, nodeExisted
		
		if( _.isObject( target ) ) {
			path = target._keyPath
		} else {
			path = target
		}
		
		graph.update( root => {
			
			root.updateIn( path.concat('edges'), edges => {
				
				var index
				
				if( typeof nodeOrIndex === "number" ) {
					index = nodeOrIndex
				} else {
					index = edges.indexOf( nodeOrIndex )
				}
				
				if( index >= 0 && index < edges.size ) {
					
					edges.splice( index )
					nodeExisted = true
					graph.emitter.emit('structurechange')
					
				} else {
					nodeExisted = false
				}
			})
		})
		
		return false
	}	
	
}

module.exports = function optionallyWrapInternalsWithPartial( optionalGraph ) {

	// Return just the internal functions
	// or a partial version of them with the graph in place

	if( _.isUndefined( optionalGraph ) ) {
		return internal
	} else {
	
		let graph = optionalGraph
	
		return _.reduce( internal, (memo, func, key) => {
	
			memo[key] = function wrappedTraverseFunction() {
				var args = Array.prototype.slice.call( arguments )
				return func.apply(
					global,
					[ graph ].concat( args )
				)
			}
	
			return memo
	
		}, {})
	}
}