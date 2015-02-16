var Cursor = require('immutable/contrib/cursor')
  , CreateGraph = require('../lib/graph')
  , CreateNode = require('../lib/node')
  , CreateTraverse = require('../lib/traverse')
  , _ = require('lodash')

describe("navigateGraph", function() {
	
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
		
		this.root = Cursor.from( this.graph.root(), [] )

		this.traverse = CreateTraverse( this.graph )
		
	})
	
	it("should navigate down one", function() {
		
		var group0 = this.traverse.down( this.root )
		
		expect( group0.getIn(['data','name']) ).toBe( "group0" )
		
	})

	it("should navigate down one to a specific index", function() {
		
		var group0 = this.traverse.down( this.root, 0 )
		var group1 = this.traverse.down( this.root, 1 )
		var group2 = this.traverse.down( this.root, 2 )
		
		expect( group0.getIn(['data','name']) ).toBe( "group0" )
		expect( group1.getIn(['data','name']) ).toBe( "group1" )
		expect( group2.getIn(['data','name']) ).toBe( "group2" )
		
	})
	
	it("should navigate up one", function() {
		
		var group0 = this.traverse.down( this.root )
		var root = this.traverse.up( group0 )
		
		expect( root.getIn(['data','name']) ).toBe( "root" )
	})
	
	describe("navigate sibling", function() {
		
		it("should navigate to forwards without a direction parameter", function() {
		
			var group0 = this.traverse.down( this.root )
			var group1 = this.traverse.sibling( group0 )
			var group2 = this.traverse.sibling( group1 )
			var group0b = this.traverse.sibling( group2 )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
	
		it("should navigate forward with a 1 direction", function() {
		
			var group0 = this.traverse.down( this.root )
			var group1 = this.traverse.sibling( group0, 1)
			var group2 = this.traverse.sibling( group1, 1 )
			var group0b = this.traverse.sibling( group2, 1 )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
	
		it("should navigate backward with a -1 direction", function() {
		
			var group0 = this.traverse.down( this.root )
			var group2 = this.traverse.sibling( group0, -1 )
			var group1 = this.traverse.sibling( group2, -1 )
			var group0b = this.traverse.sibling( group1, -1 )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
		
		it("should navigate to a sibling given a function that returns an index", function() {
		
			function findSiblingByName( name ) {
				return function( siblings ) {
					var group = siblings.find(function( sibling ) {
						return sibling.getIn(['data','name']) === name
					})
				
					return siblings.indexOf( group )
				}
			}
		
			var group0 = this.traverse.down( this.root)
			
			var group1 = this.traverse.sibling( group0, findSiblingByName("group1") )
			var group2 = this.traverse.sibling( group0, findSiblingByName("group2") )
			var group3 = this.traverse.sibling( group0, findSiblingByName("group3") )
			var group0b = this.traverse.sibling( group0, findSiblingByName("group0") )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
		
	})
	
	it("should traverse each node", function() {
		
		var memo = ""
		var paths = []
		
		this.traverse.each(function( node, path ) {
			paths.push( path )
			memo += node.getIn(['data','name'])
		})
		
		expect( memo ).toBe( "rootgroup0raster1raster2group1group2" )
		
		expect( paths[0] ).toEqual( [] )
		expect( paths[1] ).toEqual( ['edges', 0] )
		expect( paths[2] ).toEqual( ['edges', 0, 'edges', 0] )
		expect( paths[3] ).toEqual( ['edges', 0, 'edges', 1] )
		expect( paths[4] ).toEqual( ['edges', 1] )
		expect( paths[5] ).toEqual( ['edges', 2] )
		
	})
	
	it("should reduce each node", function() {
		
		var paths = []
		var result = this.traverse.reduce(function( memo, node, path ) {
			paths.push( path )
			return memo + node.getIn(['data','name'])
		}, "")
		
		expect( result ).toBe( "rootgroup0raster1raster2group1group2" )
		
		expect( paths[0] ).toEqual( [] )
		expect( paths[1] ).toEqual( ['edges', 0] )
		expect( paths[2] ).toEqual( ['edges', 0, 'edges', 0] )
		expect( paths[3] ).toEqual( ['edges', 0, 'edges', 1] )
		expect( paths[4] ).toEqual( ['edges', 1] )
		expect( paths[5] ).toEqual( ['edges', 2] )
		
	})
	
	it("should filter nodes", function() {
		
		var paths = []
		
		var nodes = this.traverse.filter(function( node, path ) {

			paths.push( path )
			
			var name = node.getIn( ['data', 'name'] )
			
			if( name === "raster1" || name === "raster2" ) {
				return true
			} else {
				return false
			}
		})
		
		expect( nodes[0].getIn(['data', 'name']) ).toBe( "raster1" )
		expect( nodes[1].getIn(['data', 'name']) ).toBe( "raster2" )
		
		expect( paths[0] ).toEqual( [] )
		expect( paths[1] ).toEqual( ['edges', 0] )
		expect( paths[2] ).toEqual( ['edges', 0, 'edges', 0] )
		expect( paths[3] ).toEqual( ['edges', 0, 'edges', 1] )
		expect( paths[4] ).toEqual( ['edges', 1] )
		expect( paths[5] ).toEqual( ['edges', 2] )
		
	});	
	
})