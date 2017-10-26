export default class Transport {
    private level;
    constructor(options?: any);
    log(level: string, msg: string, meta: any, next: Function): void;
}
