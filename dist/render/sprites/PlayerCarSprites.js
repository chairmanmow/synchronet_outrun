"use strict";
var PLAYER_CAR_SPRITE_CACHE = {};
function createPlayerSportsCarSprite(config) {
    var body = makeAttr(config.bodyColor, BG_BLACK);
    var trim = makeAttr(config.trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var brakeLightAttr = config.brakeLightsOn ? makeAttr(config.bodyColor, BG_RED) : body;
    var brakeLightChar = config.brakeLightsOn ? GLYPH.UPPER_HALF : GLYPH.FULL_BLOCK;
    var U = null;
    return {
        name: 'player_sports',
        brakeLightCells: [{ row: 1, col: 0 }, { row: 1, col: 4 }],
        variants: [
            [
                [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                [{ char: brakeLightChar, attr: brakeLightAttr }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: brakeLightChar, attr: brakeLightAttr }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createMuscleCarSprite(config) {
    var body = makeAttr(config.bodyColor, BG_BLACK);
    var trim = makeAttr(config.trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var brakeLightAttr = config.brakeLightsOn ? makeAttr(config.bodyColor, BG_RED) : body;
    var brakeLightChar = config.brakeLightsOn ? GLYPH.UPPER_HALF : GLYPH.FULL_BLOCK;
    var U = null;
    return {
        name: 'player_muscle',
        brakeLightCells: [{ row: 1, col: 0 }, { row: 1, col: 4 }],
        variants: [
            [
                [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                [{ char: brakeLightChar, attr: brakeLightAttr }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: brakeLightChar, attr: brakeLightAttr }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createCompactCarSprite(config) {
    var body = makeAttr(config.bodyColor, BG_BLACK);
    var trim = makeAttr(config.trimColor, BG_BLACK);
    var wheel = makeAttr(DARKGRAY, BG_BLACK);
    var brakeLightAttr = config.brakeLightsOn ? makeAttr(config.bodyColor, BG_RED) : body;
    var brakeLightChar = config.brakeLightsOn ? GLYPH.UPPER_HALF : GLYPH.FULL_BLOCK;
    var U = null;
    return {
        name: 'player_compact',
        brakeLightCells: [{ row: 1, col: 0 }, { row: 1, col: 4 }],
        variants: [
            [
                [U, { char: GLYPH.UPPER_HALF, attr: trim }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: trim }, U],
                [{ char: brakeLightChar, attr: brakeLightAttr }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: brakeLightChar, attr: brakeLightAttr }],
                [{ char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheel }, { char: GLYPH.LOWER_HALF, attr: wheel }]
            ]
        ]
    };
}
function createSuperCarSprite(config) {
    var body = makeAttr(config.bodyColor, BG_BLACK);
    var trim = makeAttr(config.trimColor, BG_BLACK);
    var wheelWell = makeAttr(DARKGRAY, BG_BLACK);
    var brakeLightAttr = config.brakeLightsOn ? makeAttr(config.bodyColor, BG_RED) : body;
    var brakeLightChar = config.brakeLightsOn ? GLYPH.UPPER_HALF : GLYPH.FULL_BLOCK;
    var U = null;
    return {
        name: 'player_super',
        brakeLightCells: [{ row: 1, col: 0 }, { row: 1, col: 4 }],
        variants: [
            [
                [U, { char: GLYPH.UPPER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: body }, U],
                [{ char: brakeLightChar, attr: brakeLightAttr }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: brakeLightChar, attr: brakeLightAttr }],
                [{ char: GLYPH.LOWER_HALF, attr: wheelWell }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: wheelWell }]
            ]
        ]
    };
}
function createClassicCarSprite(config) {
    var body = makeAttr(config.bodyColor, BG_BLACK);
    var trim = makeAttr(config.trimColor, BG_BLACK);
    var chrome = makeAttr(LIGHTGRAY, BG_BLACK);
    var brakeLightAttr = config.brakeLightsOn ? makeAttr(config.bodyColor, BG_RED) : body;
    var brakeLightChar = config.brakeLightsOn ? GLYPH.UPPER_HALF : GLYPH.FULL_BLOCK;
    var U = null;
    return {
        name: 'player_classic',
        brakeLightCells: [{ row: 1, col: 0 }, { row: 1, col: 4 }],
        variants: [
            [
                [U, { char: GLYPH.UPPER_HALF, attr: body }, { char: GLYPH.FULL_BLOCK, attr: trim }, { char: GLYPH.UPPER_HALF, attr: body }, U],
                [{ char: brakeLightChar, attr: brakeLightAttr }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: GLYPH.FULL_BLOCK, attr: chrome }, { char: GLYPH.FULL_BLOCK, attr: body }, { char: brakeLightChar, attr: brakeLightAttr }],
                [{ char: GLYPH.LOWER_HALF, attr: chrome }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: chrome }, { char: GLYPH.LOWER_HALF, attr: body }, { char: GLYPH.LOWER_HALF, attr: chrome }]
            ]
        ]
    };
}
function getPlayerCarSprite(bodyStyle, colorId, brakeLightsOn) {
    var key = bodyStyle + '_' + colorId + '_' + (brakeLightsOn ? 'brake' : 'normal');
    if (!PLAYER_CAR_SPRITE_CACHE[key]) {
        var color = getCarColor(colorId);
        if (!color) {
            color = CAR_COLORS['yellow'];
        }
        var config = {
            bodyColor: color.body,
            trimColor: color.trim,
            brakeLightsOn: brakeLightsOn
        };
        switch (bodyStyle) {
            case 'muscle':
                PLAYER_CAR_SPRITE_CACHE[key] = createMuscleCarSprite(config);
                break;
            case 'compact':
                PLAYER_CAR_SPRITE_CACHE[key] = createCompactCarSprite(config);
                break;
            case 'super':
                PLAYER_CAR_SPRITE_CACHE[key] = createSuperCarSprite(config);
                break;
            case 'classic':
                PLAYER_CAR_SPRITE_CACHE[key] = createClassicCarSprite(config);
                break;
            case 'sports':
            default:
                PLAYER_CAR_SPRITE_CACHE[key] = createPlayerSportsCarSprite(config);
                break;
        }
    }
    return PLAYER_CAR_SPRITE_CACHE[key];
}
function clearPlayerCarSpriteCache() {
    PLAYER_CAR_SPRITE_CACHE = {};
}
function createCarPreviewSprite(bodyStyle, colorId) {
    return getPlayerCarSprite(bodyStyle, colorId, false);
}
