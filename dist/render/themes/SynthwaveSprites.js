"use strict";
var SynthwaveSprites = {
    createNeonPillar: function () {
        var neonCyan = makeAttr(LIGHTCYAN, BG_BLACK);
        var neonMagenta = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var glowCyan = makeAttr(CYAN, BG_BLACK);
        var glowMagenta = makeAttr(MAGENTA, BG_BLACK);
        var base = makeAttr(BLUE, BG_BLACK);
        var U = null;
        return {
            name: 'neon_pillar',
            variants: [
                [
                    [{ char: GLYPH.BOX_V, attr: neonCyan }]
                ],
                [
                    [{ char: GLYPH.BOX_V, attr: neonCyan }],
                    [{ char: GLYPH.BOX_V, attr: neonMagenta }]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: neonCyan }, { char: GLYPH.UPPER_HALF, attr: glowCyan }],
                    [{ char: GLYPH.FULL_BLOCK, attr: neonMagenta }, { char: GLYPH.DARK_SHADE, attr: glowMagenta }],
                    [{ char: GLYPH.LOWER_HALF, attr: base }, { char: GLYPH.LOWER_HALF, attr: base }]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: neonCyan }, U],
                    [{ char: GLYPH.DARK_SHADE, attr: glowCyan }, { char: GLYPH.FULL_BLOCK, attr: neonCyan }, { char: GLYPH.DARK_SHADE, attr: glowCyan }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowMagenta }, { char: GLYPH.FULL_BLOCK, attr: neonMagenta }, { char: GLYPH.DARK_SHADE, attr: glowMagenta }],
                    [U, { char: GLYPH.LOWER_HALF, attr: base }, U]
                ],
                [
                    [U, { char: GLYPH.UPPER_HALF, attr: neonCyan }, U],
                    [{ char: GLYPH.DARK_SHADE, attr: glowCyan }, { char: GLYPH.FULL_BLOCK, attr: neonCyan }, { char: GLYPH.DARK_SHADE, attr: glowCyan }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowCyan }, { char: GLYPH.FULL_BLOCK, attr: neonCyan }, { char: GLYPH.DARK_SHADE, attr: glowCyan }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowMagenta }, { char: GLYPH.FULL_BLOCK, attr: neonMagenta }, { char: GLYPH.DARK_SHADE, attr: glowMagenta }],
                    [U, { char: GLYPH.LOWER_HALF, attr: base }, U]
                ]
            ]
        };
    },
    createGridPylon: function () {
        var frame = makeAttr(MAGENTA, BG_BLACK);
        var frameBright = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var accent = makeAttr(CYAN, BG_BLACK);
        var accentBright = makeAttr(LIGHTCYAN, BG_BLACK);
        var U = null;
        return {
            name: 'grid_pylon',
            variants: [
                [
                    [{ char: GLYPH.TRIANGLE_UP, attr: frame }]
                ],
                [
                    [{ char: GLYPH.TRIANGLE_UP, attr: frameBright }],
                    [{ char: GLYPH.BOX_V, attr: frame }]
                ],
                [
                    [U, { char: GLYPH.TRIANGLE_UP, attr: accentBright }, U],
                    [{ char: '/', attr: frame }, { char: GLYPH.BOX_V, attr: frameBright }, { char: '\\', attr: frame }],
                    [{ char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_CROSS, attr: accentBright }, { char: GLYPH.BOX_H, attr: accent }]
                ],
                [
                    [U, { char: GLYPH.TRIANGLE_UP, attr: accentBright }, U],
                    [{ char: '/', attr: frame }, { char: GLYPH.BOX_V, attr: frameBright }, { char: '\\', attr: frame }],
                    [{ char: GLYPH.BOX_V, attr: frame }, { char: GLYPH.BOX_V, attr: frameBright }, { char: GLYPH.BOX_V, attr: frame }],
                    [{ char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_CROSS, attr: accentBright }, { char: GLYPH.BOX_H, attr: accent }]
                ],
                [
                    [U, U, { char: GLYPH.TRIANGLE_UP, attr: accentBright }, U, U],
                    [U, { char: '/', attr: frameBright }, { char: GLYPH.BOX_V, attr: frameBright }, { char: '\\', attr: frameBright }, U],
                    [{ char: '/', attr: frame }, { char: ' ', attr: frame }, { char: GLYPH.BOX_V, attr: frameBright }, { char: ' ', attr: frame }, { char: '\\', attr: frame }],
                    [{ char: GLYPH.BOX_V, attr: frame }, { char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_CROSS, attr: accentBright }, { char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_V, attr: frame }],
                    [{ char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_CROSS, attr: accentBright }, { char: GLYPH.BOX_H, attr: accent }, { char: GLYPH.BOX_H, attr: accent }]
                ]
            ]
        };
    },
    createHoloBillboard: function () {
        var border = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var borderDim = makeAttr(MAGENTA, BG_BLACK);
        var text = makeAttr(LIGHTCYAN, BG_BLACK);
        var support = makeAttr(BLUE, BG_BLACK);
        var U = null;
        return {
            name: 'holo_billboard',
            variants: [
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: border }, { char: GLYPH.FULL_BLOCK, attr: borderDim }]
                ],
                [
                    [{ char: GLYPH.FULL_BLOCK, attr: border }, { char: '-', attr: text }, { char: GLYPH.FULL_BLOCK, attr: borderDim }],
                    [U, { char: GLYPH.BOX_V, attr: support }, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.UPPER_HALF, attr: borderDim }],
                    [{ char: GLYPH.BOX_V, attr: border }, { char: 'N', attr: text }, { char: 'E', attr: text }, { char: 'O', attr: text }, { char: GLYPH.BOX_V, attr: borderDim }],
                    [U, U, { char: GLYPH.BOX_V, attr: support }, U, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.UPPER_HALF, attr: borderDim }],
                    [{ char: GLYPH.BOX_V, attr: border }, { char: 'N', attr: text }, { char: 'E', attr: text }, { char: 'O', attr: text }, { char: 'N', attr: text }, { char: GLYPH.BOX_V, attr: borderDim }],
                    [{ char: GLYPH.LOWER_HALF, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.LOWER_HALF, attr: borderDim }],
                    [U, U, { char: GLYPH.BOX_V, attr: support }, { char: GLYPH.BOX_V, attr: support }, U, U]
                ],
                [
                    [{ char: GLYPH.UPPER_HALF, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.BOX_H, attr: border }, { char: GLYPH.UPPER_HALF, attr: borderDim }],
                    [{ char: GLYPH.BOX_V, attr: border }, { char: ' ', attr: text }, { char: 'N', attr: text }, { char: 'E', attr: text }, { char: 'O', attr: text }, { char: ' ', attr: text }, { char: GLYPH.BOX_V, attr: borderDim }],
                    [{ char: GLYPH.BOX_V, attr: border }, { char: ' ', attr: text }, { char: '8', attr: text }, { char: '0', attr: text }, { char: 's', attr: text }, { char: ' ', attr: text }, { char: GLYPH.BOX_V, attr: borderDim }],
                    [{ char: GLYPH.LOWER_HALF, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.BOX_H, attr: borderDim }, { char: GLYPH.LOWER_HALF, attr: borderDim }],
                    [U, U, { char: GLYPH.BOX_V, attr: support }, U, { char: GLYPH.BOX_V, attr: support }, U, U]
                ]
            ]
        };
    },
    createNeonPalm: function () {
        var trunk = makeAttr(MAGENTA, BG_BLACK);
        var trunkBright = makeAttr(LIGHTMAGENTA, BG_BLACK);
        var frond = makeAttr(CYAN, BG_BLACK);
        var frondBright = makeAttr(LIGHTCYAN, BG_BLACK);
        var glow = makeAttr(BLUE, BG_BLACK);
        var U = null;
        return {
            name: 'neon_palm',
            variants: [
                [
                    [{ char: GLYPH.UPPER_HALF, attr: frondBright }]
                ],
                [
                    [{ char: '/', attr: frond }, { char: '\\', attr: frond }],
                    [U, { char: GLYPH.BOX_V, attr: trunk }]
                ],
                [
                    [{ char: '/', attr: frondBright }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: '\\', attr: frondBright }],
                    [U, { char: '\\', attr: frond }, { char: '/', attr: frond }, U],
                    [U, { char: GLYPH.BOX_V, attr: trunk }, { char: GLYPH.BOX_V, attr: trunkBright }, U]
                ],
                [
                    [{ char: '-', attr: glow }, { char: '/', attr: frondBright }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: '\\', attr: frondBright }, { char: '-', attr: glow }],
                    [U, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: '*', attr: frondBright }, { char: GLYPH.FULL_BLOCK, attr: frond }, U],
                    [U, { char: '/', attr: frond }, { char: GLYPH.BOX_V, attr: trunkBright }, { char: '\\', attr: frond }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, U, U]
                ],
                [
                    [{ char: '-', attr: glow }, { char: '/', attr: frondBright }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: '\\', attr: frondBright }, { char: '-', attr: glow }],
                    [{ char: '/', attr: frond }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: ' ', attr: frond }, { char: '*', attr: frondBright }, { char: GLYPH.FULL_BLOCK, attr: frond }, { char: '\\', attr: frond }],
                    [U, { char: '\\', attr: frond }, { char: '/', attr: frond }, { char: '\\', attr: frond }, { char: '/', attr: frond }, U],
                    [U, U, { char: GLYPH.FULL_BLOCK, attr: trunk }, { char: GLYPH.FULL_BLOCK, attr: trunkBright }, U, U],
                    [U, U, { char: GLYPH.LOWER_HALF, attr: trunk }, { char: GLYPH.LOWER_HALF, attr: trunk }, U, U]
                ]
            ]
        };
    },
    createLaserBeam: function () {
        var beamCore = makeAttr(WHITE, BG_BLACK);
        var beamMid = makeAttr(LIGHTCYAN, BG_BLACK);
        var beamOuter = makeAttr(CYAN, BG_BLACK);
        var glowDim = makeAttr(BLUE, BG_BLACK);
        return {
            name: 'laser_beam',
            variants: [
                [
                    [{ char: GLYPH.BOX_V, attr: beamMid }]
                ],
                [
                    [{ char: GLYPH.BOX_V, attr: beamCore }],
                    [{ char: GLYPH.BOX_V, attr: beamMid }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamMid }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamMid }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamMid }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }]
                ],
                [
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamMid }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamCore }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.LIGHT_SHADE, attr: beamOuter }, { char: GLYPH.FULL_BLOCK, attr: beamMid }, { char: GLYPH.LIGHT_SHADE, attr: beamOuter }],
                    [{ char: GLYPH.DARK_SHADE, attr: glowDim }, { char: GLYPH.BOX_V, attr: beamCore }, { char: GLYPH.DARK_SHADE, attr: glowDim }]
                ]
            ]
        };
    }
};
registerRoadsideSprite('neon_pillar', SynthwaveSprites.createNeonPillar);
registerRoadsideSprite('grid_pylon', SynthwaveSprites.createGridPylon);
registerRoadsideSprite('holo_billboard', SynthwaveSprites.createHoloBillboard);
registerRoadsideSprite('neon_palm', SynthwaveSprites.createNeonPalm);
registerRoadsideSprite('laser_beam', SynthwaveSprites.createLaserBeam);
