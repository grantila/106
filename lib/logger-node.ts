'use strict';

import * as colors from './colors'

import * as winston       from 'winston'
import ConsoleTransports  from './transports/console'
import TextFileTransports from './transports/textfile'
import JsonFileTransports from './transports/jsonfile'

export default function createLogger( )
{
	const transports = [ ];

	const consoleLogLevel =
		process.env.CONSOLE_LOG_LEVEL
		? process.env.CONSOLE_LOG_LEVEL
		: 'debug';

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
