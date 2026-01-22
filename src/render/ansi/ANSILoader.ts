/**
 * ANSILoader - Parses ANSI art files into a character/attribute grid.
 * Handles standard ANSI escape sequences for colors and cursor movement.
 */

interface ANSICell {
  char: string;
  attr: number;  // Combined fg/bg attribute
}

interface ANSIImage {
  width: number;
  height: number;
  cells: ANSICell[][];  // [row][col]
}

/**
 * Parse ANSI escape sequences and render to a grid.
 */
class ANSILoader {
  // Default directory for ANSI files
  static defaultDirectory: string = '/sbbs/text/futureland';
  
  /**
   * Load and parse an ANSI file.
   * @param filename - The filename (without path) to load
   * @param directory - Optional directory override
   */
  static load(filename: string, directory?: string): ANSIImage | null {
    var dir = directory || ANSILoader.defaultDirectory;
    var path = dir + '/' + filename;
    
    try {
      // In Synchronet JS, we use file_exists and read
      if (typeof file_exists !== 'undefined' && !file_exists(path)) {
        logWarning("ANSI file not found: " + path);
        return null;
      }
      
      var content: string;
      if (typeof read !== 'undefined') {
        // Synchronet environment
        content = read(path);
      } else {
        // Fallback - won't work in browser but useful for typing
        logWarning("Cannot read ANSI file outside Synchronet: " + path);
        return null;
      }
      
      return ANSILoader.parse(content);
    } catch (e) {
      logWarning("Error loading ANSI file: " + path + " - " + e);
      return null;
    }
  }
  
  /**
   * Scan a directory for ANSI files.
   * @param directory - Directory to scan
   * @returns Array of filenames
   */
  static scanDirectory(directory?: string): string[] {
    var dir = directory || ANSILoader.defaultDirectory;
    var files: string[] = [];
    
    try {
      if (typeof directory_list !== 'undefined') {
        var allFiles = directory_list(dir);
        for (var i = 0; i < allFiles.length; i++) {
          var f = allFiles[i];
          if (f.toLowerCase().endsWith('.ans')) {
            files.push(f);
          }
        }
      }
    } catch (e) {
      logWarning("Error scanning ANSI directory: " + dir + " - " + e);
    }
    
    return files;
  }
  
  /**
   * Parse ANSI content string into an image grid.
   */
  static parse(content: string): ANSIImage {
    // Standard 80-column ANSI
    var width = 80;
    var maxHeight = 500;  // Reasonable limit
    
    // Initialize grid
    var cells: ANSICell[][] = [];
    for (var row = 0; row < maxHeight; row++) {
      cells[row] = [];
      for (var col = 0; col < width; col++) {
        cells[row][col] = { char: ' ', attr: makeAttr(LIGHTGRAY, BG_BLACK) };
      }
    }
    
    var cursorX = 0;
    var cursorY = 0;
    var currentAttr = makeAttr(LIGHTGRAY, BG_BLACK);
    var maxY = 0;
    
    var i = 0;
    while (i < content.length) {
      var ch = content.charAt(i);
      var code = content.charCodeAt(i);
      
      // Check for escape sequence
      if (code === 27 && i + 1 < content.length && content.charAt(i + 1) === '[') {
        // Parse CSI sequence
        i += 2;  // Skip ESC [
        var params = '';
        while (i < content.length) {
          var c = content.charAt(i);
          if ((c >= '0' && c <= '9') || c === ';') {
            params += c;
            i++;
          } else {
            break;
          }
        }
        
        if (i < content.length) {
          var cmd = content.charAt(i);
          i++;
          
          // Parse parameters
          var parts = params.split(';');
          var nums: number[] = [];
          for (var p = 0; p < parts.length; p++) {
            nums.push(parts[p] === '' ? 0 : parseInt(parts[p], 10));
          }
          
          switch (cmd) {
            case 'm':  // SGR - Set Graphics Rendition
              currentAttr = ANSILoader.parseSGR(nums, currentAttr);
              break;
            case 'H':  // CUP - Cursor Position
            case 'f':  // HVP - Horizontal Vertical Position
              cursorY = (nums[0] || 1) - 1;
              cursorX = (nums[1] || 1) - 1;
              break;
            case 'A':  // CUU - Cursor Up
              cursorY = Math.max(0, cursorY - (nums[0] || 1));
              break;
            case 'B':  // CUD - Cursor Down
              cursorY = cursorY + (nums[0] || 1);
              break;
            case 'C':  // CUF - Cursor Forward
              cursorX = Math.min(width - 1, cursorX + (nums[0] || 1));
              break;
            case 'D':  // CUB - Cursor Back
              cursorX = Math.max(0, cursorX - (nums[0] || 1));
              break;
            case 'J':  // ED - Erase Display (ignore)
            case 'K':  // EL - Erase Line (ignore)
            case 's':  // SCP - Save Cursor Position (ignore)
            case 'u':  // RCP - Restore Cursor Position (ignore)
              break;
          }
        }
      } else if (code === 13) {
        // CR - Carriage Return
        cursorX = 0;
        i++;
      } else if (code === 10) {
        // LF - Line Feed
        cursorY++;
        cursorX = 0;
        i++;
      } else if (code === 9) {
        // Tab
        cursorX = Math.min(width - 1, (Math.floor(cursorX / 8) + 1) * 8);
        i++;
      } else {
        // Regular character
        if (cursorY < maxHeight && cursorX < width) {
          // Handle CP437 high characters (128-255)
          cells[cursorY][cursorX] = { char: ch, attr: currentAttr };
          if (cursorY > maxY) maxY = cursorY;
        }
        cursorX++;
        if (cursorX >= width) {
          cursorX = 0;
          cursorY++;
        }
        i++;
      }
    }
    
    // Trim to actual height
    var actualHeight = maxY + 1;
    cells.length = actualHeight;
    
    return {
      width: width,
      height: actualHeight,
      cells: cells
    };
  }
  
  /**
   * Parse SGR (Select Graphic Rendition) parameters.
   */
  private static parseSGR(params: number[], currentAttr: number): number {
    var fg = currentAttr & 0x0F;
    var bg = (currentAttr >> 4) & 0x0F;
    var bold = false;
    
    if (params.length === 0) {
      params = [0];
    }
    
    for (var i = 0; i < params.length; i++) {
      var p = params[i];
      
      if (p === 0) {
        // Reset
        fg = LIGHTGRAY;
        bg = 0;  // BG_BLACK
        bold = false;
      } else if (p === 1) {
        // Bold/Bright
        bold = true;
        if (fg < 8) fg += 8;
      } else if (p === 2 || p === 22) {
        // Dim / Normal intensity
        bold = false;
        if (fg >= 8) fg -= 8;
      } else if (p >= 30 && p <= 37) {
        // Foreground color
        fg = p - 30;
        if (bold) fg += 8;
      } else if (p === 39) {
        // Default foreground
        fg = bold ? WHITE : LIGHTGRAY;
      } else if (p >= 40 && p <= 47) {
        // Background color
        bg = p - 40;
      } else if (p === 49) {
        // Default background
        bg = 0;
      } else if (p >= 90 && p <= 97) {
        // Bright foreground (non-standard but common)
        fg = (p - 90) + 8;
      } else if (p >= 100 && p <= 107) {
        // Bright background (non-standard)
        bg = (p - 100) + 8;
      }
    }
    
    return makeAttr(fg, bg << 4);
  }
}

// Type declarations for Synchronet functions
declare function file_exists(path: string): boolean;
declare function read(path: string): string;
declare function directory_list(path: string): string[];
