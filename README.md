# Immutable Graph (experimental)

Experimentations with an immutable tree graph structure with history. Uses http://facebook.github.io/immutable-js/

## Intended use case:

A DOM like structure for drawing raster and vector graphics. The immutability of the graph is to support history, while the mutable state properties are for real time display and interaction.

## Usage

    var CreateGraph = require('immutable-graph')
      , NodeRegistry = require('immutable-graph/lib/node')()
    
    
    var [rasterSlug, createRoot]		= NodeRegistry.registerNodeType("root")
    var [groupSlug, createGroup]		= NodeRegistry.registerNodeType("group")
    var [rasterSlug, createRaster]		= NodeRegistry.registerNodeType("raster")
    var [vectorSlug, createVector]		= NodeRegistry.registerNodeType("vector")
    
	var graph = CreateGraph(
        
		createRoot({name: "my root"}, [
			createGroup({name: "group 0"}, [
				createRaster({name: "raster1"})
			  , createRaster({name: "raster2"})
			])
		  , createGroup({name: "group 1"})
		])
	)
    
	var group0 = ['edges',0]
	var group1 = ['edges',1]
    
	graph.modify.move( group1, group0 )
    
    graph.undo()

More advanced examples are located in the `/examples` folder and can be automagically loaded into a browser by running `npm start`.

## API:

Anything in `<Brackets>` is the type of the object. Anything with `index = 0` is the default value of a parameter.

### `graph.history` `<Immutable.List>`

A list of every root node.

### `graph.root()` returns `<Immutable.Map>`

Get the current root.

### `graph.update( newRoot<Immutable.Map> )`

Update the graph with a new root.

### `graph.update( function( currentRoot<Immutable.Map> ) {} )`

Update a root with a callback through [Immutable's `withMutation`](http://facebook.github.io/immutable-js/docs/#/Map/withMutations)

### `graph.undo( steps<integer> )`

Point the current root to one in the past. Once the root is updated any roots in the future will be removed.

### `graph.redo( steps<integer> )`

Sugar function from undo.

### `graph.emitter` `<EventEmitter>`

An emitter with the following events:
 * update - Anytime the root changes
 * undo - Anytime undo or redo is called

### `graph.traverse` `<Object>`

A collection of utilities to traverse a graph. Can be used as bare functions with `var traverse = require('immutable-graph/lib/traverse')`.

#### `graph.traverse.down( root<Immutable.Map>, path <Array>, childIndex = 0 )`

Traverse a node path down one, returns a path array.

#### `graph.traverse.downAll( root<Immutable.Map>, path <Array> )`

Fetch all edge nodes from the path as an Immutable.List

#### `graph.traverse.up( root<Immutable.Map>, path <Array> )`

Traverse a node path up one, returns a path array.

#### `graph.traverse.sibling( root<Immutable.Map>, path <Array>, directionOrIndexCallback )`

Fetch a sibling path array.

#### `graph.traverse.each( root<Immutable.Map>, callback, path = [] )`

Go depth first through each node in the graph. Callback gets passed:

    callback( path<Array>, node<Immutable.Map>, root<Immutable.Map> )

#### `graph.traverse.reduce( root<Immutable.Map>, callback, memo, path = [] )`

Depth first reduce each node in the graph. Callback gets passed:

    callback( memo, node<Immutable.Map>, path<Array> )

#### `graph.traverse.filter( root<Immutable.Map>, callback, path = [] )`

Depth first filter each node in the graph, returns an array of nodes. Callback gets passed:

    callback( node<Immutable.Map>, path<Array> )


### `graph.modify`

A collection of utilities to easily modify the current graph structure. Can be used as bare functions with `var modify =  require('immutable-graph/lib/modify')`. Each function then has the graph as the first parameter. Each function adds to the history of the graph. Paths are assumed to point to nodes, not to edges.

#### `graph.modify.move( nodePath<Array>, targetPath<Array> )`

#### `graph.modify.add( targetPath<Array>, node<Immutable.Map> )`

#### `graph.modify.remove( targetPath<Array>, nodeOrIndex<Immutable.Map, Integer> )`


## Nodes

### Data structure
    node = Immutable.Map({
        "name" : "node-type-slug",
        "edges" : Immutable.List(), // Contains children nodes
        "data" : Immutable.Map(),
        "state" : {},
    })

The state property is mutable and should not be serialized.

### Paths

    var root = []
    var someNode = ['edges', 4]
    var childInSomeNode = ['edges', 4, 'edges', 0]

Nodes are referenced by paths in the tree. They can be used to get the actual node by the following:

    graph.root().getIn( root )
    graph.root().getIn( someNode )
    graph.root().getIn( childInSomeNode )

### Node Registry

There is a node registry to ensure there are no conflicts on the slugs for different types of nodes. The idea here is to enable multiple independent developers to create functionality without conflicting on naming conventions. If slugs are identical, the number ending is added and incremented e.g. registering three root nodes would make the slugs become "root", "root1", "root2".

### .registerNodeType( slug )

    var CreateSlugRegistry = require('immutable-graph/lib/node')
    var registry = CreateSlugRegistry()
    
    var [rootSlug, createRoot] = registry.registerNodeType("root")
    var [rasterSlug, createRaster] = registry.registerNodeType("raster")
    
    var root = createRoot( {data:"foobar"}, [
        createRaster( {image: imageData} )
    ])

The create node function takes the following parameters

    CreateNode( data, children )

### .registerStateType( slug )

    var [forceSlug, getForce] = Node.registerStateType("force")
    
    var mutableForceObj = getForce( someNode )    
    mutableForceObj.x = 5
    
    var someNodeState = someNode.get("state")
    someNodeState[forceSlug] === mutableForceObj

See `/examples/node-example.js` for more in-depth use cases.