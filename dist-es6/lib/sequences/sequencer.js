"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequence_1 = require("./sequence");
const colors_1 = require("../colors");
let tagColorCycle = colors_1.getNewColorCycle();
const colorizerByTag = {};
class Direction {
    constructor(symbol, direction) {
        this._symbol = symbol;
        this._direction = direction;
    }
    getSymbol() {
        return this._symbol;
    }
    getDirection() {
        return this._direction;
    }
}
exports.Direction = Direction;
const rightArrow = "\u21D2";
const leftArrow = "\u21D0";
const brokenArrow = "\u21CD";
class Sequencer {
    constructor(tag, opts) {
        this._index = 0;
        this._colorCycle = colors_1.getNewColorCycle();
        this._tag = tag || '';
        opts = opts === undefined ? {} : opts;
        this._timeout = !opts.timeout ? null : opts.timeout;
        if (!colorizerByTag.hasOwnProperty(tag))
            colorizerByTag[tag] = tagColorCycle();
    }
    next(opts) {
        opts = opts === undefined ? {} : opts;
        opts.timeout = !opts.timeout ? this._timeout : opts.timeout;
        return new sequence_1.default(this._tag, ++this._index, colorizerByTag[this._tag], this._colorCycle(), opts);
    }
}
Sequencer.Direction = Direction;
Sequencer.IN = new Direction(rightArrow, 'IN');
Sequencer.OUT = new Direction(leftArrow, 'OUT');
Sequencer.OUTERR = new Direction(brokenArrow, 'OUTERR');
exports.default = Sequencer;
//# sourceMappingURL=sequencer.js.map