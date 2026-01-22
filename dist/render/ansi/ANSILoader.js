"use strict";
var ANSILoader = (function () {
    function ANSILoader() {
    }
    ANSILoader.load = function (filename, directory) {
        var dir = directory || ANSILoader.defaultDirectory;
        var path = dir + '/' + filename;
        try {
            if (typeof file_exists !== 'undefined' && !file_exists(path)) {
                logWarning("ANSI file not found: " + path);
                return null;
            }
            var content;
            if (typeof read !== 'undefined') {
                content = read(path);
            }
            else {
                logWarning("Cannot read ANSI file outside Synchronet: " + path);
                return null;
            }
            return ANSILoader.parse(content);
        }
        catch (e) {
            logWarning("Error loading ANSI file: " + path + " - " + e);
            return null;
        }
    };
    ANSILoader.scanDirectory = function (directory) {
        var dir = directory || ANSILoader.defaultDirectory;
        var files = [];
        try {
            if (typeof directory_list !== 'undefined') {
                var allFiles = directory_list(dir);
                for (var i = 0; i < allFiles.length; i++) {
                    var f = allFiles[i];
                    if (f.toLowerCase().endsWith('.ans')) {
                        files.push(f);
                    }
                }
            }
        }
        catch (e) {
            logWarning("Error scanning ANSI directory: " + dir + " - " + e);
        }
        return files;
    };
    ANSILoader.parse = function (content) {
        var width = 80;
        var maxHeight = 500;
        var cells = [];
        for (var row = 0; row < maxHeight; row++) {
            cells[row] = [];
            for (var col = 0; col < width; col++) {
                cells[row][col] = { char: ' ', attr: makeAttr(LIGHTGRAY, BG_BLACK) };
            }
        }
        var cursorX = 0;
        var cursorY = 0;
        var currentAttr = makeAttr(LIGHTGRAY, BG_BLACK);
        var maxY = 0;
        var i = 0;
        while (i < content.length) {
            var ch = content.charAt(i);
            var code = content.charCodeAt(i);
            if (code === 27 && i + 1 < content.length && content.charAt(i + 1) === '[') {
                i += 2;
                var params = '';
                while (i < content.length) {
                    var c = content.charAt(i);
                    if ((c >= '0' && c <= '9') || c === ';') {
                        params += c;
                        i++;
                    }
                    else {
                        break;
                    }
                }
                if (i < content.length) {
                    var cmd = content.charAt(i);
                    i++;
                    var parts = params.split(';');
                    var nums = [];
                    for (var p = 0; p < parts.length; p++) {
                        nums.push(parts[p] === '' ? 0 : parseInt(parts[p], 10));
                    }
                    switch (cmd) {
                        case 'm':
                            currentAttr = ANSILoader.parseSGR(nums, currentAttr);
                            break;
                        case 'H':
                        case 'f':
                            cursorY = (nums[0] || 1) - 1;
                            cursorX = (nums[1] || 1) - 1;
                            break;
                        case 'A':
                            cursorY = Math.max(0, cursorY - (nums[0] || 1));
                            break;
                        case 'B':
                            cursorY = cursorY + (nums[0] || 1);
                            break;
                        case 'C':
                            cursorX = Math.min(width - 1, cursorX + (nums[0] || 1));
                            break;
                        case 'D':
                            cursorX = Math.max(0, cursorX - (nums[0] || 1));
                            break;
                        case 'J':
                        case 'K':
                        case 's':
                        case 'u':
                            break;
                    }
                }
            }
            else if (code === 13) {
                cursorX = 0;
                i++;
            }
            else if (code === 10) {
                cursorY++;
                cursorX = 0;
                i++;
            }
            else if (code === 9) {
                cursorX = Math.min(width - 1, (Math.floor(cursorX / 8) + 1) * 8);
                i++;
            }
            else {
                if (cursorY < maxHeight && cursorX < width) {
                    cells[cursorY][cursorX] = { char: ch, attr: currentAttr };
                    if (cursorY > maxY)
                        maxY = cursorY;
                }
                cursorX++;
                if (cursorX >= width) {
                    cursorX = 0;
                    cursorY++;
                }
                i++;
            }
        }
        var actualHeight = maxY + 1;
        cells.length = actualHeight;
        return {
            width: width,
            height: actualHeight,
            cells: cells
        };
    };
    ANSILoader.parseSGR = function (params, currentAttr) {
        var fg = currentAttr & 0x0F;
        var bg = (currentAttr >> 4) & 0x0F;
        var bold = false;
        if (params.length === 0) {
            params = [0];
        }
        for (var i = 0; i < params.length; i++) {
            var p = params[i];
            if (p === 0) {
                fg = LIGHTGRAY;
                bg = 0;
                bold = false;
            }
            else if (p === 1) {
                bold = true;
                if (fg < 8)
                    fg += 8;
            }
            else if (p === 2 || p === 22) {
                bold = false;
                if (fg >= 8)
                    fg -= 8;
            }
            else if (p >= 30 && p <= 37) {
                fg = p - 30;
                if (bold)
                    fg += 8;
            }
            else if (p === 39) {
                fg = bold ? WHITE : LIGHTGRAY;
            }
            else if (p >= 40 && p <= 47) {
                bg = p - 40;
            }
            else if (p === 49) {
                bg = 0;
            }
            else if (p >= 90 && p <= 97) {
                fg = (p - 90) + 8;
            }
            else if (p >= 100 && p <= 107) {
                bg = (p - 100) + 8;
            }
        }
        return makeAttr(fg, bg << 4);
    };
    ANSILoader.defaultDirectory = '/sbbs/text/futureland';
    return ANSILoader;
}());
