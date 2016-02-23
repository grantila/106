"use strict";

var colors = require( '../colors' );

var tagColorCycle = colors.getNewColorCycle( );
var colorizerByTag = { };

module.exports = function( Sequence )
{
	function Sequencer( tag, opts )
	{
		var index = 0;
		var colorCycle = colors.getNewColorCycle( );
		tag = tag || '';

		opts = opts === undefined ? { } : opts;

		var timeout = !opts.timeout ? null : opts.timeout;

		if ( !colorizerByTag.hasOwnProperty( tag ) )
			colorizerByTag[ tag ] = tagColorCycle( );

		this.next = function( opts )
		{
			opts = opts === undefined ? { } : opts;

			opts.timeout = !opts.timeout ? timeout : opts.timeout;

			return new Sequence(
				tag, ++index, colorizerByTag[ tag ], colorCycle( ), opts );
		}
	}

	function Direction( symbol, direction )
	{
		this._symbol = symbol;
		this._direction = direction;
	}

	Direction.prototype.getSymbol = function( )
	{
		return this._symbol;
	}

	Direction.prototype.getDirection = function( )
	{
		return this._direction;
	}

	var rightArrow  = "\u21D2";
	var leftArrow   = "\u21D0";
	var brokenArrow = "\u21CD";

	Sequencer.Direction = Direction;
	Sequencer.IN     = new Direction( rightArrow,  'IN' );
	Sequencer.OUT    = new Direction( leftArrow,   'OUT' );
	Sequencer.OUTERR = new Direction( brokenArrow, 'OUTERR' );

	return Sequencer;
}
