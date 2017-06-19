"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var utils_1 = require("../utils");
var Console = (function (_super) {
    __extends(Console, _super);
    function Console(options) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.apply(this, [options].concat(args)) || this;
        options = options === undefined ? {} : options;
        _this.level = options.level;
        return _this;
    }
    Console.prototype.log = function (level, msg, meta, next) {
        if (meta.internal.json)
            // Don't print pure-json logs to the console
            return next();
        var options = { prettyPrint: true, colorized: meta.internal.colors };
        function print(parsedLog) {
            var logger = (parsedLog.level === 'error')
                ? console.error
                : console.log;
            logger.call(console, parsedLog.line);
        }
        print(utils_1.parseLog(level, msg, meta, print, options));
        next();
    };
    return Console;
}(winston.transports.Console));
exports.default = Console;
//# sourceMappingURL=console.js.map