/**
 * PositionIndicator - Race position display.
 */

interface PositionData {
  position: number;
  totalRacers: number;
  suffix: string;
}

class PositionIndicator {
  /**
   * Calculate position display data.
   */
  static calculate(position: number, totalRacers: number): PositionData {
    return {
      position: position,
      totalRacers: totalRacers,
      suffix: this.getOrdinalSuffix(position)
    };
  }

  /**
   * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
   */
  static getOrdinalSuffix(n: number): string {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  /**
   * Format position string (e.g., "3rd / 8")
   */
  static format(data: PositionData): string {
    return data.position + data.suffix + " / " + data.totalRacers;
  }

  /**
   * Calculate race positions for all vehicles.
   * Sorts by lap > checkpoint > track position.
   * Position 1 = first place (furthest along).
   */
  static calculatePositions(vehicles: IVehicle[], roadLength?: number): void {
    // Only calculate positions for actual racers (player + AI racers), not commuter NPCs
    var racers = vehicles.filter(function(v) { return !v.isNPC || v.isRacer; });
    
    // Sort vehicles by race progress (best = highest lap, checkpoint, trackZ)
    var sorted = racers.slice().sort(function(a, b) {
      // First by lap (higher = better = should be first in array)
      if (a.lap !== b.lap) return b.lap - a.lap;

      // Then by checkpoint (higher = better)
      if (a.checkpoint !== b.checkpoint) return b.checkpoint - a.checkpoint;

      // Then by track Z position (higher = further along = better)
      // Normalize to road length if provided
      var aZ = a.trackZ;
      var bZ = b.trackZ;
      if (roadLength && roadLength > 0) {
        aZ = aZ % roadLength;
        bZ = bZ % roadLength;
      }
      return bZ - aZ;  // Higher Z = earlier in array = position 1
    });

    // Assign positions (index 0 = position 1 = first place)
    for (var i = 0; i < sorted.length; i++) {
      sorted[i].racePosition = i + 1;
    }
  }
}
