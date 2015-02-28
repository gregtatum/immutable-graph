var Immutable = require('immutable')
  , Cursor = require('immutable/contrib/cursor')
  , CreateGraph = require('../lib/graph')
  , Node = require('../lib/node')()
  , CreateTraverse = require('../lib/traverse')
  , CreateModify = require('../lib/modify')
  , _ = require('lodash')
  , ConsoleJSON = require('./utils/json')

var [,createRoot]		= Node.registerNodeType("root")
var [,createGroup]		= Node.registerNodeType("group")
var [,createRaster]		= Node.registerNodeType("raster")
var [,createVector]		= Node.registerNodeType("vector")

module.exports = function runExample() {
	console.clear()
	
	//Set up the graph
	var graph = CreateGraph(
	
		createRoot({name: "root"}, [
			createGroup({name: "group0"}, [
				createRaster({name: "raster1"}),
				createRaster({name: "raster2"})
			])
		  , createGroup({name: "group1"})
		  , createGroup({name: "group2"})
		])
	)

	var modify = CreateModify( graph )

	ConsoleJSON( "Base graph shape:", graph.root().toJSON() ) 

	var raster1 = ['edges',0,'edges',0]
	var group2 = ['edges',2]

	modify.move( raster1, group2 )

	ConsoleJSON( "Moved raster1 to group2:", graph.root().toJSON() ) 
	
}