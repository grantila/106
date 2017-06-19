"use strict";

import { timestamp } from './utils'

import Sequence from './sequences/sequence'
import Sequencer from './sequences/sequencer'

export type Levels =
	'disabled' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

const levels = {
	disabled : 0,
	error    : 1,
	warn     : 2,
	info     : 3,
	verbose  : 4,
	debug    : 5,
	silly    : 6,
};

let level: Levels = 'debug';
let colors        = true;
const transports  = [ ];

export function setLevel( newLevel: Levels )
{
	level = newLevel;
}

export { level, colors, Sequence, Sequencer }

function shouldLog( _level: string, highest: string ): boolean
{
	if ( highest === 'disabled' )
		return false;

	if (
		levels.hasOwnProperty( _level ) &&
		levels[ _level ] > levels[ highest ]
	)
		return false;

	return true;
}

export function addTransport( fn, opts )
{
	opts = opts || { };

	transports.push( function( _level, _args: any[] )
	{
		var highestLevel = opts.level || level;

		if ( !shouldLog( _level, highestLevel ) )
			return;

		const args = [ ..._args ];

		var extra = args.pop( );
		var internal = extra.internal;

		var data = {
			level             : _level,
			messages          : args,
			meta              : extra.meta || null,
			error             : internal.error || null,
			prefix            : internal.prefix,
			sequence          : internal.sequence,
			sequenceDirection : internal.sequenceDirection,
			time              : internal.time,
			timestamp         : internal.timestamp
		};

		fn( data );
	} );
}
/*
export interface LogContext
{
	;
}
*/
export interface Logger
{
	( prefix: string ): any;
	Sequence: typeof Sequence;
	Sequencer: typeof Sequencer;
}

export default function logger( backend )
{
	function log( prefix: string )
	{
		const out: any = { };

		function makePrefixWrappedLogger( backend, _level, internalExtra: any = { } )
		{
			return function( )
			{
				if (
					transports.length === 0 &&
					!shouldLog( _level, level )
				)
					// Too high log level, and no other transports
					return;

				const args = [ ].slice.apply( arguments );

				const now = new Date( );

				var internal: any = {
					prefix,
					time              : now,
					timestamp         : timestamp( now ),
					sequence          : null,
					sequenceDirection : null,
					colors,
				};

				for ( var key in internalExtra )
					internal[ key ] = internalExtra[ key ];

				function parseError( err )
				{
					function parseStack( stack )
					{
						if ( !stack )
							return [ ];

						var lines = ( 'string' === typeof stack )
							? stack.split( "\n" )
							: Array.isArray( stack )
								? stack
								: [ ];

						if ( lines[ 0 ] === err.name + ": " + err.message )
						{
							lines.shift( );
						}

						for ( var i = 0; i < lines.length; ++i )
						{
							lines[ i ] = lines[ i ].trim( );
						}

						return lines;
					}
					return {
						name: err.name,
						message: err.message,
						stack: parseStack( err.stack ),
						fileName: err.fileName,
						lineNumber: err.lineNumber
					}
				}

				if (
					args.length > 0 &&
					args[ 0 ] &&
					args[ 0 ] instanceof Sequence
				)
				{
					internal.sequence = args.shift( );

					if (
						args.length > 0 &&
						args[ 0 ] &&
						args[ 0 ] instanceof Sequencer.Direction
					)
						internal.sequenceDirection = args.shift( );
				}

				var hasEnoughArguments = function( )
				{
					function countOccurences( text, needle )
					{
						return text.split( needle ).length - 1;
					}

					if ( args.length === 0 )
						return true;

					if ( typeof args[ 0 ] === 'string' )
					{
						var count = countOccurences( args[ 0 ], '%s' );
						if ( count >= ( args.length - 1 ) )
							return false;
					}

					return true;
				}

				if ( hasEnoughArguments( ) &&
					args.length > 0 && args[ args.length - 1 ] && (
					args[ args.length - 1 ].constructor == Object ||
					args[ args.length - 1 ].constructor == Array
					) )
				{
					args[ args.length - 1 ] = {
						internal : internal,
						meta     : args[ args.length - 1 ]
					};
				}
				else if ( hasEnoughArguments( ) &&
					args.length > 0 && args[ args.length - 1 ] &&
					args[ args.length - 1 ] instanceof Error )
				{
					internal.error = parseError( args[ args.length - 1 ] )
					args[ args.length - 1 ] = {
						internal : internal
					};
				}
				else
				{
					args.push( { internal: internal } );
				}

				transports.forEach( function( transport )
				{
					transport( _level, args );
				} );

				if ( shouldLog( _level, level ) )
					return backend.apply( backend, args );
			}
		}

		out.json = makePrefixWrappedLogger(
			backend.info, 'info', { json: true } );

		for ( var key in backend )
		{
			if (
				backend.hasOwnProperty( key ) &&
				backend[ key ] instanceof Function
			)
			{
				out[ key ] = makePrefixWrappedLogger( backend[ key ], key );
			}
		}

		return out;
	}

	const out: Logger = < Logger >log;
	out.Sequence = Sequence;
	out.Sequencer = Sequencer;

	return out;
};
