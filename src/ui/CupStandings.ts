/**
 * CupStandings.ts - Display cup standings between races.
 */

/**
 * Render cup standings screen.
 * Returns when user presses Enter to continue.
 */
function showCupStandings(
  cupManager: CupManager,
  isPreRace: boolean
): void {
  var state = cupManager.getState();
  if (!state) return;
  
  var screenWidth = console.screen_columns;
  var screenHeight = console.screen_rows;
  
  // Clear screen
  console.clear(BG_BLACK);
  console.attributes = WHITE | BG_BLACK;
  
  // Title
  var title = "=== " + state.definition.name.toUpperCase() + " ===";
  console.gotoxy(Math.floor((screenWidth - title.length) / 2), 2);
  console.attributes = YELLOW | BG_BLACK;
  console.print(title);
  
  // Race info
  var raceInfo: string;
  if (isPreRace) {
    if (cupManager.getCurrentRaceNumber() === 1) {
      raceInfo = "Race " + cupManager.getCurrentRaceNumber() + " of " + cupManager.getTotalRaces();
    } else {
      raceInfo = "Next: Race " + cupManager.getCurrentRaceNumber() + " of " + cupManager.getTotalRaces();
    }
  } else {
    if (state.isComplete) {
      raceInfo = "FINAL STANDINGS";
    } else {
      raceInfo = "After Race " + (cupManager.getCurrentRaceNumber() - 1) + " of " + cupManager.getTotalRaces();
    }
  }
  console.gotoxy(Math.floor((screenWidth - raceInfo.length) / 2), 4);
  console.attributes = LIGHTCYAN | BG_BLACK;
  console.print(raceInfo);
  
  // Track name for pre-race
  if (isPreRace) {
    var trackId = cupManager.getCurrentTrackId();
    if (trackId) {
      var trackName = getTrackDisplayName(trackId);
      console.gotoxy(Math.floor((screenWidth - trackName.length) / 2), 5);
      console.attributes = WHITE | BG_BLACK;
      console.print(trackName);
    }
  }
  
  // Standings table
  var standings = cupManager.getStandings();
  var tableTop = 7;
  var tableWidth = 50;
  var tableLeft = Math.floor((screenWidth - tableWidth) / 2);
  
  // Header
  console.gotoxy(tableLeft, tableTop);
  console.attributes = LIGHTGRAY | BG_BLACK;
  console.print("POS  RACER                    POINTS");
  
  // Separator
  console.gotoxy(tableLeft, tableTop + 1);
  console.print("------------------------------------");
  
  // Standings rows
  for (var i = 0; i < standings.length; i++) {
    var s = standings[i];
    var row = tableTop + 2 + i;
    
    console.gotoxy(tableLeft, row);
    
    // Position
    var posStr = PositionIndicator.getOrdinalSuffix(i + 1);
    posStr = (i + 1) + posStr;
    while (posStr.length < 4) posStr += ' ';
    
    // Color based on position and if player
    if (s.isPlayer) {
      if (i === 0) {
        console.attributes = LIGHTGREEN | BG_BLACK;  // Player in 1st
      } else if (i < 3) {
        console.attributes = YELLOW | BG_BLACK;  // Player in top 3
      } else {
        console.attributes = LIGHTCYAN | BG_BLACK;  // Player
      }
    } else {
      if (i === 0) {
        console.attributes = WHITE | BG_BLACK;  // AI in 1st
      } else {
        console.attributes = LIGHTGRAY | BG_BLACK;  // Other AI
      }
    }
    
    console.print(posStr + " ");
    
    // Name (pad to 24 chars)
    var name = s.isPlayer ? "YOU" : s.name;
    while (name.length < 24) name += ' ';
    console.print(name);
    
    // Points
    var pointsStr = s.points.toString();
    while (pointsStr.length < 4) pointsStr = ' ' + pointsStr;
    console.print(pointsStr);
    
    // Recent race results (small indicators)
    if (s.raceResults.length > 0) {
      console.attributes = DARKGRAY | BG_BLACK;
      console.print("  [");
      for (var r = 0; r < s.raceResults.length; r++) {
        if (r > 0) console.print(",");
        var racePos = s.raceResults[r];
        if (racePos <= 3) {
          console.attributes = LIGHTGREEN | BG_BLACK;
        } else if (racePos <= 5) {
          console.attributes = YELLOW | BG_BLACK;
        } else {
          console.attributes = LIGHTGRAY | BG_BLACK;
        }
        console.print(racePos.toString());
      }
      console.attributes = DARKGRAY | BG_BLACK;
      console.print("]");
    }
  }
  
  // Points system reference
  var refRow = tableTop + 2 + standings.length + 2;
  console.gotoxy(tableLeft, refRow);
  console.attributes = DARKGRAY | BG_BLACK;
  console.print("Points: 1st=15 2nd=12 3rd=10 4th=8 5th=6...");
  
  // Prompt
  var prompt = isPreRace ? "Press ENTER to start race" : "Press ENTER to continue";
  if (state.isComplete) {
    prompt = "Press ENTER to see results";
  }
  console.gotoxy(Math.floor((screenWidth - prompt.length) / 2), screenHeight - 3);
  console.attributes = LIGHTMAGENTA | BG_BLACK;
  console.print(prompt);
  
  // Wait for Enter
  waitForEnter();
}

/**
 * Get display name for a track ID.
 */
function getTrackDisplayName(trackId: string): string {
  // Convert track_id to "Track Name"
  var parts = trackId.split('_');
  var name = '';
  for (var i = 0; i < parts.length; i++) {
    if (i > 0) name += ' ';
    var part = parts[i];
    name += part.charAt(0).toUpperCase() + part.slice(1);
  }
  return name;
}

/**
 * Wait for user to press Enter.
 */
function waitForEnter(): void {
  while (true) {
    var key = console.inkey(K_NONE, 100);
    if (key === '\r' || key === '\n') break;
    if (key === 'q' || key === 'Q') break;  // Allow quit
  }
}

/**
 * Show winner's circle for cup completion.
 */
function showWinnersCircle(cupManager: CupManager): void {
  var state = cupManager.getState();
  if (!state) return;
  
  var screenWidth = console.screen_columns;
  var screenHeight = console.screen_rows;
  var playerWon = cupManager.didPlayerWin();
  var playerPos = cupManager.getPlayerCupPosition();
  
  // Clear screen
  console.clear(BG_BLACK);
  
  // Different display for winner vs loser
  if (playerWon) {
    // Winner celebration!
    console.attributes = YELLOW | BG_BLACK;
    var trophy = [
      "    ___________",
      "   '._==_==_=_.'",
      "   .-\\:      /-.",
      "  | (|:.     |) |",
      "   '-|:.     |-'",
      "     \\::.    /",
      "      '::. .'",
      "        ) (",
      "      _.' '._",
      "     '-------'"
    ];
    
    var trophyTop = 3;
    for (var t = 0; t < trophy.length; t++) {
      console.gotoxy(Math.floor((screenWidth - trophy[t].length) / 2), trophyTop + t);
      console.print(trophy[t]);
    }
    
    var winTitle = "=== CHAMPION! ===";
    console.gotoxy(Math.floor((screenWidth - winTitle.length) / 2), trophyTop + trophy.length + 2);
    console.attributes = LIGHTGREEN | BG_BLACK;
    console.print(winTitle);
    
    var cupName = state.definition.name + " Winner!";
    console.gotoxy(Math.floor((screenWidth - cupName.length) / 2), trophyTop + trophy.length + 4);
    console.attributes = WHITE | BG_BLACK;
    console.print(cupName);
  } else {
    // Not first - show position
    var posStr = playerPos + PositionIndicator.getOrdinalSuffix(playerPos);
    var resultTitle = "=== " + posStr + " PLACE ===";
    
    console.gotoxy(Math.floor((screenWidth - resultTitle.length) / 2), 5);
    if (playerPos <= 3) {
      console.attributes = YELLOW | BG_BLACK;  // Podium
    } else {
      console.attributes = LIGHTGRAY | BG_BLACK;
    }
    console.print(resultTitle);
    
    var cupName2 = state.definition.name + " Complete";
    console.gotoxy(Math.floor((screenWidth - cupName2.length) / 2), 7);
    console.attributes = WHITE | BG_BLACK;
    console.print(cupName2);
    
    if (playerPos <= 3) {
      var podiumMsg = "You made the podium!";
      console.gotoxy(Math.floor((screenWidth - podiumMsg.length) / 2), 9);
      console.attributes = LIGHTCYAN | BG_BLACK;
      console.print(podiumMsg);
    } else {
      var tryAgain = "Better luck next time!";
      console.gotoxy(Math.floor((screenWidth - tryAgain.length) / 2), 9);
      console.attributes = LIGHTGRAY | BG_BLACK;
      console.print(tryAgain);
    }
  }
  
  // Stats
  var statsTop = 14;
  console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop);
  console.attributes = LIGHTGRAY | BG_BLACK;
  console.print("Total Points: " + cupManager.getPlayerPoints());
  
  console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop + 1);
  console.print("Circuit Time: " + formatCupTime(state.totalTime));
  
  console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop + 2);
  console.print("Best Laps Sum: " + formatCupTime(state.totalBestLaps));
  
  // Final standings summary
  var standings = cupManager.getStandings();
  var standingsTop = statsTop + 5;
  console.gotoxy(Math.floor((screenWidth - 20) / 2), standingsTop);
  console.attributes = WHITE | BG_BLACK;
  console.print("Final Standings:");
  
  for (var i = 0; i < Math.min(3, standings.length); i++) {
    var s = standings[i];
    console.gotoxy(Math.floor((screenWidth - 30) / 2), standingsTop + 2 + i);
    
    if (s.isPlayer) {
      console.attributes = LIGHTCYAN | BG_BLACK;
    } else {
      console.attributes = LIGHTGRAY | BG_BLACK;
    }
    
    var line = (i + 1) + ". " + (s.isPlayer ? "YOU" : s.name) + " - " + s.points + " pts";
    console.print(line);
  }
  
  // Prompt
  var prompt = "Press ENTER to continue";
  console.gotoxy(Math.floor((screenWidth - prompt.length) / 2), screenHeight - 3);
  console.attributes = LIGHTMAGENTA | BG_BLACK;
  console.print(prompt);
  
  waitForEnter();
}

/**
 * Format time in seconds to MM:SS.cc format.
 */
function formatCupTime(seconds: number): string {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  var minsStr = mins.toString();
  var secsStr = secs.toFixed(2);
  if (secs < 10) secsStr = '0' + secsStr;
  return minsStr + ':' + secsStr;
}
