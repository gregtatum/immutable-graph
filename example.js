var Immutable = require('immutable')
var Cursor = require('immutable/contrib/cursor');
var CreateGraph = require('./lib/graph')
var CreateNode = require('./lib/node')

var root = CreateNode("root", {}, [
	CreateNode("group")
  , CreateNode("group")
  , CreateNode("group")
  , CreateNode("group")
])

var graph = CreateGraph( root )

function log( msg ) {
	
	console.log( "\n\n" + msg )
	console.log( "Full history:", graph.history().toJSON() ) 
	console.log( "Current object:", graph.root().toJSON() ) 
	
}

function setIn() {
	var root = graph.root()
	graph.set( root.setIn.apply(root, arguments) )
}

function updateIn() {
	var root = graph.root()
	graph.set( root.updateIn.apply(root, arguments) )
}

updateIn( ['edges'], edges => edges.push( CreateNode("raster") ) )
updateIn( ['edges', 1, 'edges' ], edges => edges.push( CreateNode("raster") ) )

log( "Initial graph" )