"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../utils");
function getBaseFilename(json) {
    const base = utils_1.appId();
    return json ? (base + '-json') : base;
}
function getFilename(json) {
    const date = (new Date()).toJSON().replace(/T.*/, '');
    const filename = getBaseFilename(json) + "-" + date + '.log';
    return path.join(utils_1.logRoot(), filename);
}
function filterOptions(options = {}) {
    options.json = options.json === undefined ? false : options.json;
    options.filename = getFilename(options.json);
    return options;
}
class BaseFile extends winston.transports.File {
    static available() {
        return (typeof utils_1.logRoot() === 'string' &&
            typeof utils_1.appId() === 'string' &&
            utils_1.appId().length > 0);
    }
    constructor(options) {
        super(filterOptions(options));
        options = filterOptions(options);
        this.level = options.level;
        this.json = options.json;
        this.stream = null;
        this.baseFilename = this.getBaseFilename();
        this.reopen(this.getFilename());
    }
    getBaseFilename() {
        return getBaseFilename(this.json);
    }
    getFilename() {
        return getFilename(this.json);
    }
    reopen(filename) {
        this.filename = filename;
        if (this.stream)
            this.stream.close();
        this.stream = fs.createWriteStream(this.filename, { flags: 'a', encoding: 'utf8' });
    }
    customLog(level, msg, meta) {
        return msg + " " + meta;
    }
    write(line) {
        this.stream.write(line);
    }
    _log(level, msg, meta, next) {
        const filename = this.getFilename();
        if (filename !== this.filename)
            this.reopen(filename);
        var data = this.customLog(level, msg, meta);
        if (data.length > 0 && data.charAt(data.length - 1) != "\n")
            data += "\n";
        this.write(data);
        next();
    }
    log(level, msg, meta, next) {
        setImmediate(this._log.bind(this, level, msg, meta, next));
    }
}
exports.default = BaseFile;
//# sourceMappingURL=basefile.js.map