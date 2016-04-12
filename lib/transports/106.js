"use strict";

var utils  = require( '../utils' );
var colors = require( '../colors' );


function Transport( options )
{
	options = options === undefined ? {} : options;

	this.level = options.level === undefined ? 'silly' : options.level;
}

Transport.prototype.log = function( level, msg, meta, next )
{
	var options = {
		prettyPrint : true,
		colorized   : meta.internal.colors,
		printMeta   : false
	};

	var data = utils.parseLog( level, msg, meta, options );

	var scope = console;
	var logger = console.log;
	if ( data.level === 'error' && console.error )
		logger = console.error;
	else if ( data.level === 'warn' && console.warn )
		logger = console.error;

	var line = colors.browsify( data.internal.line );
	if ( data.meta != null )
		line.push( data.meta );
	if ( data.error != null )
		line.push( data.error );

	logger.apply( scope, line );

	next( );
};

module.exports = Transport;
