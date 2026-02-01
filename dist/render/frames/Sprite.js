"use strict";
var SpriteSheet = {
    createTree: function () {
        var leafTop = makeAttr(LIGHTGREEN, BG_BLACK);
        var leafDark = makeAttr(GREEN, BG_BLACK);
        var trunk = makeAttr(BROWN, BG_BLACK);
        var leafTrunk = makeAttr(LIGHTGREEN, BG_BROWN);
        var U = null;
        return {
            name: 'tree',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafTrunk }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [U, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }],
                    [U, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, { char: GLYPH.UPPER_HALF, attr: leafTrunk }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }],
                    [U, { char: GLYPH.LOWER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.LOWER_HALF, attr: leafDark }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, U, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.UPPER_HALF, attr: leafDark }],
                    [{ char: GLYPH.FULL_BLOCK, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafDark }],
                    [U, { char: GLYPH.DARK_SHADE, attr: leafDark }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.FULL_BLOCK, attr: leafTop }, { char: GLYPH.DARK_SHADE, attr: leafDark }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, { char: GLYPH.FULL_BLOCK, attr: trunk }, U, U],
                    [U, U, { char: GLYPH.UPPER_HALF, attr: trunk }, { char: GLYPH.UPPER_HALF, attr: trunk }, U, U]
                ]
            ]
        };
    },
    createRock: function () {
        var rock = makeAttr(DARKGRAY, BG_BLACK);
        var rockLight = makeAttr(LIGHTGRAY, BG_BLACK);
        return {
            name: 'rock',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rock }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rockLight }, { char: GLYPH.UPPER_HALF, attr: rock }, { char: GLYPH.UPPER_HALF, attr: rock }],
                    [{ char: GLYPH.LOWER_HALF, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rockLight }, { char: GLYPH.FULL_BLOCK, attr: rock }, { char: GLYPH.LOWER_HALF, attr: rock }]
                ]
            ]
        };
    },
    createBush: function () {
        var bush = makeAttr(GREEN, BG_BLACK);
        var bushLight = makeAttr(LIGHTGREEN, BG_BLACK);
        var U = null;
        return {
            name: 'bush',
            variants: [
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bush }, U],
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bushLight }, { char: GLYPH.UPPER_HALF, attr: bush }, { char: GLYPH.UPPER_HALF, attr: bush }],
                    [{ char: GLYPH.LOWER_HALF, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bushLight }, { char: GLYPH.FULL_BLOCK, attr: bush }, { char: GLYPH.LOWER_HALF, attr: bush }]
                ]
            ]
        };
    },
    createPlayerCar: function () {
        var body = makeAttr(YELLOW, BG_BLACK);
        var trim = makeAttr(WHITE, BG_BLACK);
        var wheel = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'player_car',
            variants: [
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }],
                    [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
                ]
            ]
        };
    },
    createAICar: function (color) {
        var body = makeAttr(color, BG_BLACK);
        var trim = makeAttr(WHITE, BG_BLACK);
        var wheel = makeAttr(DARKGRAY, BG_BLACK);
        var U = null;
        return {
            name: 'ai_car',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }],
                    [{ char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                    [{ char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }],
                    [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
                ]
            ]
        };
    }
};
function renderSpriteToFrame(frame, sprite, scaleIndex) {
    var variant = sprite.variants[scaleIndex];
    if (!variant) {
        variant = sprite.variants[sprite.variants.length - 1];
    }
    frame.clear();
    for (var row = 0; row < variant.length; row++) {
        for (var col = 0; col < variant[row].length; col++) {
            var cell = variant[row][col];
            if (cell !== null && cell !== undefined) {
                frame.setData(col, row, cell.char, cell.attr);
            }
        }
    }
}
function getSpriteSize(sprite, scaleIndex) {
    var variant = sprite.variants[scaleIndex];
    if (!variant) {
        variant = sprite.variants[sprite.variants.length - 1];
    }
    var height = variant.length;
    var width = 0;
    for (var row = 0; row < variant.length; row++) {
        if (variant[row].length > width) {
            width = variant[row].length;
        }
    }
    return { width: width, height: height };
}
registerRoadsideSprite('tree', SpriteSheet.createTree);
registerRoadsideSprite('rock', SpriteSheet.createRock);
registerRoadsideSprite('bush', SpriteSheet.createBush);
