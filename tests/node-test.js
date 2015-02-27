var CreateNodeManager = require('../lib/node')
  , test = require('tape')
  , Immutable = require('Immutable')


test("node", function(t) {
	
	t.test("- registerNodeType: returns the given slug", function(t) {
		t.plan(1)
		
		var node = CreateNodeManager();
		var result = node.registerNodeType("root")
		
		t.equal(result[0], "root")
	})
	
	t.test("- registerNodeType: increments the slug on a duplicate", function(t) {
		t.plan(6)
		
		var node = CreateNodeManager();
		var results = [];

		for( var i=0; i < 22; i++ ) {
			results.push( node.registerNodeType("root") )
		}
		
		t.equal(results[0][0], "root")
		t.equal(results[1][0], "root1")
		t.equal(results[2][0], "root2")
		
		t.equal(results[9][0], "root9")
		t.equal(results[10][0], "root10")

		t.equal(results[21][0], "root21")

	})
	
	t.test("- registerStateType: returns the given slug", function(t) {
		t.plan(1)
		
		var node = CreateNodeManager();
		var result = node.registerStateType("force")
		
		t.equal(result[0], "force")
	})
	
	t.test("- registerStateType: increments the slug on a duplicate", function(t) {
		t.plan(6)
		
		var node = CreateNodeManager();
		var results = [];

		for( var i=0; i < 22; i++ ) {
			results.push( node.registerStateType("force") )
		}
		
		t.equal(results[0][0], "force")
		t.equal(results[1][0], "force1")
		t.equal(results[2][0], "force2")
		
		t.equal(results[9][0], "force9")
		t.equal(results[10][0], "force10")

		t.equal(results[21][0], "force21")

	})
	
	t.test("- creates a node creator", function(t) {
		t.plan(1)
		
		var node = CreateNodeManager();
		var result = node.registerNodeType("root")
		
		t.equal(typeof result[1], "function")
		
	})
	
	t.test("- node creator makes a properly formatted node", function(t) {
		t.plan(5)
		
		var node = CreateNodeManager();
		var result = node.registerNodeType("root")
		var createRoot = result[1];
		
		var root = createRoot()
		
		t.isEqual( root instanceof Immutable.Map, true )
		
		t.isEquivalent(root.toJSON(), {
			type: "root",
			edges: [],
			state: {},
			data: {}
		})
		
		var edges = root.get('edges')
		var state = root.get('state')
		var data = root.get('data')
		
		t.isEqual( edges instanceof Immutable.List, true )
		t.isEqual( state instanceof Object, true )
		t.isEqual( data instanceof Immutable.Map, true )
		
	})
	
	t.test("- node creator can set data to the node", function(t) {
		t.plan(1)
		
		var node = CreateNodeManager();
		var result = node.registerNodeType("root")
		var createRoot = result[1];
		
		var root = createRoot({foo:"bar"})
		
		t.isEquivalent(root.toJSON(), {
			type: "root",
			edges: [],
			state: {},
			data: {foo:"bar"}
		})
		
	})
	
	t.test("- node creator can create children", function(t) {
		t.plan(1)
		
		var node = CreateNodeManager();
		var result = node.registerNodeType("root")
		var createRoot = result[1];
		
		var root = createRoot( {}, [ createRoot() ] )
		
		t.isEquivalent(root.toJSON(), {
			type: "root",
			edges: [
				{
					type: "root",
					edges: [],
					state: {},
					data: {}
				}
			],
			state: {},
			data: {}
		})
		
	})
	
	t.test("- creates a state accessor", function(t) {
		t.plan(3);
		
		var node = CreateNodeManager();
		
		var [forceSlug, getForce] = node.registerStateType("force")
		var [rootSlug, createRoot] = node.registerNodeType("root")

		var root = createRoot()
		
		t.isEquivalent( root.get('state'), {} )
		
		var force = getForce( root )

		t.equals( root.get('state')[forceSlug], force )
		
		var secondForceAccess = getForce( root )
		
		t.equals( force, secondForceAccess )
	})
	
	
	
});