var Immutable = require('immutable')
  , CreateGraph = require('../lib/graph')
  , ConsoleJSON = require('./utils/json')

module.exports = function runExample() {
	console.clear()
	
	//----------------------------------------
	// init
	
	var root = Immutable.Map()
	var graph = CreateGraph( root )
	
	function log( msg ) {

		console.log( "\n\n" + msg )
		ConsoleJSON( "Full history:", graph.history().toJSON() ) 
		ConsoleJSON( "Current object:", graph.root().toJSON() ) 

	}

	//----------------------------------------
	// run exampless
	

	graph.update( graph.root().set("a", "A first property") )

	log( "set a" )

	graph.update( graph.root().set("b", "A new property") )

	log( "set b" )

	graph.update( graph.root().set("c", "Setting a final property") )

	log( "set c" )

	graph.undo( 2 )

	log( "went back in time twice" )

	graph.update( graph.root().set("d", "Going back almost to the beginning") )

	log( "rewrote history" )
}