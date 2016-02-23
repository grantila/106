"use strict";
var winston = require( 'winston' );
var util    = require( 'util' );
var path    = require( 'path' );
var fs      = require( 'fs' );

var utils   = require( '../utils' );


function Transport( options )
{
	options = options === undefined ? {} : options;
	options.json = options.json === undefined ? false : options.json;

	this.level  = options.level;
	this.json   = options.json;
	this.stream = null;

	this.baseFilename = this.getBaseFilename( );
	options.filename = this.getFilename( );

	winston.transports.File.call( this, options );

	this.reopen( this.getFilename( ) );
}

Transport.available = function( )
{
	return (
		typeof utils.logRoot( ) === 'string' &&
		typeof utils.appId( ) === 'string' &&
		utils.appId( ).length > 0
	);
}

util.inherits( Transport, winston.transports.File );

Transport.prototype.getBaseFilename = function( )
{
	var base = utils.appId( );

	if ( this.json )
	{
		base += "-json";
	}
	return base;
}

Transport.prototype.getFilename = function( )
{
	var date = (new Date( )).toJSON( ).replace( /T.*/, '' );
	var filename = this.getBaseFilename( ) + "-" + date + '.log';
	return path.join( utils.logRoot( ), filename );
}

Transport.prototype.reopen = function( filename )
{
	this.filename = filename;

	if ( this.stream )
	{
		this.stream.close( );
	}

	this.stream = fs.createWriteStream( this.filename, { flags: 'a', encoding: 'utf8' } );
}

Transport.prototype.customLog = function( level, msg, meta )
{
	return msg + " " + meta;
}

Transport.prototype._log = function( level, msg, meta, next )
{
	var filename = this.getFilename( );
	if ( filename !== this.filename )
	{
		this.reopen( filename );
	}

	var data = this.customLog( level, msg, meta );

	if ( data.length > 0 && data.charAt( data.length - 1 ) != "\n" )
		data += "\n";

	this.stream.write( data );

	next( );
}

Transport.prototype.log = function( level, msg, meta, next )
{
	setImmediate( this._log.bind( this, level, msg, meta, next ) );
};

module.exports = Transport;
