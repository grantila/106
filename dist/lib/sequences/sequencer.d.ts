import Sequence from './sequence';
export declare class Direction {
    private _symbol;
    private _direction;
    constructor(symbol: string, direction: string);
    getSymbol(): string;
    getDirection(): string;
}
export default class Sequencer {
    static Direction: typeof Direction;
    static IN: Direction;
    static OUT: Direction;
    static OUTERR: Direction;
    private _index;
    private _timeout;
    private _tag;
    private _colorCycle;
    constructor(tag: any, opts: any);
    next(opts?: any): Sequence;
}
