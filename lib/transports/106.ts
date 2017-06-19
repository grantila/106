"use strict";

import { parseLog, ParsedLog } from '../utils'
import { browsify } from '../colors'


export default class Transport
{
	private level: string;

	constructor( options? )
	{
		options = options === undefined ? {} : options;

		this.level = options.level === undefined ? 'silly' : options.level;
	}

	log( level: string, msg: string, meta: any, next: Function )
	{
		const options = {
			prettyPrint : true,
			colorized   : meta.internal.colors,
			printMeta   : false
		};

		function print( parsedLog: ParsedLog )
		{
			const scope = console;
			const logger =
				( parsedLog.level === 'error' && console.error )
				? console.error
				: ( parsedLog.level === 'warn' && console.warn )
				? console.warn
				: console.log;

			const line = browsify( parsedLog.line );
			if ( parsedLog.meta != null )
				line.push( parsedLog.meta );
			if ( parsedLog.error != null )
				line.push( parsedLog.error );

			logger.apply( scope, line );
		}

		print( parseLog( level, msg, meta, print, options ) );

		next( );
	}
}
