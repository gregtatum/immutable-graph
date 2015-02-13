var Cursor = require('immutable/contrib/cursor')
  , CreateGraph = require('../lib/graph')
  , CreateNode = require('../lib/node')
  , WrapNav = require('../lib/wrapNavigateGraph')
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

		this.nav = WrapNav( this.graph )
		
	})
	
	it("should navigate down one", function() {
		
		var group0 = this.nav.down( this.root )
		
		expect( group0.getIn(['data','name']) ).toBe( "group0" )
		
	})

	it("should navigate down one to a specific index", function() {
		
		var group0 = this.nav.down( this.root, 0 )
		var group1 = this.nav.down( this.root, 1 )
		var group2 = this.nav.down( this.root, 2 )
		
		expect( group0.getIn(['data','name']) ).toBe( "group0" )
		expect( group1.getIn(['data','name']) ).toBe( "group1" )
		expect( group2.getIn(['data','name']) ).toBe( "group2" )
		
	})
	
	it("should navigate up one", function() {
		
		var group0 = this.nav.down( this.root )
		var root = this.nav.up( group0 )
		
		expect( root.getIn(['data','name']) ).toBe( "root" )
	})
	
	describe("navigate sibling", function() {
		
		it("should navigate to forwards without a direction parameter", function() {
		
			var group0 = this.nav.down( this.root )
			var group1 = this.nav.sibling( group0 )
			var group2 = this.nav.sibling( group1 )
			var group0b = this.nav.sibling( group2 )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
	
		it("should navigate forward with a 1 direction", function() {
		
			var group0 = this.nav.down( this.root )
			var group1 = this.nav.sibling( group0, 1)
			var group2 = this.nav.sibling( group1, 1 )
			var group0b = this.nav.sibling( group2, 1 )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
	
		it("should navigate backward with a -1 direction", function() {
		
			var group0 = this.nav.down( this.root )
			var group2 = this.nav.sibling( group0, -1 )
			var group1 = this.nav.sibling( group2, -1 )
			var group0b = this.nav.sibling( group1, -1 )
		
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
		
			var group0 = this.nav.down( this.root)
			
			var group1 = this.nav.sibling( group0, findSiblingByName("group1") )
			var group2 = this.nav.sibling( group0, findSiblingByName("group2") )
			var group3 = this.nav.sibling( group0, findSiblingByName("group3") )
			var group0b = this.nav.sibling( group0, findSiblingByName("group0") )
		
			expect( group0.getIn(['data','name']) ).toBe( "group0" )
			expect( group1.getIn(['data','name']) ).toBe( "group1" )
			expect( group2.getIn(['data','name']) ).toBe( "group2" )
			expect( group0b.getIn(['data','name']) ).toBe( "group0" )
		})
		
	})
	
})