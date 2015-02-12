var Immutable = require('Immutable')

module.exports = function createNode( typeSlug, data = {}, edges = [] ) {
	
	return Immutable.Map({
		type : typeSlug                      // node slug
	  , edges : Immutable.List( edges )      // the edges of the graph
	  , state : {}                           // a mutable state target, does not ultimately get serialized
	  , data : Immutable.fromJS( data )      // the serializable data unique to the type
	})
}