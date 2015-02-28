var Node = require('../lib/node')()
  , CreateGraph = require('../lib/graph')
  , CreateTraverse = require('../lib/traverse')
  , lerp = require('./utils/lerp')
  , memoize = require('./utils/memoize')
  , ConsoleJSON = require('./utils/json')

//------------------------------------------
// definitions

// Register node types
var [rasterSlug, createRoot]		= Node.registerNodeType("root")
var [groupSlug, createGroup]		= Node.registerNodeType("group")
var [rasterSlug, createRaster]		= Node.registerNodeType("raster")
var [vectorSlug, createVector]		= Node.registerNodeType("vector")

//Theoretical force thing
var [forceSlug, getForce] = Node.registerStateType("force")

module.exports = function runExample() {
	console.clear()
	
	//-----------------------------------------------------
	// the graph

	var graph = CreateGraph(

		createRoot({name: "my root"}, [
			createGroup({name: "group 0"}, [
				createRaster({name: "raster1"})
			  , createRaster({name: "raster2"})
			])
		  , createGroup({name: "group 1"})
		])
	)

	ConsoleJSON("Graph before any state is added", graph.root().toJSON() )

	//-----------------------------------------------------
	// non-realtime traversals and graph processing

	var traverse = CreateTraverse( graph )

	var i = 0

	//Memoize a list of force states
	// Note that these are on "raster" type nodes only
	// This function will only re-run if the immmutable properties change
	var getAllForceStates = memoize(function () {
	
		return traverse.reduce(function( memo, node ) {
			if( node.get('type') === "raster" ) {
				
				//getForce() accesses the node, checks to see if the state object exists for the
				// slug, if not it creates and it returns it, otherwise just returns it				
				var force = getForce( node )
				
				memo.push( force )
			}
			return memo
		}, [])
	})
	
	getAllForceStates().forEach(function setInitialForceState( force ) {
		force.x = i++
		force.y = i++
	});

	ConsoleJSON("No history is added, but the mutable state is changed", graph.root().toJSON() )


	//-----------------------------------------------------
	// realtime mutable state:

	for( let i=0; i < 50; i++ ) {
	
		getAllForceStates().forEach(function( force ) {
			force.x = lerp( force.x, 50, 0.05 );
			force.y = lerp( force.y, 50, 0.05 );
		});
	
	}

	ConsoleJSON("After force calculations", graph.root().toJSON() )
	
}