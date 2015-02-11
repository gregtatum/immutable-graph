var Immutable = require('immutable')
var CreateNewHistory = require('./history')

var graph = Immutable.Map();
var graphHistory = CreateNewHistory( graph );


function log( msg ) {
	
	console.log( "\n\n" + msg )
	console.log( "Full history:", graphHistory.list().toJSON() ) 
	console.log( "Current object:", graphHistory.current().toJSON() ) 
	
}

graphHistory.set( graphHistory.current().set("a", "A first property") )
log( "setting a")

graphHistory.set( graphHistory.current().set("b", "A new property") )
log( "setting b")

graphHistory.set( graphHistory.current().set("c", "Setting a final property") )
log( "setting c")

graphHistory.set( graphHistory.get(-3) )
log( "going back in time 3 from the right")

graphHistory.set( graphHistory.current().set("d", "Going back almost to the beginning") )
log( "rewriting history" )