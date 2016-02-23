"use strict";
var util    = require( 'util' );

var BaseFile = require( './basefile' );
var utils    = require( '../utils' );


function Transport( options )
{
	options = options === undefined ? {} : options;

	options.json = true;

	BaseFile.apply( this, [ ].slice.apply( arguments ) );
}

util.inherits( Transport, BaseFile );

Transport.available = BaseFile.available;

Transport.prototype.customLog = function( level, msg, meta )
{
	var data = utils.parseLog( level, msg, meta );

	data.appId = data.internal.appId;

	delete data.internal;

	return JSON.stringify( data, null, 0 );
}

module.exports = Transport;
