export default function createBrowserLogger(): {
    log: (level: any, ...args: any[]) => void;
    silly: any;
    debug: any;
    verbose: any;
    info: any;
    warn: any;
    error: any;
};
