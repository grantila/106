"use strict";

var utils = require( './utils' );

var levels = {
	error   : 1,
	warn    : 2,
	info    : 3,
	verbose : 4,
	debug   : 5,
	silly   : 6
};

module.exports = function( logger )
{
	var sequencing = require( './sequences' )( log );
	var Sequence  = sequencing.Sequence;
	var Sequencer = sequencing.Sequencer;

	function log( prefix )
	{
		var out = { };

		var makePrefixWrappedLogger = function( logger, level )
		{
			return function( )
			{
				if (
					levels.hasOwnProperty( level )
					&& levels[ level ] > levels[ exporter.level ]
				)
					return;

				var args = [ ].slice.apply( arguments );

				var now = new Date( );

				var internal = {
					prefix            : prefix,
					time              : now,
					timestamp         : utils.timestamp( now ),
					sequence          : null,
					sequenceDirection : null
				};

				function parseError( err )
				{
					function parseStack( stack )
					{
						if ( !stack )
							return [];

						var lines = stack.split( "\n" );

						if ( lines[ 0 ] === err.name + ": " + err.message )
						{
							lines.shift( );
						}

						for ( var i = 0; i < lines.length; ++i )
						{
							var line = lines[ i ].trim( );
							if ( line.substr( 0, 3 ) === 'at ' )
								line = line.substr( 3 );
							lines[ i ] = line;
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

				if ( args.length > 0 && args[ 0 ] && args[ 0 ] instanceof Sequence )
				{
					internal.sequence = args.shift( );

					if ( args.length > 0 && args[ 0 ] && args[ 0 ] instanceof Sequencer.Direction )
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

				return logger.apply( logger, args );
			}
		}

		for ( var key in logger )
		{
			if ( logger.hasOwnProperty( key ) && logger[key] instanceof Function )
			{
				out[key] = makePrefixWrappedLogger( logger[key], key );
			}
		}

		return out;
	}

	var exporter = log;
	exporter.level     = 'debug';
	exporter.Sequencer = Sequencer;
	exporter.Sequence  = Sequence;

	return exporter;
};
