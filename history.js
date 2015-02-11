var Immutable = require('immutable')
var _ = require('lodash')

var internals = {
	
	// Create a new list from 0 to the previous graph, plus the new graph
	setGraph : function( state, newOrExistingGraph ) {

		//Graph is not necessarily the last one
		var existingGraphIndex = state.list.indexOf( newOrExistingGraph )
		
		
		if( existingGraphIndex === -1 ) {
			
			//The graph doesn't already exist
			
			let prevGraphIndex = state.list.indexOf( state.graph )
			let list
		
			if( prevGraphIndex === -1 || prevGraphIndex === state.list.size - 1 ) {
				list = state.list
			} else {
				list = state.list.slice( 0, prevGraphIndex + 1 )
			}
		
			state.list = list.push( newOrExistingGraph )
			state.graph = newOrExistingGraph
			
		} else {
			
			//The graph already exists, set it as the current graph
			
			state.graph = state.list.get( existingGraphIndex )
			
		}
		
	},
	
	// TODO
	// undo : function( state, n ) {
	// 	state.graph =
	// },
	
}

module.exports = function createNewHistory( initialGraph ) {
	
	var list = Immutable.List([initialGraph])
	
	var state = {
		list : list,
		graph : initialGraph
	}
	
	return Object.freeze({
		list	: ()		=> state.list
	  , set		: ( graph )	=> internals.setGraph( state, graph )
	  , current : ()		=> state.graph
	  , get		: ( n )		=> state.list.get( n )
	  // , undo	: (n)		=> internals.undo( state, n )
		
	});
}