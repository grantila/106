import * as winston from 'winston';
export interface BaseFileOptions {
    level: string;
    json?: boolean;
}
export default class BaseFile extends winston.transports.File {
    static available(): boolean;
    private level;
    private json;
    private stream;
    private baseFilename;
    private filename;
    constructor(options: any);
    private getBaseFilename();
    private getFilename();
    private reopen(filename);
    protected customLog(level: string, msg: string, meta: any): string;
    protected write(line: string): void;
    private _log(level, msg, meta, next);
    log(level: string, msg: string, meta: any, next: Function): void;
}
