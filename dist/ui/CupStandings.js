"use strict";
function showCupStandings(cupManager, isPreRace) {
    var state = cupManager.getState();
    if (!state)
        return;
    var screenWidth = console.screen_columns;
    var screenHeight = console.screen_rows;
    console.clear(BG_BLACK);
    console.attributes = WHITE | BG_BLACK;
    var title = "=== " + state.definition.name.toUpperCase() + " ===";
    console.gotoxy(Math.floor((screenWidth - title.length) / 2), 2);
    console.attributes = YELLOW | BG_BLACK;
    console.print(title);
    var raceInfo;
    if (isPreRace) {
        if (cupManager.getCurrentRaceNumber() === 1) {
            raceInfo = "Race " + cupManager.getCurrentRaceNumber() + " of " + cupManager.getTotalRaces();
        }
        else {
            raceInfo = "Next: Race " + cupManager.getCurrentRaceNumber() + " of " + cupManager.getTotalRaces();
        }
    }
    else {
        if (state.isComplete) {
            raceInfo = "FINAL STANDINGS";
        }
        else {
            raceInfo = "After Race " + (cupManager.getCurrentRaceNumber() - 1) + " of " + cupManager.getTotalRaces();
        }
    }
    console.gotoxy(Math.floor((screenWidth - raceInfo.length) / 2), 4);
    console.attributes = LIGHTCYAN | BG_BLACK;
    console.print(raceInfo);
    if (isPreRace) {
        var trackId = cupManager.getCurrentTrackId();
        if (trackId) {
            var trackName = getTrackDisplayName(trackId);
            console.gotoxy(Math.floor((screenWidth - trackName.length) / 2), 5);
            console.attributes = WHITE | BG_BLACK;
            console.print(trackName);
        }
    }
    var standings = cupManager.getStandings();
    var tableTop = 7;
    var tableWidth = 50;
    var tableLeft = Math.floor((screenWidth - tableWidth) / 2);
    console.gotoxy(tableLeft, tableTop);
    console.attributes = LIGHTGRAY | BG_BLACK;
    console.print("POS  RACER                    POINTS");
    console.gotoxy(tableLeft, tableTop + 1);
    console.print("------------------------------------");
    for (var i = 0; i < standings.length; i++) {
        var s = standings[i];
        var row = tableTop + 2 + i;
        console.gotoxy(tableLeft, row);
        var posStr = PositionIndicator.getOrdinalSuffix(i + 1);
        posStr = (i + 1) + posStr;
        while (posStr.length < 4)
            posStr += ' ';
        if (s.isPlayer) {
            if (i === 0) {
                console.attributes = LIGHTGREEN | BG_BLACK;
            }
            else if (i < 3) {
                console.attributes = YELLOW | BG_BLACK;
            }
            else {
                console.attributes = LIGHTCYAN | BG_BLACK;
            }
        }
        else {
            if (i === 0) {
                console.attributes = WHITE | BG_BLACK;
            }
            else {
                console.attributes = LIGHTGRAY | BG_BLACK;
            }
        }
        console.print(posStr + " ");
        var name = s.isPlayer ? "YOU" : s.name;
        while (name.length < 24)
            name += ' ';
        console.print(name);
        var pointsStr = s.points.toString();
        while (pointsStr.length < 4)
            pointsStr = ' ' + pointsStr;
        console.print(pointsStr);
        if (s.raceResults.length > 0) {
            console.attributes = DARKGRAY | BG_BLACK;
            console.print("  [");
            for (var r = 0; r < s.raceResults.length; r++) {
                if (r > 0)
                    console.print(",");
                var racePos = s.raceResults[r];
                if (racePos <= 3) {
                    console.attributes = LIGHTGREEN | BG_BLACK;
                }
                else if (racePos <= 5) {
                    console.attributes = YELLOW | BG_BLACK;
                }
                else {
                    console.attributes = LIGHTGRAY | BG_BLACK;
                }
                console.print(racePos.toString());
            }
            console.attributes = DARKGRAY | BG_BLACK;
            console.print("]");
        }
    }
    var refRow = tableTop + 2 + standings.length + 2;
    console.gotoxy(tableLeft, refRow);
    console.attributes = DARKGRAY | BG_BLACK;
    console.print("Points: 1st=15 2nd=12 3rd=10 4th=8 5th=6...");
    var prompt = isPreRace ? "Press ENTER to start race" : "Press ENTER to continue";
    if (state.isComplete) {
        prompt = "Press ENTER to see results";
    }
    console.gotoxy(Math.floor((screenWidth - prompt.length) / 2), screenHeight - 3);
    console.attributes = LIGHTMAGENTA | BG_BLACK;
    console.print(prompt);
    waitForEnter();
}
function getTrackDisplayName(trackId) {
    var parts = trackId.split('_');
    var name = '';
    for (var i = 0; i < parts.length; i++) {
        if (i > 0)
            name += ' ';
        var part = parts[i];
        name += part.charAt(0).toUpperCase() + part.slice(1);
    }
    return name;
}
function waitForEnter() {
    while (true) {
        var key = console.inkey(K_NONE, 100);
        if (key === '\r' || key === '\n')
            break;
        if (key === 'q' || key === 'Q')
            break;
    }
}
function showWinnersCircle(cupManager) {
    var state = cupManager.getState();
    if (!state)
        return;
    var screenWidth = console.screen_columns;
    var screenHeight = console.screen_rows;
    var playerWon = cupManager.didPlayerWin();
    var playerPos = cupManager.getPlayerCupPosition();
    console.clear(BG_BLACK);
    if (playerWon) {
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
    }
    else {
        var posStr = playerPos + PositionIndicator.getOrdinalSuffix(playerPos);
        var resultTitle = "=== " + posStr + " PLACE ===";
        console.gotoxy(Math.floor((screenWidth - resultTitle.length) / 2), 5);
        if (playerPos <= 3) {
            console.attributes = YELLOW | BG_BLACK;
        }
        else {
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
        }
        else {
            var tryAgain = "Better luck next time!";
            console.gotoxy(Math.floor((screenWidth - tryAgain.length) / 2), 9);
            console.attributes = LIGHTGRAY | BG_BLACK;
            console.print(tryAgain);
        }
    }
    var statsTop = 14;
    console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop);
    console.attributes = LIGHTGRAY | BG_BLACK;
    console.print("Total Points: " + cupManager.getPlayerPoints());
    console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop + 1);
    console.print("Circuit Time: " + formatCupTime(state.totalTime));
    console.gotoxy(Math.floor((screenWidth - 30) / 2), statsTop + 2);
    console.print("Best Laps Sum: " + formatCupTime(state.totalBestLaps));
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
        }
        else {
            console.attributes = LIGHTGRAY | BG_BLACK;
        }
        var line = (i + 1) + ". " + (s.isPlayer ? "YOU" : s.name) + " - " + s.points + " pts";
        console.print(line);
    }
    var prompt = "Press ENTER to continue";
    console.gotoxy(Math.floor((screenWidth - prompt.length) / 2), screenHeight - 3);
    console.attributes = LIGHTMAGENTA | BG_BLACK;
    console.print(prompt);
    waitForEnter();
}
function formatCupTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    var minsStr = mins.toString();
    var secsStr = secs.toFixed(2);
    if (secs < 10)
        secsStr = '0' + secsStr;
    return minsStr + ':' + secsStr;
}
