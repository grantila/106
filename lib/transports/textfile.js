"use strict";
var util    = require( 'util' );

var BaseFile = require( './basefile' );
var utils    = require( '../utils' );


function Transport( options )
{
	options = options === undefined ? {} : options;

	BaseFile.apply( this, [ ].slice.apply( arguments ) );
}

util.inherits( Transport, BaseFile );

Transport.available = BaseFile.available;

Transport.prototype.customLog = function( level, msg, meta )
{
	var options = { prettyPrint: true, colorized: meta.internal.colors };

	var data = utils.parseLog( level, msg, meta, options );

	return data.internal.line;
}

module.exports = Transport;
