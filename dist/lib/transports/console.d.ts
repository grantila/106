import * as winston from 'winston';
export default class Console extends winston.transports.Console {
    private level;
    constructor(options?: any, ...args: any[]);
    log(level: string, msg: string, meta: any, next: Function): any;
}
