'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var colors = require("./colors");
var winston = require("winston");
var console_1 = require("./transports/console");
var textfile_1 = require("./transports/textfile");
var jsonfile_1 = require("./transports/jsonfile");
function createLogger() {
    var transports = [];
    var consoleLogLevel = process.env.CONSOLE_LOG_LEVEL
        ? process.env.CONSOLE_LOG_LEVEL
        : 'debug';
    transports.push(new console_1.default({ level: consoleLogLevel }));
    if (!textfile_1.default.available())
        console.log(colors.fg.purple("<log> File transport disabled. Needs LOG_ROOT and APP_ID " +
            "environment variables."));
    if (textfile_1.default.available())
        transports.push(new textfile_1.default({ name: 'file.text', level: 'debug' }));
    if (jsonfile_1.default.available())
        transports.push(new jsonfile_1.default({ name: 'file.json', level: 'verbose' }));
    return new (winston.Logger)({ transports: transports });
}
exports.default = createLogger;
//# sourceMappingURL=logger-node.js.map