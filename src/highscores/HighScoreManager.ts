/**
 * HighScoreManager - Persistent high score tracking using Synchronet json-db
 * 
 * Manages three types of records:
 * - Track Time: Fastest completion time for a specific track
 * - Lap Time: Fastest single lap time for a specific track  
 * - Circuit Time: Fastest completion time for an entire circuit/cup
 * 
 * Each record type stores top 10 scores.
 */

// Type declaration for JSONdb (loaded from Synchronet)
declare var JSONdb: any;

// Load json-db if not already loaded
if (typeof JSONdb === 'undefined') {
  load('json-db.js');
}

/**
 * High score entry structure
 */
interface IHighScoreEntry {
  playerName: string;
  time: number;          // Time in seconds
  date: number;          // Timestamp (Date.now())
  trackName?: string;    // For track/lap records
  circuitName?: string;  // For circuit records
}

/**
 * High score record types
 */
enum HighScoreType {
  TRACK_TIME = 'track_time',
  LAP_TIME = 'lap_time',
  CIRCUIT_TIME = 'circuit_time'
}

class HighScoreManager {
  private db: any;  // JSONdb instance
  private dbPath: string;
  private maxEntries: number = 10;

  constructor() {
    // Store high scores in game directory
    this.dbPath = js.exec_dir + 'highscores.json';
    
    try {
      this.db = new JSONdb(this.dbPath, 'OUTRUN_SCORES');
      this.db.settings.KEEP_READABLE = true;
      
      // Load existing data
      this.db.load();
    } catch (e) {
      logError("Failed to initialize high score database: " + e);
      this.db = null;
    }
  }

  /**
   * Generate a key for storing/retrieving high scores
   */
  private getKey(type: HighScoreType, identifier: string): string {
    // Sanitize identifier (track or circuit name)
    var sanitized = identifier.replace(/\s+/g, '_').toLowerCase();
    return type + '.' + sanitized;
  }

  /**
   * Get high score list for a specific record type and identifier
   */
  getScores(type: HighScoreType, identifier: string): IHighScoreEntry[] {
    if (!this.db) return [];
    
    try {
      // Reload to ensure we have latest data
      this.db.load();
      
      var key = this.getKey(type, identifier);
      var data = this.db.masterData.data || {};
      var scores = data[key];
      
      if (scores && Array.isArray(scores)) {
        return scores;
      }
      
      return [];
    } catch (e) {
      logError("Failed to get high scores: " + e);
      return [];
    }
  }

  /**
   * Get the #1 high score (fastest time) for a specific record
   */
  getTopScore(type: HighScoreType, identifier: string): IHighScoreEntry | null {
    var scores = this.getScores(type, identifier);
    if (scores.length > 0) {
      return scores[0];
    }
    return null;
  }

  /**
   * Check if a time qualifies for the high score list
   * Returns the position (1-10) if it qualifies, or 0 if it doesn't
   */
  checkQualification(type: HighScoreType, identifier: string, time: number): number {
    var scores = this.getScores(type, identifier);
    
    // If we have fewer than max entries, it always qualifies
    if (scores.length < this.maxEntries) {
      // Find position where it should be inserted
      for (var i = 0; i < scores.length; i++) {
        if (time < scores[i].time) {
          return i + 1;
        }
      }
      return scores.length + 1;
    }
    
    // Check if time beats any existing score
    for (var i = 0; i < scores.length; i++) {
      if (time < scores[i].time) {
        return i + 1;
      }
    }
    
    return 0;  // Doesn't qualify
  }

  /**
   * Submit a new high score
   * Returns the position (1-10) if it made the list, or 0 if it didn't
   */
  submitScore(
    type: HighScoreType,
    identifier: string,
    playerName: string,
    time: number,
    trackName?: string,
    circuitName?: string
  ): number {
    if (!this.db) return 0;
    
    try {
      // Reload to ensure we have latest data
      this.db.load();
      
      var key = this.getKey(type, identifier);
      var scores = this.getScores(type, identifier);
      
      // Create new entry
      var entry: IHighScoreEntry = {
        playerName: playerName,
        time: time,
        date: Date.now()
      };
      
      if (trackName) entry.trackName = trackName;
      if (circuitName) entry.circuitName = circuitName;
      
      // Find insertion position
      var position = 0;
      for (var i = 0; i < scores.length; i++) {
        if (time < scores[i].time) {
          position = i;
          break;
        }
      }
      
      // If didn't beat any scores but list isn't full, append
      if (position === 0 && scores.length < this.maxEntries) {
        position = scores.length;
      }
      
      // If position is 0 and list is full, score doesn't qualify
      if (position === 0 && scores.length >= this.maxEntries) {
        return 0;
      }
      
      // Insert at position
      scores.splice(position, 0, entry);
      
      // Trim to max entries
      if (scores.length > this.maxEntries) {
        scores = scores.slice(0, this.maxEntries);
      }
      
      // Write back to database
      var data = this.db.masterData.data || {};
      data[key] = scores;
      this.db.masterData.data = data;
      
      // Save to disk
      this.db.save();
      
      return position + 1;  // Return 1-based position
    } catch (e) {
      logError("Failed to submit high score: " + e);
      return 0;
    }
  }

  /**
   * Clear all high scores (for testing/admin)
   */
  clearAll(): void {
    if (!this.db) return;
    
    try {
      this.db.masterData.data = {};
      this.db.save();
    } catch (e) {
      logError("Failed to clear high scores: " + e);
    }
  }

  /**
   * Clear high scores for a specific record type and identifier
   */
  clear(type: HighScoreType, identifier: string): void {
    if (!this.db) return;
    
    try {
      this.db.load();
      var key = this.getKey(type, identifier);
      var data = this.db.masterData.data || {};
      delete data[key];
      this.db.masterData.data = data;
      this.db.save();
    } catch (e) {
      logError("Failed to clear high scores: " + e);
    }
  }
}
