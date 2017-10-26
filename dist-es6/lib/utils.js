"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("./colors");
function logRoot() {
    return process.env.LOG_ROOT;
}
exports.logRoot = logRoot;
function appId() {
    return process.env.APP_ID;
}
exports.appId = appId;
function timestamp(date = new Date(), opts) {
    opts = opts === undefined ? {} : opts;
    const withoutMilliseconds = opts.withoutMilliseconds || false;
    const reStripTZ = /Z.*/;
    const reStripMillisAndTZ = /\.\d+Z.*/;
    const reStrip = withoutMilliseconds ? reStripMillisAndTZ : reStripTZ;
    return date.toJSON().replace(/T/, ' ').replace(reStrip, '');
}
exports.timestamp = timestamp;
;
function prettyPrintJson(object, opts) {
    opts = opts === undefined ? {} : opts;
    var indent = 4;
    var json = JSON.stringify(object, null, indent);
    if (opts.colorized) {
        object = JSON.parse(json); // Cleaned object
        var repeatString = function (pattern, count) {
            if (count < 1)
                return '';
            var result = '';
            while (count > 1) {
                if (count & 1)
                    result += pattern;
                count >>= 1, pattern += pattern;
            }
            return result + pattern;
        };
        var makeIndent = function (level) {
            return repeatString(' ', level * indent);
        };
        var recurse = function (object, level) {
            if (object === undefined) {
                return colors.fg.purple("undefined");
            }
            else if (object === null) {
                return colors.fg.purple("null");
            }
            else if (object.constructor === Boolean) {
                return colors.fg.purple(object.toString());
            }
            else if (object.constructor === Number) {
                return colors.fg.blue(object.toString());
            }
            else if (object.constructor === String) {
                return colors.fg.yellow("\"" + object + "\"");
            }
            else if (object.constructor === Array) {
                var s = "[\n";
                var keyIndents = makeIndent(level + 1);
                for (var i = 0; i < object.length; ++i) {
                    var comma = (i === object.length - 1) ? "" : ",";
                    s += keyIndents +
                        recurse(object[i], level + 1) + comma + "\n";
                }
                return s + makeIndent(level) + "]";
            }
            else if (object.constructor === Object) {
                var s = "{\n";
                var keyIndents = makeIndent(level + 1);
                var printKey = function (key) {
                    if (key.indexOf(' ') !== -1)
                        return "\"" + key + "\"";
                    else
                        return key;
                };
                var entries = [];
                for (var key in object) {
                    if (object.hasOwnProperty(key))
                        entries.push(keyIndents +
                            colors.fg.green(printKey(key)) +
                            ": " +
                            recurse(object[key], level + 1));
                }
                if (entries.length > 0) {
                    s += entries.join(",\n") + "\n";
                }
                s += makeIndent(level) + "}";
                return s;
            }
            else {
                return "(unknown: " + object + ")";
            }
        };
        return recurse(object, 0);
    }
    else {
        return json;
    }
}
exports.prettyPrintJson = prettyPrintJson;
function parseLog(level, msg, _meta, onTimeout, opts = {}) {
    opts = opts === undefined ? {} : opts;
    const internal = _meta.internal;
    const error = internal.error;
    const meta = _meta.meta;
    const out = {
        level,
        msg,
        line: msg,
        meta: meta || null,
        error: error || null,
        timestamp: internal.time.toJSON(),
        internal: {
            appId: appId()
        }
    };
    if (internal.sequence) {
        out.sequenceTag = internal.sequence.getTag();
        out.sequenceIndex = internal.sequence.getIndex();
    }
    if (error != null)
        out.error = error;
    if (opts.prettyPrint) {
        var line;
        var printSequencePrefix = function () {
            if (!internal.sequence)
                return "";
            var prefix = internal.sequence.getPrefix(opts.colorized);
            if (internal.sequenceDirection) {
                const symbol = internal.sequenceDirection.getSymbol();
                const direction = internal.sequenceDirection.getDirection();
                if (direction === 'IN')
                    internal.sequence.begin(() => {
                        const newMeta = Object.assign({}, _meta);
                        newMeta.internal = Object.assign({ sequenceDirection: null }, newMeta.internal);
                        onTimeout(parseLog("warning", "{ sequence timed out }", newMeta, null, Object.assign({}, opts)));
                    });
                else
                    internal.sequence.end();
                if (opts.colorized) {
                    if (direction === 'OUTERR')
                        prefix += " " + colors.fg.red(symbol);
                    else
                        prefix += " " + internal.sequence.colorize(symbol);
                }
                else
                    prefix += " " + symbol + " ";
            }
            return prefix + " ";
        };
        var printSequenceSuffix = function () {
            if (!internal.sequence)
                return "";
            return " " + internal.sequence.getSuffix(opts.colorized);
        };
        if (opts.colorized) {
            line =
                internal.timestamp +
                    " " +
                    colors.colorizeLevel(level) +
                    " - " +
                    colors.colorizePrefix(internal.prefix) +
                    ": ";
        }
        else {
            line =
                internal.timestamp +
                    " " +
                    level +
                    " - " +
                    internal.prefix +
                    ": ";
        }
        line += printSequencePrefix() + msg + printSequenceSuffix();
        if (opts.printMeta === undefined || opts.printMeta) {
            if (meta != null) {
                line += "\n" + prettyPrintJson(meta, opts);
            }
            if (error != null) {
                line += "\n" + prettyPrintJson(error, opts);
            }
        }
        out.line = line;
    }
    return out;
}
exports.parseLog = parseLog;
//# sourceMappingURL=utils.js.map