var Immutable = require('immutable')
var CreateGraph = require('../lib/graph')

var root = Immutable.Map()
var graph = CreateGraph( root )

function log( msg ) {
	
	console.log( "\n\n" + msg )
	console.log( "Full history:", graph.history().toJSON() ) 
	console.log( "Current object:", graph.root().toJSON() ) 
	
}

graph.update( graph.root().set("a", "A first property") )

log( "set a")

graph.update( graph.root().set("b", "A new property") )

log( "set b")

graph.update( graph.root().set("c", "Setting a final property") )

log( "set c")

graph.undo( 3 )

log( "went back in time 3 from the right")

graph.update( graph.root().set("d", "Going back almost to the beginning") )

log( "rewrote history" )