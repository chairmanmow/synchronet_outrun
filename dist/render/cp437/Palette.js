"use strict";
var PALETTE = {
    SKY_TOP: { fg: MAGENTA, bg: BG_BLACK },
    SKY_MID: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SKY_HORIZON: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SKY_GRID: { fg: MAGENTA, bg: BG_BLACK },
    SKY_GRID_GLOW: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    SUN_CORE: { fg: YELLOW, bg: BG_RED },
    SUN_GLOW: { fg: LIGHTRED, bg: BG_BLACK },
    MOUNTAIN: { fg: MAGENTA, bg: BG_BLACK },
    MOUNTAIN_HIGHLIGHT: { fg: LIGHTMAGENTA, bg: BG_BLACK },
    GRID_LINE: { fg: CYAN, bg: BG_BLACK },
    GRID_GLOW: { fg: LIGHTCYAN, bg: BG_BLACK },
    ROAD_LIGHT: { fg: LIGHTCYAN, bg: BG_BLACK },
    ROAD_DARK: { fg: CYAN, bg: BG_BLACK },
    ROAD_STRIPE: { fg: WHITE, bg: BG_BLACK },
    ROAD_EDGE: { fg: LIGHTRED, bg: BG_BLACK },
    ROAD_GRID: { fg: CYAN, bg: BG_BLACK },
    OFFROAD_GRASS: { fg: GREEN, bg: BG_BLACK },
    OFFROAD_DIRT: { fg: BROWN, bg: BG_BLACK },
    OFFROAD_ROCK: { fg: DARKGRAY, bg: BG_BLACK },
    OFFROAD_TREE: { fg: LIGHTGREEN, bg: BG_BLACK },
    OFFROAD_TREE_TRUNK: { fg: BROWN, bg: BG_BLACK },
    OFFROAD_CACTUS: { fg: GREEN, bg: BG_BLACK },
    PLAYER_BODY: { fg: YELLOW, bg: BG_BLACK },
    PLAYER_TRIM: { fg: WHITE, bg: BG_BLACK },
    ENEMY_BODY: { fg: LIGHTCYAN, bg: BG_BLACK },
    HUD_FRAME: { fg: LIGHTCYAN, bg: BG_BLACK },
    HUD_TEXT: { fg: WHITE, bg: BG_BLACK },
    HUD_VALUE: { fg: YELLOW, bg: BG_BLACK },
    HUD_LABEL: { fg: LIGHTGRAY, bg: BG_BLACK },
    ITEM_BOX: { fg: YELLOW, bg: BG_BLACK },
    ITEM_MUSHROOM: { fg: LIGHTRED, bg: BG_BLACK },
    ITEM_SHELL: { fg: LIGHTGREEN, bg: BG_BLACK }
};
function makeAttr(fg, bg) {
    return fg | bg;
}
function getFg(attr) {
    return attr & 0x0F;
}
function getBg(attr) {
    return attr & 0xF0;
}
function colorToAttr(color) {
    return color.fg | color.bg;
}
