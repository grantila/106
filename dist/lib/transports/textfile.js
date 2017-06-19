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
var basefile_1 = require("./basefile");
var utils_1 = require("../utils");
var Transport = (function (_super) {
    __extends(Transport, _super);
    function Transport(options) {
        if (options === void 0) { options = {}; }
        return _super.call(this, options) || this;
    }
    Transport.prototype.customLog = function (level, msg, meta) {
        var _this = this;
        var options = { prettyPrint: true, colorized: meta.internal.colors };
        function print(parsedLog) {
            return parsedLog.line;
        }
        var writeError = function (parsedLog) {
            _this.write(print(parsedLog));
        };
        return print(utils_1.parseLog(level, msg, meta, writeError, options));
    };
    Transport.available = basefile_1.default.available;
    return Transport;
}(basefile_1.default));
exports.default = Transport;
//# sourceMappingURL=textfile.js.map