"use strict";

import Sequence from './sequence'

import { getNewColorCycle } from '../colors'

let tagColorCycle = getNewColorCycle( );
const colorizerByTag = { };

export class Direction
{
	private _symbol: string;
	private _direction: string;

	constructor( symbol: string, direction: string )
	{
		this._symbol = symbol;
		this._direction = direction;
	}

	getSymbol( )
	{
		return this._symbol;
	}

	getDirection( )
	{
		return this._direction;
	}
}

const rightArrow  = "\u21D2";
const leftArrow   = "\u21D0";
const brokenArrow = "\u21CD";


export default class Sequencer
{
	static Direction = Direction;
	static IN        = new Direction( rightArrow,  'IN' );
	static OUT       = new Direction( leftArrow,   'OUT' );
	static OUTERR    = new Direction( brokenArrow, 'OUTERR' );

	private _index: number;
	private _timeout: number;
	private _tag: string;
	private _colorCycle: ( ) => ( text: string ) => string;

	constructor( tag, opts )
	{
		this._index = 0;
		this._colorCycle = getNewColorCycle( );
		this._tag = tag || '';

		opts = opts === undefined ? { } : opts;

		this._timeout = !opts.timeout ? null : opts.timeout;

		if ( !colorizerByTag.hasOwnProperty( tag ) )
			colorizerByTag[ tag ] = tagColorCycle( );
	}

	next( opts?: any ): Sequence
	{
		opts = opts === undefined ? { } : opts;

		opts.timeout = !opts.timeout ? this._timeout : opts.timeout;

		return new Sequence(
			this._tag,
			++this._index,
			colorizerByTag[ this._tag ],
			this._colorCycle( ),
			opts
		);
	}
}
