var Immutable = require('immutable')
, EventEmitter = require('events').EventEmitter

// TODO - max history depth

var internals = {
	
	update : function( state, newRootOrUpdateCallback ) {

		if( typeof newRootOrUpdateCallback === "object" ) {
			internals.updateWithObject( state, newRootOrUpdateCallback )
		} else {
			internals.updateWithMutation( state, newRootOrUpdateCallback )
		}
	},
	
	updateWithObject : function( state, newRoot ) {
		
		var prevRootIndex = state.history.indexOf( state.root )
		var list

		if( prevRootIndex === -1 || prevRootIndex === state.history.size - 1 ) {
			list = state.history
		} else {
			list = state.history.slice( 0, prevRootIndex + 1 )
		}

		state.history = list.push( newRoot )
		state.root = newRoot
	
		state.emitter.emit('update')
		
	},
	
	updateWithMutation : function( state, callback ) {
				
		internals.updateWithObject( state,
			state.root().withMutation( callback )
		)
		
	},
	
	undo : function( state, count = 1 ) {
		
		var currentRootIndex = state.history.indexOf( state.root )
		
		state.root = state.history.get(
			Math.min( state.history.size - 1,
				Math.max( 0, currentRootIndex - count )
			)
		)
		state.emitter.emit('undo')
	}
	
}

module.exports = function createGraph( initialRoot ) {

	var state = {
		history : Immutable.List([initialRoot])
	  , root : initialRoot
	  , emitter : new EventEmitter()
	}
	
	return Object.freeze({
		history				: ()		=> state.history
	  , root				: ()		=> state.root
	  , update				: newRoot	=> internals.update( state, newRoot )
	  , updateWithMutation	: callback	=> internals.updateWithMutation( state )
	  , undo				: n			=> internals.undo( state, n )
	  , redo				: n			=> internals.undo( state, -n )
	  , cursor				: path		=> Cursor.from( state.root, path )
	  , emitter				: state.emitter
	});
}