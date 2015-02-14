var Immutable = require('immutable')

// TODO
// max history depth

var internals = {
	
	// Create a new list from 0 to the previous root, plus the new root
	updateGraph : function( state, newOrExistingRoot ) {

		//Graph is not necessarily the last one
		var existingRootIndex = state.history.indexOf( newOrExistingRoot )
		
		if( existingRootIndex === -1 ) {
			
			//The graph doesn't already exist
			
			let prevRootIndex = state.history.indexOf( state.root )
			let list
		
			if( prevRootIndex === -1 || prevRootIndex === state.history.size - 1 ) {
				list = state.history
			} else {
				list = state.history.slice( 0, prevRootIndex + 1 )
			}
		
			state.history = list.push( newOrExistingRoot )
			state.root = newOrExistingRoot
			
		} else {
			
			//The graph already exists, set it as the current graph
			
			state.root = state.history.get( existingRootIndex )
			
		}
		
	},
	
	undo : function( state, count = 1 ) {
		
		var currentRootIndex = state.history.indexOf( state.root )
		
		state.root = state.history.get(
			Math.min( state.history.size - 1,
				Math.max( 0, currentRootIndex - count )
			)
		)
		
	}
	
}

module.exports = function createGraph( initialRoot ) {

	var state = {
		history : Immutable.List([initialRoot]),
		root : initialRoot
	}
	
	return Object.freeze({
		history	: ()	=> state.history
	  , root	: ()	=> state.root
	  , update	: graph	=> internals.updateGraph( state, graph )
	  , undo	: n		=> internals.undo( state, n )
	  , redo	: n		=> internals.undo( state, -n )
	});
}