"use strict";

import * as winston from 'winston'

import * as path from 'path'
import * as fs   from 'fs'

import { appId, logRoot } from '../utils'


export interface BaseFileOptions
{
	level: string;
	json?: boolean;
}

function getBaseFilename( json: boolean ): string
{
	const base = appId( );
	return json ? ( base + '-json' ) : base;
}

function getFilename( json: boolean ): string
{
	const date = ( new Date( ) ).toJSON( ).replace( /T.*/, '' );
	const filename = getBaseFilename( json ) + "-" + date + '.log';
	return path.join( logRoot( ), filename );
}

function filterOptions( options: any = { } )
{
	options.json = options.json === undefined ? false : options.json;

	options.filename = getFilename( options.json );

	return options;
}

export default class BaseFile extends winston.transports.File
{
	static available( )
	{
		return (
			typeof logRoot( ) === 'string' &&
			typeof appId( ) === 'string' &&
			appId( ).length > 0
		);
	}

	private level: string;
	private json: boolean;
	private stream: fs.WriteStream;
	private baseFilename: string;
	private filename: string;

	constructor( options )
	{
		super( filterOptions( options ) );

		options = filterOptions( options );

		this.level  = options.level;
		this.json   = options.json;
		this.stream = null;
		this.baseFilename = this.getBaseFilename( );

		this.reopen( this.getFilename( ) );
	}

	private getBaseFilename( )
	{
		return getBaseFilename( this.json );
	}

	private getFilename( )
	{
		return getFilename( this.json );
	}

	private reopen( filename: string ): void
	{
		this.filename = filename;

		if ( this.stream )
			this.stream.close( );

		this.stream = fs.createWriteStream(
			this.filename,
			{ flags: 'a', encoding: 'utf8' }
		);
	}

	protected customLog( level: string, msg: string, meta: any )
	{
		return msg + " " + meta;
	}

	protected write( line: string ): void
	{
		this.stream.write( line );
	}

	private _log( level, msg, meta: any, next )
	{
		const filename = this.getFilename( );
		if ( filename !== this.filename )
			this.reopen( filename );

		var data = this.customLog( level, msg, meta );

		if ( data.length > 0 && data.charAt( data.length - 1 ) != "\n" )
			data += "\n";

		this.write( data );

		next( );
	}

	log( level: string, msg: string, meta: any, next: Function )
	{
		setImmediate( this._log.bind( this, level, msg, meta, next ) );
	}
}
