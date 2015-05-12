var Immutable = require('immutable')
  , EventEmitter = require('events').EventEmitter
  , CreateTraverse = require('./traverse')
  , CreateModify = require('./modify')

var internals = {
	
	update : function( state, newRootOrUpdateCallback ) {

		if( typeof newRootOrUpdateCallback === "object" ) {
			internals.updateWithObject( state, newRootOrUpdateCallback )
		} else {
			internals.updateWithMutations( state, newRootOrUpdateCallback )
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
	
	updateWithMutations : function( state, callback ) {
				
		internals.updateWithObject( state,
			state.root.withMutations( callback )
		)
		
	},
	
	undo : function( state, count = 1 ) {
		
		var currentRootIndex = state.history.indexOf( state.root )
		
		state.root = state.history.get(
			Math.min( state.history.size - 1,
				Math.max( 0, currentRootIndex - count )
			)
		)
		state.emitter.emit('update')
		state.emitter.emit('undo')
	}
	
}

module.exports = function createGraph( initialRoot ) {

	var state = {
		history : Immutable.List([initialRoot])
	  , root : initialRoot
	  , emitter : new EventEmitter()
	}
	
	var api = {
		history				: ()			=> state.history
	  , root				: ()			=> state.root
	  , update				: newRootOrFn	=> internals.update( state, newRootOrFn )
	  , undo				: n				=> internals.undo( state, n )
	  , redo				: n				=> internals.undo( state, -n )
	  , emitter				: state.emitter
	}
	
	api.traverse = CreateTraverse( api )
	api.modify = CreateModify( api )
	
	return Object.freeze( api );
}