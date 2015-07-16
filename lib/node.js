var Immutable = require('immutable')
	, _ = require('lodash')

var internals = {
	
	slugToEnding : function( base, slug ) {
		
		if( slug.length >= base.length ) {

			var ending = slug.substr( base.length, slug.length )
			
			if( ending.match(/^[0-9]*$/) ) {
				return Number( ending )
			} else {
				return null;
			}
			
		} else {
			return null;
		}
	},
	
	registerSlug : function( state, key, desiredSlug ) {
		
		var finalSlug
		var slugs = state[key]
		
		var number = _.chain( slugs.toJSON() )
			.filter( slug => slug.substr(0,desiredSlug.length) === desiredSlug )
			.map( slug => internals.slugToEnding( desiredSlug, slug ))
			.filter( ending => ending >= 0 )
			.sortBy( _.identity )
			.last()
			.value()
		
		if( number >= 0 ) {
			finalSlug = [desiredSlug, number+1].join('')
		} else {
			finalSlug = desiredSlug
		}
		
		state[key] = slugs.push( finalSlug )
		
		return finalSlug
	},
	
	createNode : function( typeSlug, data = {}, edges = [] ) {
		
		return Immutable.Map({
			type : typeSlug                      // node slug
		  , edges : Immutable.List( edges )      // the edges of the graph
		  , state : {}                           // a mutable state target, does not ultimately get serialized
		  , data : Immutable.fromJS( data )      // the serializable data unique to the type
		})
		
	},
	
	getStateObj : function( slug, node ) {
		
		var state = node.get('state')
		
		if( !state[slug] ) {
			state[slug] = {}
		}
		
		return state[slug];
	},
	
	registerNodeType : function( state, slug ) {
		
		var slug = internals.registerSlug( state, "nodeSlugs", slug )
		
		return [
			slug,
			_.partial( internals.createNode, slug )
		]
	},
	
	registerStateType : function( state, slug ) {
		
		var slug = internals.registerSlug( state, "nodeSlugs", slug )
		
		return [
			slug,
			_.partial( internals.getStateObj, slug )
		]
	},
}

module.exports = function node() {
	
	var state = {
		nodeSlugs : Immutable.List()
	  , stateSlugs : Immutable.List()
	}
	
	return Object.freeze({
		registerNodeType	: slug => internals.registerNodeType( state, slug )
	  , registerStateType	: slug => internals.registerStateType( state, slug )
	})	
}