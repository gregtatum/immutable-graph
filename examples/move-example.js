var Immutable = require('immutable')
  , Cursor = require('immutable/contrib/cursor')
  , CreateGraph = require('../lib/graph')
  , CreateNode = require('../lib/node')
  , CreateTraverse = require('../lib/traverse')
  , CreateModify = require('../lib/modify')
  , _ = require('lodash')

var graph = CreateGraph(
	
	CreateNode("root", {name: "root"}, [
		CreateNode("group", {name: "group0"}, [
			CreateNode("raster", {name: "raster1"}),
			CreateNode("raster", {name: "raster2"})
		])
	  , CreateNode("group", {name: "group1"})
	  , CreateNode("group", {name: "group2"})
	])	
)

var modify = CreateModify( graph )

var raster1 = Cursor.from( graph.root().getIn(['edges',0,'edges',0]) )
var group2 = Cursor.from( graph.root().getIn(['edges',2]) )
debugger
modify.move( raster1, group2 )