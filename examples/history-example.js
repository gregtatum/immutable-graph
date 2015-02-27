var Immutable = require('immutable')
var CreateGraph = require('../lib/graph')

var root = Immutable.Map()
var graph = CreateGraph( root )

function json( message, obj ) {
	console.log( message, JSON.stringify( obj, null, "\t" ) );
}
function log( msg ) {
	
	console.log( "\n\n" + msg )
	json( "Full history:", graph.history().toJSON() ) 
	json( "Current object:", graph.root().toJSON() ) 
	
}

graph.update( graph.root().set("a", "A first property") )

log( "set a")

graph.update( graph.root().set("b", "A new property") )

log( "set b")

graph.update( graph.root().set("c", "Setting a final property") )

log( "set c")

graph.undo( 2 )

log( "went back in time twice")

graph.update( graph.root().set("d", "Going back almost to the beginning") )

log( "rewrote history" )