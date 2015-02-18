var CreateGraph = require('../lib/graph')
  , CreateNode = require('../lib/node')
  , CreateTraverse = require('../lib/traverse')
  , _ = require('lodash')
  , test = require('tape')

function _newGraph() {
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

test("traverse", function(t) {
		
	t.test("- navigate down one", function(t) {
		t.plan(1)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [] )
		
		t.equal( root.getIn( group0.concat('data','name') ), "group0" )
		
	})

	t.test("- navigate down one to a specific index", function(t) {
		t.plan(3)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [], 0 )
		var group1 = traverse.down( [], 1 )
		var group2 = traverse.down( [], 2 )
		
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( group1.concat(['data','name']) ), "group1" )
		t.equal( root.getIn( group2.concat(['data','name']) ), "group2" )
		
	})
	
	t.test("- navigate up one", function(t) {
		t.plan(2)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [] )
		var rootPath = traverse.up( group0 )
		
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( rootPath.concat(['data','name']) ), "root" )
	})
	
	t.test("- navigate siblings: move forward without a direction parameter", function(t) {
		t.plan(4)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [] )
		var group1 = traverse.sibling( group0 )
		var group2 = traverse.sibling( group1 )
		var group0b = traverse.sibling( group2 )
	
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( group1.concat(['data','name']) ), "group1" )
		t.equal( root.getIn( group2.concat(['data','name']) ), "group2" )
		t.equal( root.getIn( group0b.concat(['data','name']) ), "group0" )
	})

	t.test("- navigate siblings: move forward with a 1 direction", function(t) {
		t.plan(4)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [] )
		var group1 = traverse.sibling( group0, 1)
		var group2 = traverse.sibling( group1, 1 )
		var group0b = traverse.sibling( group2, 1 )
	
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( group1.concat(['data','name']) ), "group1" )
		t.equal( root.getIn( group2.concat(['data','name']) ), "group2" )
		t.equal( root.getIn( group0b.concat(['data','name']) ), "group0" )
	})

	t.test("- navigate siblings: move backward with a -1 direction", function(t) {
		t.plan(4)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var group0 = traverse.down( [] )
		var group2 = traverse.sibling( group0, -1 )
		var group1 = traverse.sibling( group2, -1 )
		var group0b = traverse.sibling( group1, -1 )
	
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( group1.concat(['data','name']) ), "group1" )
		t.equal( root.getIn( group2.concat(['data','name']) ), "group2" )
		t.equal( root.getIn( group0b.concat(['data','name']) ), "group0" )
	})
	
	t.test("- navigate siblings: nav to a sibling given a function that returns an index", function(t) {
	
		t.plan(4)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		function findSiblingByName( name ) {
			return function( path, siblings ) {
				debugger
				var group = siblings.find(function( sibling ) {
					return sibling.getIn(['data','name']) === name
				})
			
				return siblings.indexOf( group )
			}
		}
	
		var group0 = traverse.down( [] )
		
		var group1 = traverse.sibling( group0, findSiblingByName("group1") )
		var group2 = traverse.sibling( group0, findSiblingByName("group2") )
		var group3 = traverse.sibling( group0, findSiblingByName("group3") )
		var group0b = traverse.sibling( group0, findSiblingByName("group0") )
	
		t.equal( root.getIn( group0.concat(['data','name']) ), "group0" )
		t.equal( root.getIn( group1.concat(['data','name']) ), "group1" )
		t.equal( root.getIn( group2.concat(['data','name']) ), "group2" )
		t.equal( root.getIn( group0b.concat(['data','name']) ), "group0" )
	})
	
	t.test("- traverse each node", function(t) {
		t.plan(7)

		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var memo = ""
		var paths = []
		
		traverse.each(function( path, node, root ) {
			paths.push( path )
			memo += node.getIn(['data','name'])
		})
		
		t.equal( memo, "rootgroup0raster1raster2group1group2" )

		t.isEquivalent( paths[0], [] )
		t.isEquivalent( paths[1], ['edges', 0] )
		t.isEquivalent( paths[2], ['edges', 0, 'edges', 0] )
		t.isEquivalent( paths[3], ['edges', 0, 'edges', 1] )
		t.isEquivalent( paths[4], ['edges', 1] )
		t.isEquivalent( paths[5], ['edges', 2] )
		
	})
	
	t.test("- reduce each node", function(t) {
		t.plan(7)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var paths = []
		var result = traverse.reduce(function( memo, node, path ) {
			paths.push( path )
			return memo + node.getIn(['data','name'])
		}, "")
		
		t.equal( result, "rootgroup0raster1raster2group1group2" )
		
		t.isEquivalent( paths[0], [] )
		t.isEquivalent( paths[1], ['edges', 0] )
		t.isEquivalent( paths[2], ['edges', 0, 'edges', 0] )
		t.isEquivalent( paths[3], ['edges', 0, 'edges', 1] )
		t.isEquivalent( paths[4], ['edges', 1] )
		t.isEquivalent( paths[5], ['edges', 2] )
		
	})
	
	t.test("- filter nodes", function(t) {
		t.plan(8)
		
		var graph = _newGraph()
		var root = graph.root()
		var traverse = CreateTraverse( graph )
		
		var paths = []
		
		debugger
		var nodes = traverse.filter(function( node, path ) {

			paths.push( path )
			
			var name = node.getIn( ['data', 'name'] )
			
			if( name === "raster1" || name === "raster2" ) {
				return true
			} else {
				return false
			}
		})
		
		t.equal( root.getIn( nodes[0].concat(['data', 'name']) ), "raster1" )
		t.equal( root.getIn( nodes[1].concat(['data', 'name']) ), "raster2" )
		
		t.isEquivalent( paths[0], [] )
		t.isEquivalent( paths[1], ['edges', 0] )
		t.isEquivalent( paths[2], ['edges', 0, 'edges', 0] )
		t.isEquivalent( paths[3], ['edges', 0, 'edges', 1] )
		t.isEquivalent( paths[4], ['edges', 1] )
		t.isEquivalent( paths[5], ['edges', 2] )
		
	})
	
})