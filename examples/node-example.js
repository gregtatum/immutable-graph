var Node = require('../lib/node')()
  , CreateGraph = require('../lib/graph')
  , CreateTraverse = require('../lib/traverse')
  , lerp = require('./utils/lerp')
  , memoize = require('./utils/memoize')
  , _ = require('lodash')


//------------------------------------------
// definitions

var [rasterSlug, createRoot]		= Node.registerNodeType("root")
var [groupSlug, createGroup]		= Node.registerNodeType("group")
var [rasterSlug, createRaster]		= Node.registerNodeType("raster")
var [rasterSlug2, createRaster2]	= Node.registerNodeType("raster")
var [vectorSlug, createVector]		= Node.registerNodeType("vector")

//Theoretical force thing
var [forceSlug, getForce] = Node.registerStateType("force")


//-----------------------------------------------------
// the graph

var graph = CreateGraph(

	createRoot({name: "my root"}, [
		createGroup({name: "group 0"}, [
			createRaster({name: "raster1"})
		  , createRaster2({name: "raster2"})
		])
	  , createGroup({name: "group 1"})
	  , createGroup({name: "group 2"})
	  , createGroup({name: "group 3"})
	])
)


//-----------------------------------------------------
// non-realtime traversals and graph processing

var traverse = CreateTraverse( graph )

var i = 0

traverse.each(function( path, node ) {
	var force = getForce( node )
	force.x = i++
	force.y = i++
});

var getAllForceStates = memoize(function () {
	
	return traverse.reduce(function( memo, node ) {
		memo.push( getForce( node ) )
		return memo
	}, [])
})


//-----------------------------------------------------
// realtime state mutation:

for( let i=0; i < 50; i++ ) {
	
	_.each( getAllForceStates(), function( force ) {
		force.x = lerp( force.x, 50, 0.05 );
		force.y = lerp( force.y, 50, 0.05 );
	});
	
}

console.log( graph.root().toJSON() )