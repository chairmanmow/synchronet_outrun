"use strict";
var UnderwaterSprites = {
    createFish: function () {
        var body1 = makeAttr(YELLOW, BG_BLUE);
        var body2 = makeAttr(LIGHTCYAN, BG_BLUE);
        var eye = makeAttr(WHITE, BG_BLUE);
        var fin = makeAttr(LIGHTRED, BG_BLUE);
        var stripe = makeAttr(WHITE, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_fish',
            variants: [
                [
                    [{ char: '<', attr: body1 }, { char: '>', attr: body1 }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: fin }, U],
                    [{ char: '<', attr: body2 }, { char: GLYPH.FULL_BLOCK, attr: body2 }, { char: '>', attr: body2 }]
                ],
                [
                    [U, { char: '/', attr: fin }, { char: GLYPH.UPPER_HALF, attr: fin }, { char: '\\', attr: fin }, U],
                    [{ char: '<', attr: body1 }, { char: GLYPH.FULL_BLOCK, attr: body1 }, { char: '|', attr: stripe }, { char: 'O', attr: eye }, { char: '>', attr: body1 }],
                    [U, { char: '\\', attr: fin }, { char: GLYPH.LOWER_HALF, attr: fin }, { char: '/', attr: fin }, U]
                ],
                [
                    [U, U, { char: '/', attr: fin }, { char: GLYPH.FULL_BLOCK, attr: fin }, { char: '\\', attr: fin }, U],
                    [{ char: '<', attr: body2 }, { char: '<', attr: body2 }, { char: GLYPH.FULL_BLOCK, attr: body2 }, { char: '|', attr: stripe }, { char: 'O', attr: eye }, { char: '>', attr: body2 }],
                    [U, U, { char: '\\', attr: fin }, { char: GLYPH.FULL_BLOCK, attr: fin }, { char: '/', attr: fin }, U]
                ],
                [
                    [U, U, { char: '/', attr: fin }, { char: '_', attr: fin }, { char: GLYPH.FULL_BLOCK, attr: fin }, { char: '\\', attr: fin }, U],
                    [{ char: '<', attr: body1 }, { char: '<', attr: body1 }, { char: GLYPH.FULL_BLOCK, attr: body1 }, { char: GLYPH.FULL_BLOCK, attr: body1 }, { char: '|', attr: stripe }, { char: 'O', attr: eye }, { char: '>', attr: body1 }],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: body1 }, { char: GLYPH.FULL_BLOCK, attr: body1 }, { char: '|', attr: stripe }, { char: GLYPH.FULL_BLOCK, attr: body1 }, U],
                    [U, U, { char: '\\', attr: fin }, { char: GLYPH.LOWER_HALF, attr: fin }, { char: GLYPH.FULL_BLOCK, attr: fin }, { char: '/', attr: fin }, U]
                ]
            ]
        };
    },
    createCoral: function () {
        var coral1 = makeAttr(LIGHTRED, BG_BLUE);
        var coral2 = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var coral3 = makeAttr(YELLOW, BG_BLUE);
        var base = makeAttr(DARKGRAY, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_coral',
            variants: [
                [
                    [{ char: '*', attr: coral1 }]
                ],
                [
                    [{ char: 'Y', attr: coral1 }, { char: 'Y', attr: coral2 }],
                    [{ char: '|', attr: base }, { char: '|', attr: base }]
                ],
                [
                    [{ char: '*', attr: coral1 }, { char: '*', attr: coral2 }, { char: '*', attr: coral1 }],
                    [{ char: 'Y', attr: coral1 }, { char: '|', attr: coral2 }, { char: 'Y', attr: coral1 }],
                    [U, { char: '|', attr: base }, U]
                ],
                [
                    [U, { char: '*', attr: coral1 }, { char: '*', attr: coral3 }, U],
                    [{ char: 'Y', attr: coral1 }, { char: '|', attr: coral1 }, { char: '|', attr: coral3 }, { char: 'Y', attr: coral3 }],
                    [{ char: '|', attr: coral1 }, { char: '/', attr: coral1 }, { char: '\\', attr: coral3 }, { char: '|', attr: coral3 }],
                    [U, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, U]
                ],
                [
                    [U, { char: '*', attr: coral1 }, { char: '*', attr: coral2 }, { char: '*', attr: coral3 }, U],
                    [{ char: '*', attr: coral1 }, { char: 'Y', attr: coral1 }, { char: '|', attr: coral2 }, { char: 'Y', attr: coral3 }, { char: '*', attr: coral3 }],
                    [{ char: '|', attr: coral1 }, { char: '/', attr: coral1 }, { char: '|', attr: coral2 }, { char: '\\', attr: coral3 }, { char: '|', attr: coral3 }],
                    [U, { char: '|', attr: base }, { char: '|', attr: base }, { char: '|', attr: base }, U],
                    [U, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, U]
                ]
            ]
        };
    },
    createSeaweed: function () {
        var leaf1 = makeAttr(LIGHTGREEN, BG_BLUE);
        var leaf2 = makeAttr(GREEN, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_seaweed',
            variants: [
                [
                    [{ char: '|', attr: leaf2 }]
                ],
                [
                    [{ char: ')', attr: leaf1 }],
                    [{ char: '|', attr: leaf2 }]
                ],
                [
                    [{ char: '(', attr: leaf1 }, { char: ')', attr: leaf1 }],
                    [{ char: ')', attr: leaf2 }, { char: '(', attr: leaf2 }],
                    [{ char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }]
                ],
                [
                    [U, { char: '~', attr: leaf1 }, U],
                    [{ char: '(', attr: leaf1 }, { char: ')', attr: leaf1 }, { char: '(', attr: leaf1 }],
                    [{ char: ')', attr: leaf2 }, { char: '(', attr: leaf2 }, { char: ')', attr: leaf2 }],
                    [{ char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }]
                ],
                [
                    [U, { char: '~', attr: leaf1 }, { char: '~', attr: leaf1 }, U],
                    [{ char: '(', attr: leaf1 }, { char: ')', attr: leaf1 }, { char: '(', attr: leaf1 }, { char: ')', attr: leaf1 }],
                    [{ char: ')', attr: leaf2 }, { char: '(', attr: leaf2 }, { char: ')', attr: leaf2 }, { char: '(', attr: leaf2 }],
                    [{ char: '(', attr: leaf2 }, { char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }, { char: ')', attr: leaf2 }],
                    [{ char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }, { char: '|', attr: leaf2 }]
                ]
            ]
        };
    },
    createAnemone: function () {
        var tentacle1 = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var tentacle2 = makeAttr(MAGENTA, BG_BLUE);
        var center = makeAttr(YELLOW, BG_BLUE);
        var fish = makeAttr(LIGHTRED, BG_BLUE);
        var base = makeAttr(BROWN, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_anemone',
            variants: [
                [
                    [{ char: '*', attr: tentacle1 }]
                ],
                [
                    [{ char: ')', attr: tentacle1 }, { char: '(', attr: tentacle1 }],
                    [{ char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }]
                ],
                [
                    [{ char: ')', attr: tentacle1 }, { char: '|', attr: tentacle2 }, { char: '(', attr: tentacle1 }],
                    [{ char: '(', attr: tentacle2 }, { char: 'O', attr: center }, { char: ')', attr: tentacle2 }],
                    [U, { char: GLYPH.FULL_BLOCK, attr: base }, U]
                ],
                [
                    [{ char: '~', attr: tentacle1 }, { char: ')', attr: tentacle1 }, { char: '(', attr: tentacle1 }, { char: '~', attr: tentacle1 }],
                    [{ char: ')', attr: tentacle2 }, { char: '|', attr: tentacle2 }, { char: '|', attr: tentacle2 }, { char: '(', attr: tentacle2 }],
                    [{ char: '(', attr: tentacle2 }, { char: GLYPH.FULL_BLOCK, attr: center }, { char: GLYPH.FULL_BLOCK, attr: center }, { char: ')', attr: tentacle2 }],
                    [U, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, U]
                ],
                [
                    [{ char: '~', attr: tentacle1 }, { char: ')', attr: tentacle1 }, { char: '<', attr: fish }, { char: '(', attr: tentacle1 }, { char: '~', attr: tentacle1 }],
                    [{ char: ')', attr: tentacle1 }, { char: '|', attr: tentacle2 }, { char: '>', attr: fish }, { char: '|', attr: tentacle2 }, { char: '(', attr: tentacle1 }],
                    [{ char: '(', attr: tentacle2 }, { char: ')', attr: tentacle2 }, { char: 'O', attr: center }, { char: '(', attr: tentacle2 }, { char: ')', attr: tentacle2 }],
                    [{ char: '|', attr: tentacle2 }, { char: GLYPH.FULL_BLOCK, attr: center }, { char: GLYPH.FULL_BLOCK, attr: center }, { char: GLYPH.FULL_BLOCK, attr: center }, { char: '|', attr: tentacle2 }],
                    [U, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, { char: GLYPH.FULL_BLOCK, attr: base }, U]
                ]
            ]
        };
    },
    createJellyfish: function () {
        var body = makeAttr(LIGHTMAGENTA, BG_BLUE);
        var glow = makeAttr(LIGHTCYAN, BG_BLUE);
        var tent = makeAttr(MAGENTA, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_jellyfish',
            variants: [
                [
                    [{ char: 'n', attr: body }],
                    [{ char: '|', attr: tent }]
                ],
                [
                    [{ char: '/', attr: glow }, { char: '\\', attr: glow }],
                    [{ char: '(', attr: body }, { char: ')', attr: body }],
                    [{ char: '|', attr: tent }, { char: '|', attr: tent }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: glow }, U],
                    [{ char: '/', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: '\\', attr: body }],
                    [{ char: '(', attr: tent }, { char: '~', attr: tent }, { char: ')', attr: tent }],
                    [{ char: '|', attr: tent }, U, { char: '|', attr: tent }]
                ],
                [
                    [U, { char: '_', attr: glow }, { char: '_', attr: glow }, U],
                    [{ char: '/', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: '\\', attr: body }],
                    [{ char: '|', attr: body }, { char: GLYPH.LIGHT_SHADE, attr: glow }, { char: GLYPH.LIGHT_SHADE, attr: glow }, { char: '|', attr: body }],
                    [{ char: '(', attr: tent }, { char: '~', attr: tent }, { char: '~', attr: tent }, { char: ')', attr: tent }],
                    [{ char: '|', attr: tent }, { char: '|', attr: tent }, { char: '|', attr: tent }, { char: '|', attr: tent }]
                ],
                [
                    [U, { char: '_', attr: glow }, { char: '_', attr: glow }, { char: '_', attr: glow }, U],
                    [{ char: '/', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: '\\', attr: body }],
                    [{ char: '|', attr: body }, { char: GLYPH.LIGHT_SHADE, attr: glow }, { char: GLYPH.LIGHT_SHADE, attr: glow }, { char: GLYPH.LIGHT_SHADE, attr: glow }, { char: '|', attr: body }],
                    [{ char: '\\', attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: '/', attr: body }],
                    [{ char: '(', attr: tent }, { char: '~', attr: tent }, { char: '|', attr: tent }, { char: '~', attr: tent }, { char: ')', attr: tent }],
                    [{ char: '|', attr: tent }, U, { char: '|', attr: tent }, U, { char: '|', attr: tent }]
                ]
            ]
        };
    },
    createTreasure: function () {
        var chest = makeAttr(BROWN, BG_BLUE);
        var gold = makeAttr(YELLOW, BG_BLUE);
        var shine = makeAttr(WHITE, BG_BLUE);
        var U = null;
        return {
            name: 'underwater_treasure',
            variants: [
                [
                    [{ char: '#', attr: chest }]
                ],
                [
                    [{ char: '[', attr: chest }, { char: ']', attr: chest }]
                ],
                [
                    [{ char: '$', attr: gold }, { char: '*', attr: shine }, { char: '$', attr: gold }],
                    [{ char: '[', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: ']', attr: chest }]
                ],
                [
                    [U, { char: '$', attr: gold }, { char: '$', attr: gold }, U],
                    [{ char: '/', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: chest }],
                    [{ char: '[', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: ']', attr: chest }]
                ],
                [
                    [U, { char: '$', attr: gold }, { char: '*', attr: shine }, { char: '$', attr: gold }, U],
                    [{ char: '/', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: GLYPH.FULL_BLOCK, attr: gold }, { char: '\\', attr: chest }],
                    [{ char: '[', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: 'O', attr: gold }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: ']', attr: chest }],
                    [{ char: '[', attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: GLYPH.FULL_BLOCK, attr: chest }, { char: ']', attr: chest }]
                ]
            ]
        };
    }
};
registerRoadsideSprite('underwater_fish', function () { return UnderwaterSprites.createFish(); });
registerRoadsideSprite('underwater_coral', function () { return UnderwaterSprites.createCoral(); });
registerRoadsideSprite('underwater_seaweed', function () { return UnderwaterSprites.createSeaweed(); });
registerRoadsideSprite('underwater_anemone', function () { return UnderwaterSprites.createAnemone(); });
registerRoadsideSprite('underwater_jellyfish', function () { return UnderwaterSprites.createJellyfish(); });
registerRoadsideSprite('underwater_treasure', function () { return UnderwaterSprites.createTreasure(); });
