"use strict";
var winston = require( 'winston' );
var util    = require( 'util' );

var utils   = require( '../utils' );


function Transport( options )
{
	options = options === undefined ? {} : options;

	this.level = options.level;

	winston.transports.Console.apply( this, [ ].slice.apply( arguments ) );
}

util.inherits( Transport, winston.transports.Console );

Transport.prototype.log = function( level, msg, meta, next )
{
	var options = { prettyPrint: true, colorized: true };

	var data = utils.parseLog( level, msg, meta, options );

	var logger = ( data.level === 'error' ) ? console.error : console.log;

	logger( data.internal.line );

	next( );
};

module.exports = Transport;
