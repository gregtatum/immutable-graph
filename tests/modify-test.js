var Immutable = require('immutable')
  , CreateGraph = require('../lib/graph')
  , CreateNode = require('../lib/node')
  , ModifyGraph = require('../lib/modify')
  , test = require('tape')

var _graph = function() {
	return CreateGraph(
		
		CreateNode("root", {name: "root"}, [
			CreateNode("group", {name: "group0"}, [
				CreateNode("raster", {name: "raster1"}),
				CreateNode("raster", {name: "raster2"})
			])
		  , CreateNode("group", {name: "group1"})
		  , CreateNode("group", {name: "group2"})
		])
	)
}

test("modify", function(t) {
	
	t.test("- moves a node", function(t) {
		t.plan(2)

		var graph = _graph()
		var modify = ModifyGraph( graph )

		var group0 = ['edges',0]
		var group1 = ['edges',1]

		modify.move( group1, group0 )

		t.equal( graph.root().getIn(['edges', 0, 'edges', 2, 'data', 'name']), "group1" )
		t.equal( graph.root().getIn(['edges', 1, 'data', 'name']), "group2" )

	})
	
	t.test("- moves a node when the path gets mangled", function(t) {
		t.plan(2)
		
		var graph = _graph()
		var modify = ModifyGraph( graph )
		
		var group0 = ['edges',0]
		var group1 = ['edges',1]
		
		modify.move( group0, group1 )
		
		t.equal( graph.root().getIn(['edges', 0, 'data', 'name']), "group1" )
		t.equal( graph.root().getIn(['edges', 0, 'edges', 0, 'data', 'name']), "group0" )
		
	})
	
	t.test("- adds a node", function(t) {
		t.plan(3)

		var graph = _graph()
		var modify = ModifyGraph( graph )

		var group0 = ['edges',0]

		t.equal( graph.root().getIn(['edges', 0, 'edges']).size, 2 )

		modify.add( group0, CreateNode("group", {name: "added node"} ) )

		t.equal( graph.root().getIn(['edges', 0, 'edges', 2, 'data', 'name']), "added node" )
		t.equal( graph.root().getIn(['edges', 0, 'edges']).size, 3 )

	})
	
	t.test("- removes a node with an index", function(t) {
		t.plan(1)

		var graph = _graph()
		var modify = ModifyGraph( graph )

		var group0 = ['edges',0]

		modify.remove( group0, 0 )

		t.equal( graph.root().getIn(['edges', 0, 'edges', 0, 'data', 'name']), "raster2" )

	})
	
})