"use strict";

import BaseFile     from './basefile'
import { parseLog, ParsedLog } from '../utils'


export default class Transport extends BaseFile
{
	static available = BaseFile.available;

	constructor( options: any = { } )
	{
		super( options );
	}

	customLog( level: string, msg: string, meta: any )
	{
		const options = { prettyPrint: true, colorized: meta.internal.colors };

		function print( parsedLog: ParsedLog )
		{
			return parsedLog.line;
		}

		const writeError = ( parsedLog: ParsedLog ) =>
		{
			this.write( print( parsedLog ) );
		}

		return print( parseLog( level, msg, meta, writeError, options ) );
	}
}
