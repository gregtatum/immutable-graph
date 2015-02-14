var Immutable = require('immutable')
  , CreateGraph = require('../lib/graph')

describe("immutable graph", function() {
	
	beforeEach(function() {
		this.root = Immutable.Map()
		this.graph = CreateGraph( this.root )
	})
	
	it("creates a graph with a root", function() {
		expect( this.graph.root() ).toBe( this.root )
	})
	
	it("will update the graph without mutating the original root", function() {
		
		var newRoot = this.root.set( "foo", "bar" )
		this.graph.update( newRoot )
		
		expect( this.graph.root() ).not.toBe( this.root )
		expect( this.graph.root() ).toBe( newRoot )
		expect( newRoot ).not.toBe( this.root )
		expect( this.graph.root().get('foo') ).toBe( 'bar' )
	})
	
	it("will undo operations", function() {
	
		var graph = this.graph

		expect( graph.history().size ).toBe( 1 )
	
		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
	
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( "2nd" )
		expect( graph.root().get("c") ).toBe( "3rd" )
		
		expect( graph.history().size ).toBe( 4 )
		
		graph.undo(1)
		
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( "2nd" )
		expect( graph.root().get("c") ).toBe( undefined )
		
		graph.undo(10)
		
		expect( graph.root().get("a") ).toBe( undefined )
		expect( graph.root().get("b") ).toBe( undefined )
		expect( graph.root().get("c") ).toBe( undefined )
		
		expect( graph.history().size ).toBe( 4 )
	
	})
	
	it("will redo operations", function() {

		var graph = this.graph

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
		
		graph.undo(3)
		
		expect( graph.root().get("a") ).toBe( undefined )
		expect( graph.root().get("b") ).toBe( undefined )
		expect( graph.root().get("c") ).toBe( undefined )
		
		graph.redo(1)
		
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( undefined )
		expect( graph.root().get("c") ).toBe( undefined )
		
		graph.redo(10)
	
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( "2nd" )
		expect( graph.root().get("c") ).toBe( "3rd" )
		
		expect( graph.history().size ).toBe( 4 )
		
		
	})
	
	it("will drop forward history", function() {
		
		var graph = this.graph

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
		
		graph.undo(1)
		
		expect( graph.history().size ).toBe( 4 )
		
		graph.update( graph.root().set("d", "4th") )
		
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( "2nd" )
		expect( graph.root().get("c") ).toBe( undefined )
		expect( graph.root().get("d") ).toBe( "4th" )
		
		expect( graph.history().size ).toBe( 4 )
		
	})
	
	it("will overwrite forward history", function() {
		
		var graph = this.graph

		graph.update( graph.root().set("a", "1st") )
		graph.update( graph.root().set("b", "2nd") )
		graph.update( graph.root().set("c", "3rd") )
		
		graph.undo(1)
		
		graph.update( graph.root().set("d", "4th") )
		
		expect( graph.root().get("a") ).toBe( "1st" )
		expect( graph.root().get("b") ).toBe( "2nd" )
		expect( graph.root().get("c") ).toBe( undefined )
		expect( graph.root().get("d") ).toBe( "4th" )
		
	})
	
})