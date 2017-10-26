"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basefile_1 = require("./basefile");
const utils_1 = require("../utils");
class Transport extends basefile_1.default {
    constructor(options = {}) {
        super(options);
    }
    customLog(level, msg, meta) {
        const options = { prettyPrint: true, colorized: meta.internal.colors };
        function print(parsedLog) {
            return parsedLog.line;
        }
        const writeError = (parsedLog) => {
            this.write(print(parsedLog));
        };
        return print(utils_1.parseLog(level, msg, meta, writeError, options));
    }
}
Transport.available = basefile_1.default.available;
exports.default = Transport;
//# sourceMappingURL=textfile.js.map