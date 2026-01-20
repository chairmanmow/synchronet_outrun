/**
 * HighScoreDisplay - Renders high score lists to the screen
 */

/**
 * Display high scores in a formatted box.
 * @param scores - Array of high score entries
 * @param title - Title of the display
 * @param trackOrCircuitName - Track or circuit name
 * @param playerPosition - Optional: 1-based position of player's newly set score to highlight
 */
function displayHighScores(
  scores: IHighScoreEntry[],
  title: string,
  trackOrCircuitName: string,
  playerPosition?: number
): void {
  console.clear();
  
  var screenWidth = console.screen_columns;
  var screenHeight = console.screen_rows;
  
  // Colors
  var titleAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
  var headerAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
  var nameAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
  var timeAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
  var dateAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
  var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
  var boxAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
  var highlightNameAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLUE });
  var highlightTimeAttr = colorToAttr({ fg: WHITE, bg: BG_BLUE });
  var highlightDateAttr = colorToAttr({ fg: LIGHTGRAY, bg: BG_BLUE });
  
  // Box dimensions
  var boxWidth = Math.min(70, screenWidth - 4);
  var boxHeight = 18;
  var boxX = Math.floor((screenWidth - boxWidth) / 2);
  var topY = Math.floor((screenHeight - boxHeight) / 2);
  
  // Draw box border
  console.gotoxy(boxX, topY);
  console.attributes = boxAttr;
  console.print(GLYPH.DBOX_TL);
  for (var i = 1; i < boxWidth - 1; i++) {
    console.print(GLYPH.DBOX_H);
  }
  console.print(GLYPH.DBOX_TR + "\r\n");
  
  for (var j = 1; j < boxHeight - 1; j++) {
    console.gotoxy(boxX, topY + j);
    console.print(GLYPH.DBOX_V);
    console.gotoxy(boxX + boxWidth - 1, topY + j);
    console.print(GLYPH.DBOX_V + "\r\n");
  }
  
  console.gotoxy(boxX, topY + boxHeight - 1);
  console.print(GLYPH.DBOX_BL);
  for (var i = 1; i < boxWidth - 1; i++) {
    console.print(GLYPH.DBOX_H);
  }
  console.print(GLYPH.DBOX_BR + "\r\n");
  
  // Title
  console.gotoxy(boxX + Math.floor((boxWidth - title.length) / 2), topY + 2);
  console.attributes = titleAttr;
  console.print(title);
  
  // Track/Circuit name
  console.gotoxy(boxX + Math.floor((boxWidth - trackOrCircuitName.length) / 2), topY + 3);
  console.attributes = headerAttr;
  console.print(trackOrCircuitName);
  
  // Header
  console.gotoxy(boxX + 3, topY + 5);
  console.attributes = headerAttr;
  console.print("RANK  PLAYER NAME           TIME        DATE");
  
  // Scores
  var startY = topY + 6;
  for (var i = 0; i < 10; i++) {
    console.gotoxy(boxX + 3, startY + i);
    
    // Check if this is the player's highlighted position
    var isHighlighted = (playerPosition !== undefined && playerPosition === i + 1);
    
    if (i < scores.length) {
      var score = scores[i];
      var rank = (i + 1) + ".";
      if (i < 9) rank = " " + rank;  // Pad single digits
      
      // Rank
      console.attributes = isHighlighted ? highlightNameAttr : nameAttr;
      console.print(rank + "   ");
      
      // Player name (truncate if needed)
      var name = score.playerName;
      if (name.length > 18) {
        name = name.substring(0, 15) + "...";
      }
      while (name.length < 18) {
        name += " ";
      }
      console.print(name + "  ");
      
      // Time
      console.attributes = isHighlighted ? highlightTimeAttr : timeAttr;
      var timeStr = LapTimer.format(score.time);
      console.print(timeStr);
      while (timeStr.length < 10) {
        timeStr += " ";
        console.print(" ");
      }
      console.print("  ");
      
      // Date
      console.attributes = isHighlighted ? highlightDateAttr : dateAttr;
      var date = new Date(score.date);
      var dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
      console.print(dateStr);
      
      // Add indicator for player's new score
      if (isHighlighted) {
        console.attributes = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
        console.print(" <-- YOU!");
      }
    } else {
      // Empty slot
      console.attributes = emptyAttr;
      var rank = (i + 1) + ".";
      if (i < 9) rank = " " + rank;
      console.print(rank + "   ---");
    }
  }
  
  // Footer
  console.gotoxy(boxX + Math.floor((boxWidth - 24) / 2), topY + boxHeight - 2);
  console.attributes = headerAttr;
  console.print("Press any key to continue");
}

/**
 * Display high scores and wait for key press.
 * @param type - Type of high score (track time, lap time, circuit time)
 * @param identifier - Track or circuit identifier
 * @param title - Display title
 * @param trackOrCircuitName - Display name for track or circuit
 * @param highScoreManager - HighScoreManager instance
 * @param playerPosition - Optional: 1-based position of player's newly set score to highlight
 */
function showHighScoreList(
  type: HighScoreType,
  identifier: string,
  title: string,
  trackOrCircuitName: string,
  highScoreManager: HighScoreManager,
  playerPosition?: number
): void {
  var scores = highScoreManager.getScores(type, identifier);
  displayHighScores(scores, title, trackOrCircuitName, playerPosition);
  console.inkey(K_NONE);
}

/**
 * Display a compact single-line high score (for embedding in other screens)
 */
function displayTopScoreLine(
  label: string,
  score: IHighScoreEntry | null,
  x: number,
  y: number,
  labelAttr: number,
  valueAttr: number
): void {
  console.gotoxy(x, y);
  console.attributes = labelAttr;
  console.print(label + ": ");
  
  console.attributes = valueAttr;
  if (score) {
    console.print(LapTimer.format(score.time) + " by " + score.playerName);
  } else {
    console.print("--:--.-- (No record)");
  }
}
