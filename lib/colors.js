"use strict";

var ansiStyles = require( 'ansi-styles' );
var ansi2css   = require( './ansi2css' );

var colors = {
	fg: {
		red    : function( ) {
			return ansiStyles.red.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.red.close;
		},
		green  : function( ) {
			return ansiStyles.green.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.green.close;
		},
		yellow : function( ) {
			return ansiStyles.yellow.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.yellow.close;
		},
		blue   : function( ) {
			return ansiStyles.blue.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.blue.close;
		},
		purple : function( ) {
			return ansiStyles.magenta.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.magenta.close;
		},
		cyan : function( ) {
			return ansiStyles.cyan.open +
				ansiStyles.bold.open +
				arguments[ 0 ] +
				ansiStyles.bold.close +
				ansiStyles.cyan.close;
		},
		white  : function( ) {
			return ansiStyles.white.open +
				arguments[ 0 ] +
				ansiStyles.white.close;
		}
	}
};
colors.fgCycles = [
	colors.fg.yellow,
	colors.fg.green,
	colors.fg.red,
	colors.fg.blue,
	colors.fg.purple,
	colors.fg.cyan
];

var prefixColorMap = {};
var prefixCycle = 0;

function levelColor( level )
{
	var levelMap = {
		silly   : colors.fg.white,
		debug   : colors.fg.purple,
		verbose : colors.fg.blue,
		info    : colors.fg.green,
		warn    : colors.fg.yellow,
		error   : colors.fg.red
	};

	if ( levelMap.hasOwnProperty( level ) )
		return levelMap[ level ];
	else
		return colors.fg.white;
}

function prefixColor( prefix )
{
	if ( !prefixColorMap.hasOwnProperty( prefix ) )
	{
		var colorIndex = prefixCycle++ % colors.fgCycles.length;
		prefixColorMap[ prefix ] = colorIndex;
	}

	return colors.fgCycles[ prefixColorMap[ prefix ] ];
}


colors.getNewColorCycle = function( )
{
	var index = -1;

	return function( )
	{
		++index;
		if ( index >= colors.fgCycles.length )
			index = 0;
		return colors.fgCycles[ index ];
	}
}

colors.colorizeLevel = function( level )
{
	return levelColor( level )( level );
}

colors.colorizePrefix = function( prefix )
{
	return prefixColor( prefix )( prefix );
}

colors.browsify = ansi2css.textToParts;

module.exports = colors;
