# Glyph Data

This directory contains CP437 glyph mappings and character set references.

## CP437 Overview

Code Page 437 provides 256 characters including:
- ASCII printable (0x20-0x7E)
- Box-drawing characters
- Block elements (shading)
- Mathematical symbols
- Greek letters
- Card suits
- Various line-art pieces

## Key Glyphs for Racing Game

### Block Elements (Shading/Fill)
```
░ (0xB0) - Light shade (25%)
▒ (0xB1) - Medium shade (50%)
▓ (0xB2) - Dark shade (75%)
█ (0xDB) - Full block
▄ (0xDC) - Lower half block
▀ (0xDF) - Upper half block
▌ (0xDD) - Left half block
▐ (0xDE) - Right half block
```

### Box Drawing (UI Borders)
```
┌ ┐ └ ┘  - Single corners
├ ┤ ┬ ┴  - Single T-junctions
─ │      - Single lines
═ ║      - Double lines
╔ ╗ ╚ ╝  - Double corners
```

### Useful Symbols
```
► ◄ ▲ ▼  - Arrows/triangles
● ○      - Circles
♠ ♣ ♥ ♦  - Card suits
☼ ☺ ☻    - Faces/sun
« »      - Guillemets
```

## Usage

Glyphs are referenced by their constant names in `src/render/cp437/GlyphAtlas.ts`.

Example:
```typescript
GLYPH.FULL_BLOCK    // █ (0xDB)
GLYPH.LOWER_HALF    // ▄ (0xDC)
GLYPH.LIGHT_SHADE   // ░ (0xB0)
```

## References

- [Wikipedia: Code Page 437](https://en.wikipedia.org/wiki/Code_page_437)
- [docs/02-rendering-cp437.md](../../docs/02-rendering-cp437.md)
