# Build & Deployment Guide

## Prerequisites

- **Node.js** (v14+ recommended) for TypeScript compiler
- **Synchronet BBS** installation for running the game

## Building

### Development Build

```bash
# Install dependencies (first time only)
npm install

# Compile TypeScript to dist/outrun.js
npm run build
```

### Watch Mode

```bash
# Auto-recompile on changes
npm run watch
```

## Output

The build produces a single file: `dist/outrun.js`

This file contains all TypeScript code compiled and concatenated. It has NO external dependencies and NO import/export statements.

## Deployment to Synchronet

### 1. Copy Files

Copy these to your Synchronet installation:

```
sbbs/xtrn/outrun/
├── dist/
│   └── outrun.js       # The game (compiled)
└── data/
    └── tracks/
        └── neon_coast_01.json   # Track data
```

### 2. Configure External Program

Edit `sbbs/ctrl/xtrn.ini` or use SCFG:

```ini
[outrun]
name=OutRun ANSI
cmd=?outrun/dist/outrun.js
dir=../xtrn/outrun
clean=Y
ars=
exec_ars=
```

Or via SCFG:

1. Run `scfg` (Synchronet Configuration)
2. Navigate to: `External Programs` → `Online Programs (Doors)`
3. Select a section (e.g., "Games")
4. Add new program:
   - **Name**: OutRun ANSI
   - **Internal Code**: OUTRUN
   - **Command Line**: `?outrun/dist/outrun.js`
   - **Startup Directory**: `../xtrn/outrun`
   - **Clean-up Command**: (blank)
   - **Multiple Concurrent Users**: Yes

### 3. Test Locally

```bash
# From sbbs directory
jsexec xtrn/outrun/dist/outrun.js
```

## Troubleshooting

### "load() failed"

The game requires Synchronet's JavaScript environment. It cannot run in Node.js or browsers.

Verify:
- Running via `jsexec` or through BBS
- `sbbsdefs.js` is in Synchronet's exec directory

### "frame.js not found"

The Frame library should be in `exec/load/frame.js`.

Check your Synchronet installation includes the standard load libraries.

### Black screen / no output

- Check terminal supports ANSI
- Verify console.clear() is working
- Try simpler test: `jsexec -e "console.print('test\r\n')"`

### Performance issues

- Ensure terminal is set to 80x24
- Check BBS connection speed settings
- Reduce scenery density in track JSON

## Version Info

- **Build System**: TypeScript 5.x with tsc
- **Module Format**: AMD (for outFile concatenation)
- **Target**: ES5 (SpiderMonkey 1.8.5 compatibility)
- **Runtime**: Synchronet JavaScript (NOT Node.js)
