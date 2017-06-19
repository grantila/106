'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var logger_browser_js_1 = require("./lib/logger-browser.js");
var index_1 = require("./lib/index");
var logger = index_1.default(logger_browser_js_1.default());
exports.logger = logger;
__export(require("./lib/index"));
//# sourceMappingURL=browser.js.map