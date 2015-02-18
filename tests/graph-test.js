var Immutable = require('immutable')
  , CreateGraph = require('../lib/graph')
  , test = require('tape')


test("graph", function(t) {
		
	t.test("- creates a graph with a root", function(t) {
		t.plan(1)

		var root = Immutable.Map()
		var graph = CreateGraph( root )

		t.equal( graph.root(), root )
	})

	t.test("- will update the graph without mutating the original root", function(t) {
		t.plan(4)

		var root = Immutable.Map()
		var graph = CreateGraph( root )
	
		var newRoot = root.set( "foo", "bar" )
		graph.update( newRoot )
	
		t.notEqual( graph.root(), root )
		t.equal( graph.root(), newRoot )
		t.notEqual( newRoot, root )
		t.equal( graph.root().get('foo'), 'bar' )
	})

	t.test("- will undo operations", function(t) {
		t.plan(12)

		var graph = CreateGraph( Immutable.Map() )

		t.equal( graph.history().size, 1 )

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )

		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), "2nd" )
		t.equal( graph.root().get("c"), "3rd" )
	
		t.equal( graph.history().size, 4 )
	
		graph.undo(1)
	
		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), "2nd" )
		t.equal( graph.root().get("c"), undefined )
	
		// Undo extra times
		graph.undo(10)
	
		t.equal( graph.root().get("a"), undefined )
		t.equal( graph.root().get("b"), undefined )
		t.equal( graph.root().get("c"), undefined )
	
		t.equal( graph.history().size, 4 )

	})

	t.test("- will redo operations", function(t) {
		t.plan(10)

		var graph = CreateGraph( Immutable.Map() )

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
	
		graph.undo(3)
	
		t.equal( graph.root().get("a"), undefined )
		t.equal( graph.root().get("b"), undefined )
		t.equal( graph.root().get("c"), undefined )
	
		graph.redo(1)
	
		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), undefined )
		t.equal( graph.root().get("c"), undefined )
	
		graph.redo(10)

		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), "2nd" )
		t.equal( graph.root().get("c"), "3rd" )
	
		t.equal( graph.history().size, 4 )
	
	
	})

	t.test("- will drop forward history", function(t) {
		t.plan(6)
	
		var graph = CreateGraph( Immutable.Map() )

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
	
		graph.undo(1)
	
		t.equal( graph.history().size, 4 )
	
		graph.update( graph.root().set("d", "4th") )
	
		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), "2nd" )
		t.equal( graph.root().get("c"), undefined )
		t.equal( graph.root().get("d"), "4th" )
	
		t.equal( graph.history().size, 4 )
	
	})

	t.test("- will overwrite forward history", function(t) {
		t.plan(4)
	
		var graph = CreateGraph( Immutable.Map() )

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
	
		graph.undo(1)
	
		graph.update( graph.root().set("d", "4th") )
	
		t.equal( graph.root().get("a"), "1st" )
		t.equal( graph.root().get("b"), "2nd" )
		t.equal( graph.root().get("c"), undefined )
		t.equal( graph.root().get("d"), "4th" )
	
	})
})