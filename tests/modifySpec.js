var Immutable = require('immutable')
  , CreateGraph = require('../lib/graph')
  , ModifyGraph = require('../lib/modify')
  , Cursor = require('immutable/contrib/cursor')

describe("immutable graph", function() {
	
	beforeEach(function() {
		this.graph = CreateGraph(
			
			CreateNode("root", {name: "root"}, [
				CreateNode("group", {name: "group0"}, [
					CreateNode("raster", {name: "raster1"}),
					CreateNode("raster", {name: "raster2"})
				])
			  , CreateNode("group", {name: "group1"})
			  , CreateNode("group", {name: "group2"})
			])
		)
		
		this.modify = ModifyGraph( this.graph )
	})
	
	it("moves a node", function() {
		
		var group0 = this.graph.cursor( ['edges',0] )
		var group1 = this.graph.cursor( ['edges',1] )
		
		this.modify.move( group1, group0 )
		
		expect( this.graph.root().toJSON() ).toBe( null )
	})
		
})