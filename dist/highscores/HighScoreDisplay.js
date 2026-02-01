"use strict";
function displayHighScores(scores, title, trackOrCircuitName, playerPosition) {
    console.clear(LIGHTGRAY, false);
    var screenWidth = 80;
    var screenHeight = 24;
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
        var isHighlighted = (playerPosition !== undefined && playerPosition === i + 1);
        if (i < scores.length) {
            var score = scores[i];
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.attributes = isHighlighted ? highlightNameAttr : nameAttr;
            console.print(rank + "   ");
            var name = score.playerName;
            if (name.length > 18) {
                name = name.substring(0, 15) + "...";
            }
            while (name.length < 18) {
                name += " ";
            }
            console.print(name + "  ");
            console.attributes = isHighlighted ? highlightTimeAttr : timeAttr;
            var timeStr = LapTimer.format(score.time);
            console.print(timeStr);
            while (timeStr.length < 10) {
                timeStr += " ";
                console.print(" ");
            }
            console.print("  ");
            console.attributes = isHighlighted ? highlightDateAttr : dateAttr;
            var date = new Date(score.date);
            var dateStr = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
            console.print(dateStr);
            if (isHighlighted) {
                console.attributes = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
                console.print(" <-- YOU!");
            }
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
function showHighScoreList(type, identifier, title, trackOrCircuitName, highScoreManager, playerPosition) {
    var scores = highScoreManager.getScores(type, identifier);
    displayHighScores(scores, title, trackOrCircuitName, playerPosition);
    console.line_counter = 0;
    console.inkey(K_NONE, 300000);
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
function showTwoColumnHighScores(trackId, trackName, highScoreManager, trackTimePosition, lapTimePosition) {
    console.clear(LIGHTGRAY, false);
    var viewWidth = 80;
    var viewHeight = 24;
    var trackScores = highScoreManager.getScores(HighScoreType.TRACK_TIME, trackId);
    var lapScores = highScoreManager.getScores(HighScoreType.LAP_TIME, trackId);
    var titleAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
    var headerAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
    var colHeaderAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
    var rankAttr = colorToAttr({ fg: WHITE, bg: BG_BLACK });
    var nameAttr = colorToAttr({ fg: LIGHTGRAY, bg: BG_BLACK });
    var timeAttr = colorToAttr({ fg: LIGHTGREEN, bg: BG_BLACK });
    var emptyAttr = colorToAttr({ fg: DARKGRAY, bg: BG_BLACK });
    var boxAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLACK });
    var highlightAttr = colorToAttr({ fg: LIGHTCYAN, bg: BG_BLUE });
    var promptAttr = colorToAttr({ fg: LIGHTMAGENTA, bg: BG_BLACK });
    var newScoreAttr = colorToAttr({ fg: YELLOW, bg: BG_BLACK });
    var boxWidth = 76;
    var boxHeight = 20;
    var boxX = Math.floor((viewWidth - boxWidth) / 2);
    var topY = Math.floor((viewHeight - boxHeight) / 2);
    console.gotoxy(boxX, topY);
    console.attributes = boxAttr;
    console.print(GLYPH.DBOX_TL);
    for (var i = 1; i < boxWidth - 1; i++) {
        console.print(GLYPH.DBOX_H);
    }
    console.print(GLYPH.DBOX_TR);
    for (var j = 1; j < boxHeight - 1; j++) {
        console.gotoxy(boxX, topY + j);
        console.print(GLYPH.DBOX_V);
        console.gotoxy(boxX + boxWidth - 1, topY + j);
        console.print(GLYPH.DBOX_V);
    }
    console.gotoxy(boxX, topY + boxHeight - 1);
    console.print(GLYPH.DBOX_BL);
    for (var i = 1; i < boxWidth - 1; i++) {
        console.print(GLYPH.DBOX_H);
    }
    console.print(GLYPH.DBOX_BR);
    var title = "=== HIGH SCORES ===";
    console.gotoxy(boxX + Math.floor((boxWidth - title.length) / 2), topY + 1);
    console.attributes = titleAttr;
    console.print(title);
    console.gotoxy(boxX + Math.floor((boxWidth - trackName.length) / 2), topY + 2);
    console.attributes = headerAttr;
    console.print(trackName);
    var leftColX = boxX + 3;
    var rightColX = boxX + 40;
    console.gotoxy(leftColX, topY + 4);
    console.attributes = colHeaderAttr;
    console.print("TRACK TIME");
    console.gotoxy(rightColX, topY + 4);
    console.print("BEST LAP");
    console.gotoxy(boxX + 37, topY + 4);
    console.attributes = boxAttr;
    console.print(GLYPH.BOX_V);
    for (var j = 5; j < boxHeight - 3; j++) {
        console.gotoxy(boxX + 37, topY + j);
        console.print(GLYPH.BOX_V);
    }
    var startY = topY + 5;
    for (var i = 0; i < 10; i++) {
        console.gotoxy(leftColX, startY + i);
        var trackHighlighted = (trackTimePosition > 0 && trackTimePosition === i + 1);
        if (i < trackScores.length) {
            var score = trackScores[i];
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.attributes = trackHighlighted ? highlightAttr : rankAttr;
            console.print(rank + " ");
            var name = score.playerName;
            if (name.length > 11)
                name = name.substring(0, 10) + ".";
            while (name.length < 11)
                name += " ";
            console.attributes = trackHighlighted ? highlightAttr : nameAttr;
            console.print(name + " ");
            console.attributes = trackHighlighted ? highlightAttr : timeAttr;
            console.print(LapTimer.format(score.time));
            var d = new Date(score.date);
            var dateStr = " " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            console.attributes = trackHighlighted ? highlightAttr : emptyAttr;
            console.print(dateStr);
            if (trackHighlighted) {
                console.attributes = newScoreAttr;
                console.print("*");
            }
        }
        else {
            console.attributes = emptyAttr;
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.print(rank + " ---");
        }
        console.gotoxy(rightColX, startY + i);
        var lapHighlighted = (lapTimePosition > 0 && lapTimePosition === i + 1);
        if (i < lapScores.length) {
            var score = lapScores[i];
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.attributes = lapHighlighted ? highlightAttr : rankAttr;
            console.print(rank + " ");
            var name = score.playerName;
            if (name.length > 11)
                name = name.substring(0, 10) + ".";
            while (name.length < 11)
                name += " ";
            console.attributes = lapHighlighted ? highlightAttr : nameAttr;
            console.print(name + " ");
            console.attributes = lapHighlighted ? highlightAttr : timeAttr;
            console.print(LapTimer.format(score.time));
            var d = new Date(score.date);
            var dateStr = " " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            console.attributes = lapHighlighted ? highlightAttr : emptyAttr;
            console.print(dateStr);
            if (lapHighlighted) {
                console.attributes = newScoreAttr;
                console.print(" *");
            }
        }
        else {
            console.attributes = emptyAttr;
            var rank = (i + 1) + ".";
            if (i < 9)
                rank = " " + rank;
            console.print(rank + " ---");
        }
    }
    if (trackTimePosition > 0 || lapTimePosition > 0) {
        console.gotoxy(boxX + 3, topY + boxHeight - 3);
        console.attributes = newScoreAttr;
        console.print("* = Your new high score!");
    }
    var prompt = "Press any key to continue";
    console.gotoxy(boxX + Math.floor((boxWidth - prompt.length) / 2), topY + boxHeight - 2);
    console.attributes = promptAttr;
    console.print(prompt);
    console.line_counter = 0;
    console.inkey(K_NONE, 300000);
}
