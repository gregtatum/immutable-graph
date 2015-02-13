var Immutable = require('immutable')
  , Cursor = require('immutable/contrib/cursor')
  , CreateGraph = require('./lib/graph')
  , CreateNode = require('./lib/node')
  , WrapNav = require('./lib/wrapNavigateGraph')
  , _ = require('lodash')

var root = CreateNode("root", {}, [
	CreateNode("group", {name: "group 0"})
  , CreateNode("group", {name: "group 1"})
  , CreateNode("group", {name: "group 2"})
  , CreateNode("group", {name: "group 3"})
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

updateIn( ['edges'], edges => edges.push( CreateNode("raster", {name: "raster1"}) ) )
updateIn( ['edges', 1, 'edges' ], edges => edges.push( CreateNode("raster",{name: "raster2"}) ) )

log( "Initial graph" )

var nav = WrapNav( graph )

var root = Cursor.from( graph.root(), [] )
var rootEdges = Cursor.from( graph.root(), ['edges'] )
var firstChild = Cursor.from( graph.root(), ['edges', 0] )


function findSiblingByName( name ) {
	return function( siblings ) {
		var group = siblings.find( function( sibling ) {
			return sibling.getIn(['data','name']) === name
		})
	
		return siblings.indexOf( group )
	}
}

var group0 = nav.down( root )
var group1 = nav.sibling( group0 )
var group2 = nav.sibling( group1, 1 )
var group3 = nav.sibling( group2, -3 )
var raster1 = nav.sibling( group3, findSiblingByName("raster1") )

console.log( group0.toJSON().data.name )
console.log( group1.toJSON().data.name )
console.log( group2.toJSON().data.name )
console.log( group3.toJSON().data.name )
console.log( raster1.toJSON().data.name )