"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basefile_1 = require("./basefile");
const utils_1 = require("../utils");
function filterOptions(options) {
    options.json = true;
    return options;
}
class Transport extends basefile_1.default {
    constructor(options = {}) {
        super(filterOptions(options));
    }
    customLog(level, msg, meta) {
        function print(parsedLog) {
            parsedLog.appId = parsedLog.internal.appId;
            delete parsedLog.internal;
            delete parsedLog.line;
            return JSON.stringify(parsedLog, null, 0);
        }
        const writeError = (parsedLog) => {
            this.write(print(parsedLog));
        };
        return print(utils_1.parseLog(level, msg, meta, writeError));
    }
}
Transport.available = basefile_1.default.available;
exports.default = Transport;
//# sourceMappingURL=jsonfile.js.map