"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var colors_1 = require("../colors");
var Transport = (function () {
    function Transport(options) {
        options = options === undefined ? {} : options;
        this.level = options.level === undefined ? 'silly' : options.level;
    }
    Transport.prototype.log = function (level, msg, meta, next) {
        var options = {
            prettyPrint: true,
            colorized: meta.internal.colors,
            printMeta: false
        };
        function print(parsedLog) {
            var scope = console;
            var logger = (parsedLog.level === 'error' && console.error)
                ? console.error
                : (parsedLog.level === 'warn' && console.warn)
                    ? console.warn
                    : console.log;
            var line = colors_1.browsify(parsedLog.line);
            if (parsedLog.meta != null)
                line.push(parsedLog.meta);
            if (parsedLog.error != null)
                line.push(parsedLog.error);
            logger.apply(scope, line);
        }
        print(utils_1.parseLog(level, msg, meta, print, options));
        next();
    };
    return Transport;
}());
exports.default = Transport;
//# sourceMappingURL=106.js.map