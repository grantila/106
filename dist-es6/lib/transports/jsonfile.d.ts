import BaseFile from './basefile';
export default class Transport extends BaseFile {
    static available: typeof BaseFile.available;
    constructor(options?: any);
    customLog(level: string, msg: string, meta: any): string;
}
