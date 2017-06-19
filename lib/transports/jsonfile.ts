"use strict";

import BaseFile     from './basefile'
import { parseLog, ParsedLog } from '../utils'


function filterOptions( options: any ): any
{
	options.json = true;
	return options;
}

export default class Transport extends BaseFile
{
	static available = BaseFile.available;

	constructor( options: any = { } )
	{
		super( filterOptions( options ) );
	}

	customLog( level: string, msg: string, meta: any )
	{
		function print( parsedLog: ParsedLog )
		{
			parsedLog.appId = parsedLog.internal.appId;

			delete parsedLog.internal;
			delete parsedLog.line;

			return JSON.stringify( parsedLog, null, 0 );
		}

		const writeError = ( parsedLog: ParsedLog ) =>
		{
			this.write( print( parsedLog ) );
		}

		return print( parseLog( level, msg, meta, writeError ) );
	}
}
