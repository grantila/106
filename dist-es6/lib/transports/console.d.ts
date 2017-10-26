declare const Console_base: new (...args: any[]) => any;
export default class Console extends Console_base {
    private level;
    constructor(options?: any, ...args: any[]);
    log(level: string, msg: string, meta: any, next: Function): any;
}
