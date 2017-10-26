"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const utils_1 = require("../utils");
class Console extends winston.transports.Console {
    constructor(options, ...args) {
        super(options, ...args);
        options = options === undefined ? {} : options;
        this.level = options.level;
    }
    log(level, msg, meta, next) {
        if (meta.internal.json)
            // Don't print pure-json logs to the console
            return next();
        const options = { prettyPrint: true, colorized: meta.internal.colors };
        function print(parsedLog) {
            const logger = (parsedLog.level === 'error')
                ? console.error
                : console.log;
            logger.call(console, parsedLog.line);
        }
        print(utils_1.parseLog(level, msg, meta, print, options));
        next();
    }
}
exports.default = Console;
//# sourceMappingURL=console.js.map