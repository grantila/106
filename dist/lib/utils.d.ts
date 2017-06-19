export declare function logRoot(): string;
export declare function appId(): string;
export declare function timestamp(date?: Date, opts?: any): string;
export declare function prettyPrintJson(object: any, opts?: any): string;
export interface ParsedLog {
    level: string;
    msg: string;
    line: string;
    meta: any;
    error: any;
    timestamp: string;
    internal: {
        appId: string;
    };
    sequenceTag?: string;
    sequenceIndex?: number;
    appId?: string;
}
export interface ParseOptions {
    prettyPrint?: boolean;
    colorized?: boolean;
    printMeta?: boolean;
}
export declare type OnTimeout = (parsedLog: ParsedLog) => void;
export declare function parseLog(level: any, msg: any, _meta: any, onTimeout: OnTimeout, opts?: ParseOptions): ParsedLog;
