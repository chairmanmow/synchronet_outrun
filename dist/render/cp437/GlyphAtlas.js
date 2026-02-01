"use strict";
var GLYPH = {
    FULL_BLOCK: String.fromCharCode(219),
    LOWER_HALF: String.fromCharCode(220),
    UPPER_HALF: String.fromCharCode(223),
    LEFT_HALF: String.fromCharCode(221),
    RIGHT_HALF: String.fromCharCode(222),
    LIGHT_SHADE: String.fromCharCode(176),
    MEDIUM_SHADE: String.fromCharCode(177),
    DARK_SHADE: String.fromCharCode(178),
    BOX_H: String.fromCharCode(196),
    BOX_V: String.fromCharCode(179),
    BOX_TL: String.fromCharCode(218),
    BOX_TR: String.fromCharCode(191),
    BOX_BL: String.fromCharCode(192),
    BOX_BR: String.fromCharCode(217),
    BOX_VR: String.fromCharCode(195),
    BOX_VL: String.fromCharCode(180),
    BOX_HD: String.fromCharCode(194),
    BOX_HU: String.fromCharCode(193),
    BOX_CROSS: String.fromCharCode(197),
    DBOX_H: String.fromCharCode(205),
    DBOX_V: String.fromCharCode(186),
    DBOX_TL: String.fromCharCode(201),
    DBOX_TR: String.fromCharCode(187),
    DBOX_BL: String.fromCharCode(200),
    DBOX_BR: String.fromCharCode(188),
    DBOX_VR: String.fromCharCode(204),
    DBOX_VL: String.fromCharCode(185),
    DBOX_HD: String.fromCharCode(203),
    DBOX_HU: String.fromCharCode(202),
    DBOX_CROSS: String.fromCharCode(206),
    BOX_VD_HD: String.fromCharCode(209),
    BOX_VD_HU: String.fromCharCode(207),
    TRIANGLE_UP: String.fromCharCode(30),
    TRIANGLE_DOWN: String.fromCharCode(31),
    TRIANGLE_LEFT: String.fromCharCode(17),
    TRIANGLE_RIGHT: String.fromCharCode(16),
    DIAMOND: String.fromCharCode(4),
    BULLET: String.fromCharCode(7),
    CIRCLE: String.fromCharCode(9),
    INVERSE_BULLET: String.fromCharCode(8),
    SPACE: ' ',
    DOT: String.fromCharCode(250),
    SLASH: '/',
    BACKSLASH: '\\',
    EQUALS: '=',
    ASTERISK: '*',
    TREE_TOP: String.fromCharCode(6),
    TREE_TRUNK: String.fromCharCode(179),
    ROCK: String.fromCharCode(178),
    GRASS: String.fromCharCode(176),
    CACTUS: String.fromCharCode(157),
    MOUNTAIN_PEAK: '/',
    MOUNTAIN_SLOPE: '\\',
    CHECKER: String.fromCharCode(177),
    FLAG: String.fromCharCode(16)
};
function getShadeGlyph(intensity) {
    if (intensity >= 0.75)
        return GLYPH.FULL_BLOCK;
    if (intensity >= 0.5)
        return GLYPH.DARK_SHADE;
    if (intensity >= 0.25)
        return GLYPH.MEDIUM_SHADE;
    return GLYPH.LIGHT_SHADE;
}
function getBarGlyph(fill) {
    if (fill >= 0.875)
        return GLYPH.FULL_BLOCK;
    if (fill >= 0.625)
        return GLYPH.DARK_SHADE;
    if (fill >= 0.375)
        return GLYPH.MEDIUM_SHADE;
    if (fill >= 0.125)
        return GLYPH.LIGHT_SHADE;
    return GLYPH.SPACE;
}
