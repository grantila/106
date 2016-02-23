'use strict';

var colors = require( './colors' );

var winston            = require( 'winston' );
var ConsoleTransports  = require( './transports/console' );
var TextFileTransports = require( './transports/textfile' );
var JsonFileTransports = require( './transports/jsonfile' );

module.exports = function createLogger( )
{
	var transports = [ ];

	var consoleLogLevel = 'debug';
	if ( process.env.CONSOLE_LOG_LEVEL )
		consoleLogLevel = process.env.CONSOLE_LOG_LEVEL;

	transports.push( new ConsoleTransports( { level: consoleLogLevel } ) );

	if ( !TextFileTransports.available( ) )
		console.log( colors.fg.purple(
			"<log> File transport disabled. Needs LOG_ROOT and APP_ID " +
			"environment variables." ) );

	if ( TextFileTransports.available( ) )
		transports.push( new TextFileTransports(
			{ name: 'file.text', level: 'debug' } ) );

	if ( JsonFileTransports.available( ) )
		transports.push( new JsonFileTransports(
			{ name: 'file.json', level: 'verbose' } ) );

	return new ( winston.Logger )( { transports: transports } );
}
