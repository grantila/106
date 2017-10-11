'use strict';
var logger_node_js_1 = require("./lib/logger-node.js");
var index_1 = require("./lib/index");
var extra = require("./lib/index");
var _glob = global;
var loggerInstance = _glob.__106_instance__
    ? _glob.__106_instance__
    : logger_node_js_1.default();
_glob.__106_instance__ = loggerInstance;
var logger = index_1.default(loggerInstance);
for (var _i = 0, _a = Object.keys(extra); _i < _a.length; _i++) {
    var key = _a[_i];
    logger[key] = extra[key];
}
logger.default = logger;
logger.logger = logger;
module.exports = logger;
//# sourceMappingURL=node.js.map