"use strict";

import * as winston from 'winston'

import { parseLog, ParsedLog } from '../utils'


export default class Console extends winston.transports.Console
{
	private level: string;

	constructor( options?: any, ...args: any[] )
	{
		super( options, ...args );

		options = options === undefined ? { } : options;

		this.level = options.level;
	}

	log( level: string, msg: string, meta: any, next: Function )
	{
		if ( meta.internal.json )
			// Don't print pure-json logs to the console
			return next( );

		const options = { prettyPrint: true, colorized: meta.internal.colors };

		function print( parsedLog: ParsedLog )
		{
			const logger =
				( parsedLog.level === 'error' )
				? console.error
				: console.log;

			logger.call( console, parsedLog.line );
		}

		print( parseLog( level, msg, meta, print, options ) );

		next( );
	}
}
