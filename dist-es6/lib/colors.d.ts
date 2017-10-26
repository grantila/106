import * as ansi2css from './ansi2css/index';
export declare type Colorizer = (text: string) => string;
export declare const fg: {
    red: (text: string) => string;
    green: (text: string) => string;
    yellow: (text: string) => string;
    blue: (text: string) => string;
    purple: (text: string) => string;
    cyan: (text: string) => string;
    white: (text: string) => string;
};
export declare const fgCycles: ((text: string) => string)[];
export declare function getNewColorCycle(): () => Colorizer;
export declare function colorizeLevel(level: string): string;
export declare function colorizePrefix(prefix: string): string;
export declare const browsify: typeof ansi2css.textToParts;
