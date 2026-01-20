"use strict";
function displayHighScores(scores, title, trackOrCircuitName) {
    console.clear();
    var screenWidth = console.screen_columns;
    var screenHeight = console.screen_rows;
    var titleAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
    var headerAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
    var nameAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
    var timeAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
    var dateAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var boxAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
    var boxWidth = Math.min(70, screenWidth - 4);
    var boxHeight = 18;
    var boxX = Math.floor((screenWidth - boxWidth) / 2);
    var topY = Math.floor((screenHeight - boxHeight) / 2);
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
    console.gotoxy(boxX + Math.floor((boxWidth - title.length) / 2), topY + 2);
    console.attributes = titleAttr;
    console.print(title);
    console.gotoxy(boxX + Math.floor((boxWidth - trackOrCircuitName.length) / 2), topY + 3);
    console.attributes = headerAttr;
    console.print(trackOrCircuitName);
    console.gotoxy(boxX + 3, topY + 5);
    console.attributes = headerAttr;
    console.print("RANK  PLAYER NAME           TIME        DATE");
    var startY = topY + 6;
    for (var i = 0; i < 10; i++) {
        console.gotoxy(boxX + 3, startY + i);
        if (i < scores.length) {
            var score = scores[i];
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.attributes = nameAttr;
            console.print(rank + "   ");
            var name = score.playerName;
            if (name.length > 18) {
                name = name.substring(0, 15) + "...";
            }
            while (name.length < 18) {
                name += " ";
            }
            console.print(name + "  ");
            console.attributes = timeAttr;
            var timeStr = LapTimer.format(score.time);
            console.print(timeStr);
            while (timeStr.length < 10) {
                timeStr += " ";
                console.print(" ");
            }
            console.print("  ");
            console.attributes = dateAttr;
            var date = new Date(score.date);
            var dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            console.print(dateStr);
        }
        else {
            console.attributes = emptyAttr;
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.print(rank + "   ---");
        }
    }
    console.gotoxy(boxX + Math.floor((boxWidth - 24) / 2), topY + boxHeight - 2);
    console.attributes = headerAttr;
    console.print("Press any key to continue");
}
function showHighScoreList(type, identifier, title, trackOrCircuitName, highScoreManager) {
    var scores = highScoreManager.getScores(type, identifier);
    displayHighScores(scores, title, trackOrCircuitName);
    console.inkey(K_NONE);
}
function displayTopScoreLine(label, score, x, y, labelAttr, valueAttr) {
    console.gotoxy(x, y);
    console.attributes = labelAttr;
    console.print(label + ": ");
    console.attributes = valueAttr;
    if (score) {
        console.print(LapTimer.format(score.time) + " by " + score.playerName);
    }
    else {
        console.print("--:--.-- (No record)");
    }
}
