"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const sequence_1 = require("./sequences/sequence");
exports.Sequence = sequence_1.default;
const sequencer_1 = require("./sequences/sequencer");
exports.Sequencer = sequencer_1.default;
const levels = {
    disabled: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};
let level = 'debug';
exports.level = level;
let colors = true;
exports.colors = colors;
const transports = [];
function setLevel(newLevel) {
    exports.level = level = newLevel;
}
exports.setLevel = setLevel;
function shouldLog(_level, highest) {
    if (highest === 'disabled')
        return false;
    if (levels.hasOwnProperty(_level) &&
        levels[_level] > levels[highest])
        return false;
    return true;
}
function addTransport(fn, opts) {
    opts = opts || {};
    transports.push(function (_level, _args) {
        var highestLevel = opts.level || level;
        if (!shouldLog(_level, highestLevel))
            return;
        const args = [..._args];
        var extra = args.pop();
        var internal = extra.internal;
        var data = {
            level: _level,
            messages: args,
            meta: extra.meta || null,
            error: internal.error || null,
            prefix: internal.prefix,
            sequence: internal.sequence,
            sequenceDirection: internal.sequenceDirection,
            time: internal.time,
            timestamp: internal.timestamp
        };
        fn(data);
    });
}
exports.addTransport = addTransport;
function logger(backend) {
    function log(prefix) {
        const out = {};
        function makePrefixWrappedLogger(backend, _level, internalExtra = {}) {
            return function () {
                if (transports.length === 0 &&
                    !shouldLog(_level, level))
                    // Too high log level, and no other transports
                    return;
                const args = [].slice.apply(arguments);
                const now = new Date();
                var internal = {
                    prefix,
                    time: now,
                    timestamp: utils_1.timestamp(now),
                    sequence: null,
                    sequenceDirection: null,
                    colors,
                };
                for (var key in internalExtra)
                    internal[key] = internalExtra[key];
                function parseError(err) {
                    function parseStack(stack) {
                        if (!stack)
                            return [];
                        var lines = ('string' === typeof stack)
                            ? stack.split("\n")
                            : Array.isArray(stack)
                                ? stack
                                : [];
                        if (lines[0] === err.name + ": " + err.message) {
                            lines.shift();
                        }
                        for (var i = 0; i < lines.length; ++i) {
                            lines[i] = lines[i].trim();
                        }
                        return lines;
                    }
                    return {
                        name: err.name,
                        message: err.message,
                        stack: parseStack(err.stack),
                        fileName: err.fileName,
                        lineNumber: err.lineNumber
                    };
                }
                if (args.length > 0 &&
                    args[0] &&
                    args[0] instanceof sequence_1.default) {
                    internal.sequence = args.shift();
                    if (args.length > 0 &&
                        args[0] &&
                        args[0] instanceof sequencer_1.default.Direction)
                        internal.sequenceDirection = args.shift();
                }
                var hasEnoughArguments = function () {
                    function countOccurences(text, needle) {
                        return text.split(needle).length - 1;
                    }
                    if (args.length === 0)
                        return true;
                    if (typeof args[0] === 'string') {
                        var count = countOccurences(args[0], '%s');
                        if (count >= (args.length - 1))
                            return false;
                    }
                    return true;
                };
                if (hasEnoughArguments() &&
                    args.length > 0 && args[args.length - 1] && (args[args.length - 1].constructor == Object ||
                    args[args.length - 1].constructor == Array)) {
                    args[args.length - 1] = {
                        internal: internal,
                        meta: args[args.length - 1]
                    };
                }
                else if (hasEnoughArguments() &&
                    args.length > 0 && args[args.length - 1] &&
                    args[args.length - 1] instanceof Error) {
                    internal.error = parseError(args[args.length - 1]);
                    args[args.length - 1] = {
                        internal: internal
                    };
                }
                else {
                    args.push({ internal: internal });
                }
                transports.forEach(function (transport) {
                    transport(_level, args);
                });
                if (shouldLog(_level, level))
                    return backend.apply(backend, args);
            };
        }
        out.json = makePrefixWrappedLogger(backend.info, 'info', { json: true });
        for (var key in backend) {
            if (backend.hasOwnProperty(key) &&
                backend[key] instanceof Function) {
                out[key] = makePrefixWrappedLogger(backend[key], key);
            }
        }
        return out;
    }
    const out = log;
    out.Sequence = sequence_1.default;
    out.Sequencer = sequencer_1.default;
    return out;
}
exports.default = logger;
;
//# sourceMappingURL=index.js.map