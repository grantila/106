import Sequence from './sequences/sequence';
import Sequencer from './sequences/sequencer';
export declare type Levels = 'disabled' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
declare let level: Levels;
declare let colors: boolean;
export declare function setLevel(newLevel: Levels): void;
export { level, colors, Sequence, Sequencer };
export declare function addTransport(fn: any, opts: any): void;
export interface PrefixedLogger {
    [key: string]: (...args: any[]) => void;
}
export interface Logger {
    (prefix: string): PrefixedLogger;
    Sequence: typeof Sequence;
    Sequencer: typeof Sequencer;
}
export default function logger(backend: any): Logger;
