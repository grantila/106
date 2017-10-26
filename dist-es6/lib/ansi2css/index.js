"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansiStyles = require("ansi-styles");
const common_1 = require("../common");
const isIE = common_1.platform.name.toLowerCase() === 'IE';
const enableColors = !isIE;
let styleMap = null;
function buildTranslationMap() {
    styleMap = {};
    var colors = [
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
        'gray',
    ];
    var allStyles = [];
    Object.keys(ansiStyles).forEach(function (key) {
        ansiStyles;
        if (key === 'reset')
            return;
        var style = ansiStyles[key];
        var value = null;
        var isColor = colors.indexOf(key) !== -1;
        if (isColor)
            value = key;
        var isBgColor = false;
        if (/^bg/.test(key)) {
            isBgColor = -1 !== colors.indexOf(key.substr(2).toLowerCase());
            if (isBgColor)
                value = key.substr(2).toLowerCase();
        }
        if (!isColor && !isBgColor)
            value = key;
        var type = isColor
            ? 'color'
            : isBgColor
                ? 'bg-color'
                : 'style';
        var itemOpen = { dir: 'open', type: type, value: value };
        styleMap[style.open] = itemOpen;
        var itemClose = { type: type, value: value };
        allStyles.push(itemClose);
        if (!styleMap.hasOwnProperty(style.close))
            styleMap[style.close] = { dir: 'close', styles: [] };
        styleMap[style.close].styles.push(itemClose);
    });
}
const theme = {
    black: 'black',
    red: '#B00039',
    green: '#1E903C',
    yellow: '#DCD73C',
    blue: '#005299',
    magenta: '#963B8F',
    cyan: '#18A1A1',
    white: '#b0b0b0',
    gray: '#808080',
};
function styleToCss(scope) {
    function filterCssColor(colorName) {
        if (theme.hasOwnProperty(colorName))
            return theme[colorName];
        return colorName;
    }
    var out = "";
    if (scope.fg != null)
        out += "color: " + filterCssColor(scope.fg) + ";";
    if (scope.styles && scope.styles.underline != null) {
        if (scope.styles.underline)
            out += "text-decoration: underline;";
        else
            out += "text-decoration: initial;";
    }
    if (scope.styles && scope.styles.bold != null) {
        if (scope.styles.bold)
            out += "font-weight: bold;";
        else
            out += "font-weight: initial;";
    }
    if (scope.bg != null)
        out += "background-color: " + filterCssColor(scope.fg) + ";";
    return out;
}
function textToParts(text) {
    if (styleMap === null)
        buildTranslationMap();
    var stack = [];
    var parts = text.split(/(\u001b[^m]+m)/)
        .filter(Boolean)
        .map(function (part) {
        if (styleMap.hasOwnProperty(part))
            return styleMap[part];
        return part;
    });
    if (!enableColors)
        return [
            parts
                .filter(function (part) { typeof part === 'string'; })
                .join('')
        ];
    var textParts = [];
    var styleParts = [];
    function partToStyle(part) {
        var style = {};
        if (part.type === 'style') {
            style.styles = {};
            style.styles[part.value] = true;
        }
        else if (part.type === 'color') {
            style.fg = part.value;
        }
        else if (part.type === 'bg-color') {
            style.bg = part.value;
        }
        return style;
    }
    while (parts.length > 0) {
        var part = parts.shift();
        if (typeof part === 'string')
            textParts.push(part);
        else {
            textParts.push('%c');
            if (part.dir === 'open') {
                stack.push(part);
                // Apply the entire stack every time (seems necessary for css)
                var style = stack.reduce(function (prev, cur) {
                    return Object.assign(prev, partToStyle(cur));
                }, {});
                styleParts.push(styleToCss(style));
            }
            else {
                var styles = {};
                var types = part.styles.map(function (part) {
                    if (part.type === 'style')
                        styles[part.value] = false;
                    return part.type;
                });
                var reset = {};
                if (types.indexOf('color') !== -1) {
                    reset.fg = 'initial';
                    stack = stack.filter(function (stackItem) {
                        return stackItem.type !== 'color';
                    });
                }
                if (types.indexOf('bg-color') !== -1) {
                    reset.bg = 'initial';
                    stack = stack.filter(function (stackItem) {
                        return stackItem.type !== 'bg-color';
                    });
                }
                if (types.indexOf('style') !== -1) {
                    reset.styles = styles;
                    stack = stack.filter(function (stackItem) {
                        return stackItem.type !== 'style';
                    });
                }
                styleParts.push(styleToCss(reset));
            }
        }
    }
    return [textParts.join('')].concat(styleParts);
}
exports.textToParts = textToParts;
//# sourceMappingURL=index.js.map