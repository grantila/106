"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequence_1 = require("./sequence");
var colors_1 = require("../colors");
var tagColorCycle = colors_1.getNewColorCycle();
var colorizerByTag = {};
var Direction = (function () {
    function Direction(symbol, direction) {
        this._symbol = symbol;
        this._direction = direction;
    }
    Direction.prototype.getSymbol = function () {
        return this._symbol;
    };
    Direction.prototype.getDirection = function () {
        return this._direction;
    };
    return Direction;
}());
exports.Direction = Direction;
var rightArrow = "\u21D2";
var leftArrow = "\u21D0";
var brokenArrow = "\u21CD";
var Sequencer = (function () {
    function Sequencer(tag, opts) {
        this._index = 0;
        this._colorCycle = colors_1.getNewColorCycle();
        this._tag = tag || '';
        opts = opts === undefined ? {} : opts;
        this._timeout = !opts.timeout ? null : opts.timeout;
        if (!colorizerByTag.hasOwnProperty(tag))
            colorizerByTag[tag] = tagColorCycle();
    }
    Sequencer.prototype.next = function (opts) {
        opts = opts === undefined ? {} : opts;
        opts.timeout = !opts.timeout ? this._timeout : opts.timeout;
        return new sequence_1.default(this._tag, ++this._index, colorizerByTag[this._tag], this._colorCycle(), opts);
    };
    Sequencer.Direction = Direction;
    Sequencer.IN = new Direction(rightArrow, 'IN');
    Sequencer.OUT = new Direction(leftArrow, 'OUT');
    Sequencer.OUTERR = new Direction(brokenArrow, 'OUTERR');
    return Sequencer;
}());
exports.default = Sequencer;
//# sourceMappingURL=sequencer.js.map