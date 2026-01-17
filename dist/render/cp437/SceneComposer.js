"use strict";
var SceneComposer = (function () {
    function SceneComposer(width, height) {
        this.width = width;
        this.height = height;
        this.buffer = [];
        this.defaultAttr = makeAttr(BLACK, BG_BLACK);
        this.clear();
    }
    SceneComposer.prototype.clear = function () {
        this.buffer = [];
        for (var y = 0; y < this.height; y++) {
            var row = [];
            for (var x = 0; x < this.width; x++) {
                row.push({ char: ' ', attr: this.defaultAttr });
            }
            this.buffer.push(row);
        }
    };
    SceneComposer.prototype.setCell = function (x, y, char, attr) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.buffer[y][x] = { char: char, attr: attr };
        }
    };
    SceneComposer.prototype.getCell = function (x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.buffer[y][x];
        }
        return null;
    };
    SceneComposer.prototype.writeString = function (x, y, text, attr) {
        for (var i = 0; i < text.length; i++) {
            this.setCell(x + i, y, text.charAt(i), attr);
        }
    };
    SceneComposer.prototype.drawHLine = function (x, y, length, char, attr) {
        for (var i = 0; i < length; i++) {
            this.setCell(x + i, y, char, attr);
        }
    };
    SceneComposer.prototype.drawVLine = function (x, y, length, char, attr) {
        for (var i = 0; i < length; i++) {
            this.setCell(x, y + i, char, attr);
        }
    };
    SceneComposer.prototype.drawBox = function (x, y, w, h, attr) {
        this.setCell(x, y, GLYPH.BOX_TL, attr);
        this.setCell(x + w - 1, y, GLYPH.BOX_TR, attr);
        this.setCell(x, y + h - 1, GLYPH.BOX_BL, attr);
        this.setCell(x + w - 1, y + h - 1, GLYPH.BOX_BR, attr);
        for (var i = 1; i < w - 1; i++) {
            this.setCell(x + i, y, GLYPH.BOX_H, attr);
            this.setCell(x + i, y + h - 1, GLYPH.BOX_H, attr);
        }
        for (var j = 1; j < h - 1; j++) {
            this.setCell(x, y + j, GLYPH.BOX_V, attr);
            this.setCell(x + w - 1, y + j, GLYPH.BOX_V, attr);
        }
    };
    SceneComposer.prototype.getBuffer = function () {
        return this.buffer;
    };
    SceneComposer.prototype.getRow = function (y) {
        var row = '';
        for (var x = 0; x < this.width; x++) {
            row += this.buffer[y][x].char;
        }
        return row;
    };
    return SceneComposer;
}());
