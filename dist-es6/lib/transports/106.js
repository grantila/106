"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const colors_1 = require("../colors");
class Transport {
    constructor(options) {
        options = options === undefined ? {} : options;
        this.level = options.level === undefined ? 'silly' : options.level;
    }
    log(level, msg, meta, next) {
        const options = {
            prettyPrint: true,
            colorized: meta.internal.colors,
            printMeta: false
        };
        function print(parsedLog) {
            const scope = console;
            const logger = (parsedLog.level === 'error' && console.error)
                ? console.error
                : (parsedLog.level === 'warn' && console.warn)
                    ? console.warn
                    : console.log;
            const line = colors_1.browsify(parsedLog.line);
            if (parsedLog.meta != null)
                line.push(parsedLog.meta);
            if (parsedLog.error != null)
                line.push(parsedLog.error);
            logger.apply(scope, line);
        }
        print(utils_1.parseLog(level, msg, meta, print, options));
        next();
    }
}
exports.default = Transport;
//# sourceMappingURL=106.js.map