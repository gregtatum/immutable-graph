# Immutable Graph

This is my initial thought on an immutable graph structure with history. At this point I need to figure out how to deeply refer to the objects within the graph, and to deeply set objects.

### Intended use case:

http://node.graphics/

### To run:

The example requires the following global npm modules:

    npm install browserify -g
    npm install beefy -g    

To run the example in your browser:

    beefy example.js
    beefy history-example.js