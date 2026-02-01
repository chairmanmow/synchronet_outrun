"use strict";
var CitySprites = {
    createBuilding: function () {
        var wall = makeAttr(DARKGRAY, BG_BLACK);
        var window = makeAttr(YELLOW, BG_BLACK);
        var windowDark = makeAttr(DARKGRAY, BG_BLACK);
        var roof = makeAttr(LIGHTGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'building',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: roof }, { char: GLYPH.FULL_BLOCK, attr: roof }, { char: GLYPH.UPPER_HALF, attr: roof }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: window }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: '.', attr: windowDark }, { char: GLYPH.FULL_BLOCK, attr: wall }],
                    [{ char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }, { char: GLYPH.FULL_BLOCK, attr: wall }]
                ]
            ]
        };
    },
    createLamppost: function () {
        var pole = makeAttr(DARKGRAY, BG_BLACK);
        var light = makeAttr(YELLOW, BG_BLACK);
        var lightBright = makeAttr(WHITE, BG_BLACK);
        var U = null;
        return {
            name: 'lamppost',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: light }]
                ],
                [
                    [{ char: '*', attr: light }],
                    [{ char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: '*', attr: lightBright }, { char: '*', attr: light }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: light }, { char: '*', attr: lightBright }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: light }, { char: '*', attr: lightBright }, { char: GLYPH.DARK_SHADE, attr: light }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U]
                ]
            ]
        };
    },
    createSign: function () {
        var sign = makeAttr(GREEN, BG_BLACK);
        var signBright = makeAttr(LIGHTGREEN, BG_BLACK);
        var text = makeAttr(WHITE, BG_GREEN);
        var pole = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'sign',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [U, { char: GLYPH.BOX_V, attr: pole }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: '-', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, U]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: 'E', attr: text }, { char: 'X', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [{ char: GLYPH.FULL_BLOCK, attr: signBright }, { char: 'I', attr: text }, { char: 'T', attr: text }, { char: GLYPH.FULL_BLOCK, attr: signBright }],
                    [U, { char: GLYPH.BOX_V, attr: pole }, { char: GLYPH.BOX_V, attr: pole }, U]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: sign }, { char: 'E', attr: text }, { char: 'X', attr: text }, { char: 'I', attr: text }, { char: GLYPH.FULL_BLOCK, attr: sign }],
                    [{ char: GLYPH.FULL_BLOCK, attr: signBright }, { char: ' ', attr: text }, { char: '1', attr: text }, { char: ' ', attr: text }, { char: GLYPH.FULL_BLOCK, attr: signBright }],
                    [U, U, { char: GLYPH.BOX_V, attr: pole }, U, U]
                ]
            ]
        };
    }
};
registerRoadsideSprite('building', CitySprites.createBuilding);
registerRoadsideSprite('lamppost', CitySprites.createLamppost);
registerRoadsideSprite('sign', CitySprites.createSign);
