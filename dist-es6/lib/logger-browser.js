'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const _106_1 = require("./transports/106");
function createBrowserLogger() {
    const transport = new _106_1.default({ level: 'debug' });
    function parseArgs(level, args) {
        var msg;
        const parsed = {
            msg: null,
            meta: null
        };
        if (args.length > 0 && typeof args[0] == 'string') {
            msg = args.shift();
            // Parse msg, look for '%s'
            msg = msg.replace(/\%s/g, function () {
                if (args.length === 0)
                    return '%s';
                const nextValue = args.shift();
                if (nextValue == null)
                    return "" + nextValue;
                return typeof nextValue.toString === 'function'
                    ? nextValue.toString()
                    : nextValue;
            });
        }
        // Expect the last argument to be an object or error
        if (args.length > 0 && typeof args[args.length - 1] === 'object') {
            parsed.meta = args.pop();
        }
        // Merge the middle arguments in the message, by the Principle of
        // Least Surprise
        while (args.length > 0) {
            const data = args.shift();
            const primitive = data === null ||
                typeof data === 'undefined' ||
                !data.hasOwnProperty('toString') ||
                typeof data.toString !== 'function';
            // toString() can throw on native functions and possibly other
            // native object types.
            try {
                if (primitive) {
                    msg = "" + msg + " " + data;
                }
                else {
                    msg = "" + msg + " " + data.toString();
                }
            }
            catch (err) {
                msg = "" + msg + " {unstringifyable value}";
            }
        }
        parsed.msg = msg;
        return parsed;
    }
    function logger(...args) {
        const level = this;
        const parsedArgs = parseArgs(level, args);
        transport.log(level, parsedArgs.msg, parsedArgs.meta, function () { });
    }
    function log(level, ...args) {
        logger.apply(level, args);
    }
    return {
        log: log,
        silly: logger.bind('silly'),
        debug: logger.bind('debug'),
        verbose: logger.bind('verbose'),
        info: logger.bind('info'),
        warn: logger.bind('warn'),
        error: logger.bind('error')
    };
}
exports.default = createBrowserLogger;
//# sourceMappingURL=logger-browser.js.map