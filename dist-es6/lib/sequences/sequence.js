"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NopSequence {
    constructor() { }
    getIndex() { return null; }
    getTag() { return null; }
    colorize(text) { return text; }
    getPrefix() { return ""; }
    getSuffix() { return ""; }
    begin(onTimeout) { }
    end() { }
}
exports.NopSequence = NopSequence;
class Sequence {
    constructor(tag, index, sequenceColorizer, indexColorizer, opts) {
        this._index = index;
        this._tag = tag;
        this._sequenceColorizer = sequenceColorizer;
        this._indexColorizer = indexColorizer;
        this._startTime = (new Date()).getTime();
        this._timeout = opts.timeout;
        this._begun = false;
        this._finished = false;
        this._timer = null;
    }
    getIndex() {
        return this._index;
    }
    getTag() {
        return this._tag;
    }
    colorize(text) {
        return this._indexColorizer(text);
    }
    getPrefix(colorized = false) {
        if (!colorized)
            return "[seq:" + (this._tag ? this._tag + ":" : '') + this._index + "]";
        return this._indexColorizer("[seq:") +
            this._sequenceColorizer(this._tag) +
            this._indexColorizer((this._tag ? ':' : '') + this._index + "]");
    }
    getSuffix(colorized = false) {
        const diffTime = (new Date()).getTime() - this._startTime;
        const diff = formatTimeDiff(diffTime);
        if (!colorized)
            return diff;
        return this._indexColorizer(diff);
    }
    begin(onTimeout) {
        if (this._begun)
            return;
        this._begun = true;
        if (this._timeout) {
            // Reset timer (because this makes kind of sense)
            this._startTime = (new Date()).getTime();
            var self = this;
            this._timer = setTimeout(function () {
                if (!self._finished) {
                    onTimeout();
                }
            }, this._timeout);
        }
    }
    end() {
        if (this._finished)
            return;
        this._finished = true;
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
    }
}
Sequence.nop = new NopSequence();
exports.default = Sequence;
function getDiffParts(diff) {
    var parts = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        millis: 0
    };
    // > 1d
    if (diff > 60000 * 60 * 24) {
        parts.days = Math.floor(diff / (60000 * 60 * 24));
        diff -= parts.days * 60000 * 60 * 24;
    }
    // > 1h
    if (diff > 60000 * 60) {
        parts.hours = Math.floor(diff / (60000 * 60));
        diff -= parts.hours * 60000 * 60;
    }
    // > 1m
    if (diff > 60000) {
        parts.minutes = Math.floor(diff / (60000));
        diff -= parts.minutes * 60000;
    }
    // > 1m
    if (diff > 1000) {
        parts.seconds = Math.floor(diff / (1000));
        diff -= parts.seconds * 1000;
    }
    parts.millis = diff;
    return parts;
}
function formatTimeDiff(diff) {
    var parts = getDiffParts(diff);
    if (parts.days > 0) {
        if (parts.hours > 0)
            return "" + parts.days + "d" + parts.hours + "h";
        return "" + parts.days + "d";
    }
    else if (parts.hours > 0) {
        if (parts.minutes > 0)
            return "" + parts.hours + "h" + parts.minutes + "m";
        return "" + parts.hours + "h";
    }
    else if (parts.minutes > 0) {
        if (parts.seconds > 0)
            return "" + parts.minutes + "m" + parts.seconds + "s";
        return "" + parts.minutes + "m";
    }
    else if (parts.seconds > 0) {
        var millis = parts.millis + parts.seconds * 1000;
        return "" + (millis / 1000).toFixed(3) + "s";
    }
    return "" + parts.millis + "ms";
}
//# sourceMappingURL=sequence.js.map