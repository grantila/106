"use strict";

module.exports = function( logger )
{
	function Sequence( tag, index, sequenceColorizer, indexColorizer, opts )
	{
		this._index = index;
		this._tag = tag;
		this._sequenceColorizer = sequenceColorizer;
		this._indexColorizer = indexColorizer;
		this._startTime = ( new Date( ) ).getTime( );

		this._timeout = opts.timeout;
		this._begun = false;
		this._finished = false;
		this._timer = null;
	}

	Sequence.nop = new Sequence( null, null, null, null, { timeout: null } );
	Sequence.nop.getIndex  = function( ) { return null; },
	Sequence.nop.getTag    = function( ) { return null; },
	Sequence.nop.colorize  = function( text ) { return text; },
	Sequence.nop.getPrefix = function( ) { return ''; },
	Sequence.nop.getSuffix = function( ) { return ''; },
	Sequence.nop.begin     = function( ) { },
	Sequence.nop.end       = function( ) { },

	Sequence.prototype.getIndex = function( )
	{
		return this._index;
	}

	Sequence.prototype.getTag = function( )
	{
		return this._tag;
	}

	Sequence.prototype.colorize = function( text )
	{
		return this._indexColorizer( text );
	}

	Sequence.prototype.getPrefix = function( colorized )
	{
		colorized = colorized === undefined ? false : colorized;

		if ( !colorized )
			return "[seq:" + ( this._tag ? this._tag + ":" : '' ) + this._index + "]";

		return this._indexColorizer( "[seq:" ) +
			this._sequenceColorizer( this._tag ) + 
			this._indexColorizer( ( this._tag ? ':' : '' ) + this._index + "]" );
	}

	var getDiffParts = function( diff )
	{
		var parts = {
			days    : 0,
			hours   : 0,
			minutes : 0,
			seconds : 0,
			millis  : 0
		};

		// > 1d
		if ( diff > 60000 * 60 * 24 )
		{
			parts.days = Math.floor( diff / ( 60000 * 60 * 24 ) );
			diff -= parts.days * 60000 * 60 * 24;
		}

		// > 1h
		if ( diff > 60000 * 60 )
		{
			parts.hours = Math.floor( diff / ( 60000 * 60 ) );
			diff -= parts.hours * 60000 * 60;
		}

		// > 1m
		if ( diff > 60000 )
		{
			parts.minutes = Math.floor( diff / ( 60000 ) );
			diff -= parts.minutes * 60000;
		}

		// > 1m
		if ( diff > 1000 )
		{
			parts.seconds = Math.floor( diff / ( 1000 ) );
			diff -= parts.seconds * 1000;
		}

		parts.millis = diff;

		return parts;
	}

	var formatTimeDiff = function( diff )
	{
		var parts = getDiffParts( diff );

		if ( parts.days > 0 )
		{
			if ( parts.hours > 0 )
				return "" + parts.days + "d" + parts.hours + "h";
			return "" + parts.days + "d";
		}

		else if ( parts.hours > 0 )
		{
			if ( parts.minutes > 0 )
				return "" + parts.hours + "h" + parts.minutes + "m";
			return "" + parts.hours + "h";
		}

		else if ( parts.minutes > 0 )
		{
			if ( parts.seconds > 0 )
				return "" + parts.minutes + "m" + parts.seconds + "s";
			return "" + parts.minutes + "m";
		}

		else if ( parts.seconds > 0 )
		{
			var millis = parts.millis + parts.seconds * 1000;
			return "" + ( millis / 1000 ).toFixed( 3 ) + "s";
		}

		return "" + parts.millis + "ms";
	}

	Sequence.prototype.getSuffix = function( colorized )
	{
		colorized = colorized === undefined ? false : colorized;

		var diff = ( new Date( ) ).getTime( ) - this._startTime;
		diff = formatTimeDiff( diff );

		if ( !colorized )
			return diff;

		return this._indexColorizer( diff );
	}

	Sequence.prototype.begin = function( internal )
	{
		if ( this._begun )
			return;

		this._begun = true;

		if ( this._timeout )
		{
			// Reset timer (because this makes kind of sense)
			this._startTime = ( new Date( ) ).getTime( );

			var self = this;

			setTimeout( function( )
			{
				if ( !self._finished )
				{
					var log = logger( internal.prefix );
					log.warn( self, "{ sequence timed out }" );
				}
			}, this._timeout );
		}
	}

	Sequence.prototype.end = function( )
	{
		if ( this._finished )
			return;

		this._finished = true;
		if ( this._timer ) {
			clearTimeout( this._timer );
			this._timer = null;
		}
	}

	return Sequence;
};
