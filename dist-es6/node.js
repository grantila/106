'use strict';
const logger_node_js_1 = require("./lib/logger-node.js");
const index_1 = require("./lib/index");
const extra = require("./lib/index");
const _glob = global;
const loggerInstance = _glob.__106_instance__
    ? _glob.__106_instance__
    : logger_node_js_1.default();
_glob.__106_instance__ = loggerInstance;
const logger = index_1.default(loggerInstance);
for (const key of Object.keys(extra))
    logger[key] = extra[key];
logger.default = logger;
logger.logger = logger;
module.exports = logger;
//# sourceMappingURL=node.js.map