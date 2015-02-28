var CreateGraph = require('../lib/graph')
  , Node = require('../lib/node')()
  , CreateTraverse = require('../lib/traverse')
  , ConsoleJSON = require('./utils/json')

var [,createRoot]		= Node.registerNodeType("root")
var [,createGroup]		= Node.registerNodeType("group")
var [,createRaster]		= Node.registerNodeType("raster")

function log(msg) {
	console.log(
		"\n----------------------------------\n| "+
		msg+
		"\n----------------------------------"
	)
	
}

module.exports = function runExample() {
	console.clear()
	
	//-----------------------------------
	// Init
	
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
	
	var root = graph.root()

	var traverse = CreateTraverse( graph )
	
	var rootPath = []
	
	//-----------------------------------
	// Simple traversing
	
	log("traverse down:")
	
	var group0Path = traverse.down( rootPath, 0 )
	var group1Path = traverse.down( rootPath, 1 )
	var group2Path = traverse.down( rootPath, 2 )
	
	ConsoleJSON( "group0:", root.getIn( group0Path ).toJSON() )
	ConsoleJSON( "group1:", root.getIn( group1Path ).toJSON() )
	ConsoleJSON( "group2:", root.getIn( group2Path ).toJSON() )


	log("traverse up:")
	
	var backToRootPath = traverse.up( group0Path )
	
	ConsoleJSON( "navigated root === original root? ", root.getIn( backToRootPath ) === graph.root() )
	
	
	//-----------------------------------
	// Function traversing
	
	log("traverse.each");
	
	traverse.each(function( path, node, root ) {
		ConsoleJSON( "Node:", {
			nodeName: node.getIn(['data','name'])
			, path: path.join(', ')
		})
	})
	
	log("traverse.reduce")
	
	ConsoleJSON( "Number of 'group' nodes:",
		
		traverse.reduce(function( memo, node, path ) {
			return memo + (node.get('type') === "group" ? 1 : 0)
		}, 0)
	)
	
	ConsoleJSON( "Number of 'raster' nodes:",
	
		traverse.reduce(function( memo, node, path ) {
			return memo + (node.get('type') === "raster" ? 1 : 0)
		}, 0)
	)
}