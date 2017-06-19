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
var path = require("path");
var fs = require("fs");
var utils_1 = require("../utils");
function getBaseFilename(json) {
    var base = utils_1.appId();
    return json ? (base + '-json') : base;
}
function getFilename(json) {
    var date = (new Date()).toJSON().replace(/T.*/, '');
    var filename = getBaseFilename(json) + "-" + date + '.log';
    return path.join(utils_1.logRoot(), filename);
}
function filterOptions(options) {
    if (options === void 0) { options = {}; }
    options.json = options.json === undefined ? false : options.json;
    options.filename = getFilename(options.json);
    return options;
}
var BaseFile = (function (_super) {
    __extends(BaseFile, _super);
    function BaseFile(options) {
        var _this = _super.call(this, filterOptions(options)) || this;
        options = filterOptions(options);
        _this.level = options.level;
        _this.json = options.json;
        _this.stream = null;
        _this.baseFilename = _this.getBaseFilename();
        _this.reopen(_this.getFilename());
        return _this;
    }
    BaseFile.available = function () {
        return (typeof utils_1.logRoot() === 'string' &&
            typeof utils_1.appId() === 'string' &&
            utils_1.appId().length > 0);
    };
    BaseFile.prototype.getBaseFilename = function () {
        return getBaseFilename(this.json);
    };
    BaseFile.prototype.getFilename = function () {
        return getFilename(this.json);
    };
    BaseFile.prototype.reopen = function (filename) {
        this.filename = filename;
        if (this.stream)
            this.stream.close();
        this.stream = fs.createWriteStream(this.filename, { flags: 'a', encoding: 'utf8' });
    };
    BaseFile.prototype.customLog = function (level, msg, meta) {
        return msg + " " + meta;
    };
    BaseFile.prototype.write = function (line) {
        this.stream.write(line);
    };
    BaseFile.prototype._log = function (level, msg, meta, next) {
        var filename = this.getFilename();
        if (filename !== this.filename)
            this.reopen(filename);
        var data = this.customLog(level, msg, meta);
        if (data.length > 0 && data.charAt(data.length - 1) != "\n")
            data += "\n";
        this.write(data);
        next();
    };
    BaseFile.prototype.log = function (level, msg, meta, next) {
        setImmediate(this._log.bind(this, level, msg, meta, next));
    };
    return BaseFile;
}(winston.transports.File));
exports.default = BaseFile;
//# sourceMappingURL=basefile.js.map