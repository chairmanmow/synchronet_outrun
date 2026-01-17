"use strict";
var ThemeRegistry = {};
var ROADSIDE_SPRITES = {};
function registerTheme(theme) {
    ThemeRegistry[theme.name] = theme;
}
function registerRoadsideSprite(name, creator) {
    ROADSIDE_SPRITES[name] = creator;
}
function getTheme(name) {
    return ThemeRegistry[name] || null;
}
function getThemeNames() {
    var names = [];
    for (var key in ThemeRegistry) {
        if (ThemeRegistry.hasOwnProperty(key)) {
            names.push(key);
        }
    }
    return names;
}
