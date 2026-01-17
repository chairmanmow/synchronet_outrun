# Sprite Data

This directory contains sprite definitions for vehicles and items.

## Format

Sprites are defined inline in TypeScript for Iteration 0-2.

Future iterations may externalize sprites to JSON files here.

## Planned Sprites

### Vehicles
- Player car (multiple colors)
- CPU cars (8 variants)

### Items
- Item box (animated cycling)
- Mushroom (boost)
- Green shell
- Red shell
- Banana
- Star

### Scenery
- Palm tree (2 sizes)
- Lamppost
- Billboard (3 variants)
- Building silhouette

## CP437 Constraints

All sprites must use only:
- CP437 character set (256 glyphs)
- 16 ANSI colors (8 base + 8 bright)
- Maximum dimensions for performance

See [docs/02-rendering-cp437.md](../../docs/02-rendering-cp437.md) for details.
