module.exports = function json( message, obj ) {
	console.log( message, JSON.stringify( obj, null, "\t" ) );
}