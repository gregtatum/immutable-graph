var Immutable = require('immutable')
var CreateGraph = require('./lib/graph')

var root = Immutable.Map()
var graph = CreateGraph( root )

function log( msg ) {
	
	console.log( "\n\n" + msg )
	console.log( "Full history:", graph.history().toJSON() ) 
	console.log( "Current object:", graph.root().toJSON() ) 
	
}

graph.set( graph.root().set("a", "A first property") )

log( "set a")

graph.set( graph.root().set("b", "A new property") )

log( "set b")

graph.set( graph.root().set("c", "Setting a final property") )

log( "set c")

graph.set( graph.get(-3) )

log( "went back in time 3 from the right")

graph.set( graph.root().set("d", "Going back almost to the beginning") )

log( "rewrote history" )