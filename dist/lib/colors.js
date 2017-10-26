"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ansiStyles = require("ansi-styles");
var ansi2css = require("./ansi2css/index");
exports.fg = {
    red: function (text) {
        return ansiStyles.red.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.red.close;
    },
    green: function (text) {
        return ansiStyles.green.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.green.close;
    },
    yellow: function (text) {
        return ansiStyles.yellow.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.yellow.close;
    },
    blue: function (text) {
        return ansiStyles.blue.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.blue.close;
    },
    purple: function (text) {
        return ansiStyles.magenta.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.magenta.close;
    },
    cyan: function (text) {
        return ansiStyles.cyan.open +
            ansiStyles.bold.open +
            text +
            ansiStyles.bold.close +
            ansiStyles.cyan.close;
    },
    white: function (text) {
        return ansiStyles.white.open +
            text +
            ansiStyles.white.close;
    },
};
exports.fgCycles = [
    exports.fg.yellow,
    exports.fg.green,
    exports.fg.red,
    exports.fg.blue,
    exports.fg.purple,
    exports.fg.cyan,
];
var prefixColorMap = {};
var prefixCycle = 0;
var levelMap = {
    silly: exports.fg.white,
    debug: exports.fg.purple,
    verbose: exports.fg.blue,
    info: exports.fg.green,
    warn: exports.fg.yellow,
    error: exports.fg.red,
};
function levelColor(level) {
    if (levelMap.hasOwnProperty(level))
        return levelMap[level];
    else
        return exports.fg.white;
}
function prefixColor(prefix) {
    if (!prefixColorMap.hasOwnProperty(prefix)) {
        var colorIndex = prefixCycle++ % exports.fgCycles.length;
        prefixColorMap[prefix] = colorIndex;
    }
    return exports.fgCycles[prefixColorMap[prefix]];
}
function getNewColorCycle() {
    var index = -1;
    return function () {
        ++index;
        if (index >= exports.fgCycles.length)
            index = 0;
        return exports.fgCycles[index];
    };
}
exports.getNewColorCycle = getNewColorCycle;
function colorizeLevel(level) {
    return levelColor(level)(level);
}
exports.colorizeLevel = colorizeLevel;
function colorizePrefix(prefix) {
    return prefixColor(prefix)(prefix);
}
exports.colorizePrefix = colorizePrefix;
exports.browsify = ansi2css.textToParts;
//# sourceMappingURL=colors.js.map