export interface ISequence {
    getIndex(): number;
    getTag(): string;
    colorize(text: string): string;
    getPrefix(colorized?: boolean): string;
    getSuffix(colorized?: boolean): string;
    begin(onTimeout: Function): void;
    end(): void;
}
export declare class NopSequence implements ISequence {
    constructor();
    getIndex(): any;
    getTag(): any;
    colorize(text: string): string;
    getPrefix(): string;
    getSuffix(): string;
    begin(onTimeout: Function): void;
    end(): void;
}
export default class Sequence implements ISequence {
    static nop: NopSequence;
    private _index;
    private _tag;
    private _sequenceColorizer;
    private _indexColorizer;
    private _startTime;
    private _timeout;
    private _begun;
    private _finished;
    private _timer;
    constructor(tag: string, index: number, sequenceColorizer: any, indexColorizer: any, opts: any);
    getIndex(): number;
    getTag(): string;
    colorize(text: string): string;
    getPrefix(colorized?: boolean): string;
    getSuffix(colorized?: boolean): string;
    begin(onTimeout: Function): void;
    end(): void;
}
