"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansiStyles = require("ansi-styles");
const ansi2css = require("./ansi2css/index");
exports.fg = {
    red: (text) => ansiStyles.red.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.red.close,
    green: (text) => ansiStyles.green.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.green.close,
    yellow: (text) => ansiStyles.yellow.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.yellow.close,
    blue: (text) => ansiStyles.blue.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.blue.close,
    purple: (text) => ansiStyles.magenta.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.magenta.close,
    cyan: (text) => ansiStyles.cyan.open +
        ansiStyles.bold.open +
        text +
        ansiStyles.bold.close +
        ansiStyles.cyan.close,
    white: (text) => ansiStyles.white.open +
        text +
        ansiStyles.white.close,
};
exports.fgCycles = [
    exports.fg.yellow,
    exports.fg.green,
    exports.fg.red,
    exports.fg.blue,
    exports.fg.purple,
    exports.fg.cyan,
];
const prefixColorMap = {};
let prefixCycle = 0;
const levelMap = {
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
    let index = -1;
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