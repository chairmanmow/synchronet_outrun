# Track Data Format

Tracks are defined as JSON files following the schema documented in [ADR-0003](../../docs/adr/ADR-0003-track-format.md).

## Schema Overview

```json
{
  "name": "Track Display Name",
  "author": "Track Author",
  "version": 1,
  "length": 5000,
  "laps": 3,
  "theme": "neon" | "sunset" | "night" | "beach",

  "centerline": [
    { "x": 0, "y": 0 },
    { "x": 100, "y": 50 },
    ...
  ],

  "checkpoints": [
    { "position": 0, "width": 40 },
    { "position": 1250, "width": 40 },
    ...
  ],

  "scenery": [
    { "type": "palm", "side": "left", "position": 250 },
    { "type": "billboard", "side": "right", "position": 500 },
    ...
  ],

  "items": [
    { "position": 300, "lane": 0 },
    { "position": 600, "lane": 1 },
    ...
  ],

  "spawn": {
    "positions": [
      { "x": 0, "y": 0, "lane": 0 },
      { "x": 0, "y": -10, "lane": 1 },
      ...
    ]
  },

  "palette": {
    "road": 8,
    "stripe": 15,
    "rumble": 6,
    "grass": 2,
    "sky": 3
  }
}
```

## Field Descriptions

### Metadata
- `name` - Display name shown in track selection (string, max 40 chars)
- `author` - Track creator attribution (string)
- `version` - Schema version, currently 1 (integer)
- `length` - Total track length in game units (integer)
- `laps` - Number of laps to complete the race (integer, 1-10)
- `theme` - Visual theme preset (enum)

### Centerline
Array of points defining the track's center path. The pseudo-3D renderer uses this to calculate road curvature. Points should be spaced ~10-20 units apart for smooth curves.

### Checkpoints
Race progression markers. The `position` is distance along centerline, `width` is checkpoint trigger zone width. First checkpoint should be at position 0 (start/finish).

### Scenery
Roadside decorations. Types:
- `palm` - Palm tree silhouette
- `billboard` - Advertisement board
- `lamppost` - Street light
- `cactus` - Desert decoration
- `building` - City skyline element

Side: `left` or `right` of road.

### Items
Item box spawn locations. `lane` is -1 (left), 0 (center), or 1 (right).

### Spawn
Starting grid positions for vehicles. First entry is pole position. Maximum 8 positions.

### Palette
Optional color overrides. Values are ANSI color indices (0-15).

## Files in This Directory

| File | Description |
|------|-------------|
| `neon_coast_01.json` | Default track - coastal synthwave highway |

## Creating New Tracks

1. Copy `neon_coast_01.json` as a template
2. Modify centerline points for desired layout
3. Adjust checkpoints to match track segments
4. Place scenery and item boxes
5. Test with `npm run build && jsexec dist/outrun.js`

## Coordinate System

- X axis: Left/Right (negative = left, positive = right)
- Y axis: Forward/Backward (along track direction)
- Origin: Start/finish line center
- Units: Abstract game units (~1 unit = 1 meter conceptually)
