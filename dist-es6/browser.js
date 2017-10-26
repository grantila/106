'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const logger_browser_js_1 = require("./lib/logger-browser.js");
const index_1 = require("./lib/index");
const _glob = global;
const loggerInstance = _glob.__106_instance__
    ? _glob.__106_instance__
    : logger_browser_js_1.default();
_glob.__106_instance__ = loggerInstance;
const logger = index_1.default(loggerInstance);
exports.logger = logger;
__export(require("./lib/index"));
exports.default = logger;
//# sourceMappingURL=browser.js.map