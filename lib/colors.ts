"use strict";

import * as ansiStyles from 'ansi-styles'

import * as ansi2css from './ansi2css'


export type Colorizer = ( text: string ) => string;

export const fg = {
	red    : ( text: string ): string =>
		ansiStyles.red.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.red.close
	,
	green  : ( text: string ): string =>
		ansiStyles.green.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.green.close
	,
	yellow : ( text: string ): string =>
		ansiStyles.yellow.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.yellow.close
	,
	blue   : ( text: string ): string =>
		ansiStyles.blue.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.blue.close
	,
	purple : ( text: string ): string =>
		ansiStyles.magenta.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.magenta.close
	,
	cyan : ( text: string ): string =>
		ansiStyles.cyan.open +
			ansiStyles.bold.open +
			text +
			ansiStyles.bold.close +
			ansiStyles.cyan.close
	,
	white  : ( text: string ): string =>
		ansiStyles.white.open +
			text +
			ansiStyles.white.close
	,
};

export const fgCycles = [
	fg.yellow,
	fg.green,
	fg.red,
	fg.blue,
	fg.purple,
	fg.cyan,
];

const prefixColorMap = { };
let prefixCycle = 0;

const levelMap = {
	silly   : fg.white,
	debug   : fg.purple,
	verbose : fg.blue,
	info    : fg.green,
	warn    : fg.yellow,
	error   : fg.red,
};

function levelColor( level: string ): Colorizer
{
	if ( levelMap.hasOwnProperty( level ) )
		return levelMap[ level ];
	else
		return fg.white;
}

function prefixColor( prefix: string ): Colorizer
{
	if ( !prefixColorMap.hasOwnProperty( prefix ) )
	{
		var colorIndex = prefixCycle++ % fgCycles.length;
		prefixColorMap[ prefix ] = colorIndex;
	}

	return fgCycles[ prefixColorMap[ prefix ] ];
}

export function getNewColorCycle( ): ( ) => Colorizer
{
	let index = -1;

	return function( )
	{
		++index;
		if ( index >= fgCycles.length )
			index = 0;
		return fgCycles[ index ];
	}
}

export function colorizeLevel( level: string ): string
{
	return levelColor( level )( level );
}

export function colorizePrefix( prefix: string ): string
{
	return prefixColor( prefix )( prefix );
}

export const browsify = ansi2css.textToParts;
