"use strict";
var CarSelector = {
    show: function (composer) {
        var cars = getAllCars();
        var selectedCarIndex = 0;
        var selectedColorIndex = 0;
        for (var i = 0; i < cars.length; i++) {
            if (cars[i].unlocked) {
                selectedCarIndex = i;
                break;
            }
        }
        var running = true;
        var confirmed = false;
        while (running) {
            var currentCar = cars[selectedCarIndex];
            var availableColors = [];
            for (var c = 0; c < currentCar.availableColors.length; c++) {
                var col = getCarColor(currentCar.availableColors[c]);
                if (col)
                    availableColors.push(col);
            }
            if (selectedColorIndex >= availableColors.length) {
                selectedColorIndex = 0;
            }
            var currentColor = availableColors[selectedColorIndex];
            this.render(composer, cars, selectedCarIndex, currentColor, selectedColorIndex, availableColors.length);
            var key = console.inkey(K_UPPER, 100);
            if (key === '')
                continue;
            switch (key) {
                case 'W':
                case KEY_UP:
                    selectedCarIndex--;
                    if (selectedCarIndex < 0)
                        selectedCarIndex = cars.length - 1;
                    var attempts = 0;
                    while (!cars[selectedCarIndex].unlocked && attempts < cars.length) {
                        selectedCarIndex--;
                        if (selectedCarIndex < 0)
                            selectedCarIndex = cars.length - 1;
                        attempts++;
                    }
                    selectedColorIndex = 0;
                    break;
                case 'S':
                case KEY_DOWN:
                    selectedCarIndex++;
                    if (selectedCarIndex >= cars.length)
                        selectedCarIndex = 0;
                    var attempts = 0;
                    while (!cars[selectedCarIndex].unlocked && attempts < cars.length) {
                        selectedCarIndex++;
                        if (selectedCarIndex >= cars.length)
                            selectedCarIndex = 0;
                        attempts++;
                    }
                    selectedColorIndex = 0;
                    break;
                case 'A':
                case KEY_LEFT:
                    selectedColorIndex--;
                    if (selectedColorIndex < 0)
                        selectedColorIndex = availableColors.length - 1;
                    break;
                case 'D':
                case KEY_RIGHT:
                    selectedColorIndex++;
                    if (selectedColorIndex >= availableColors.length)
                        selectedColorIndex = 0;
                    break;
                case '\r':
                case '\n':
                case ' ':
                    if (currentCar.unlocked) {
                        confirmed = true;
                        running = false;
                    }
                    break;
                case 'Q':
                case '\x1b':
                    running = false;
                    break;
            }
        }
        if (confirmed) {
            var car = cars[selectedCarIndex];
            var colors = [];
            for (var c = 0; c < car.availableColors.length; c++) {
                var col = getCarColor(car.availableColors[c]);
                if (col)
                    colors.push(col);
            }
            return {
                carId: car.id,
                colorId: colors[selectedColorIndex].id,
                confirmed: true
            };
        }
        else {
            return {
                carId: 'sports',
                colorId: 'yellow',
                confirmed: false
            };
        }
    },
    render: function (composer, cars, selectedIndex, currentColor, colorIndex, totalColors) {
        composer.clear();
        var width = 80;
        var titleAttr = makeAttr(LIGHTCYAN, BG_BLACK);
        var title = '=== SELECT YOUR VEHICLE ===';
        composer.writeString(Math.floor((width - title.length) / 2), 1, title, titleAttr);
        var instructAttr = makeAttr(DARKGRAY, BG_BLACK);
        composer.writeString(5, 22, 'W/S: Car  A/D: Color  ENTER: Select  Q: Cancel', instructAttr);
        var listX = 3;
        var listY = 4;
        var listAttr = makeAttr(LIGHTGRAY, BG_BLACK);
        var selectedAttr = makeAttr(WHITE, BG_BLUE);
        var lockedAttr = makeAttr(DARKGRAY, BG_BLACK);
        for (var i = 0; i < cars.length; i++) {
            var car = cars[i];
            var y = listY + i * 2;
            var attr = (i === selectedIndex) ? selectedAttr : (car.unlocked ? listAttr : lockedAttr);
            var indicator = (i === selectedIndex) ? '>' : ' ';
            composer.writeString(listX, y, indicator, attr);
            var name = car.unlocked ? car.name : '??? LOCKED ???';
            composer.writeString(listX + 2, y, name, attr);
            if (!car.unlocked) {
                composer.writeString(listX + 2, y + 1, car.unlockHint || 'Complete challenges', lockedAttr);
            }
        }
        var detailX = 40;
        var detailY = 4;
        var currentCar = cars[selectedIndex];
        if (currentCar.unlocked) {
            var nameAttr = makeAttr(YELLOW, BG_BLACK);
            composer.writeString(detailX, detailY, currentCar.name, nameAttr);
            var descAttr = makeAttr(LIGHTGRAY, BG_BLACK);
            composer.writeString(detailX, detailY + 1, currentCar.description, descAttr);
            var statsY = detailY + 3;
            var statLabelAttr = makeAttr(CYAN, BG_BLACK);
            var statBarAttr = makeAttr(LIGHTGREEN, BG_BLACK);
            var statBarEmptyAttr = makeAttr(DARKGRAY, BG_BLACK);
            composer.writeString(detailX, statsY, 'TOP SPEED:', statLabelAttr);
            this.renderStatBar(composer, detailX + 11, statsY, currentCar.stats.topSpeed, statBarAttr, statBarEmptyAttr);
            composer.writeString(detailX, statsY + 1, 'ACCEL:', statLabelAttr);
            this.renderStatBar(composer, detailX + 11, statsY + 1, currentCar.stats.acceleration, statBarAttr, statBarEmptyAttr);
            composer.writeString(detailX, statsY + 2, 'HANDLING:', statLabelAttr);
            this.renderStatBar(composer, detailX + 11, statsY + 2, currentCar.stats.handling, statBarAttr, statBarEmptyAttr);
            var colorY = statsY + 5;
            var colorLabelAttr = makeAttr(LIGHTMAGENTA, BG_BLACK);
            composer.writeString(detailX, colorY, 'COLOR: < ' + currentColor.name + ' >', colorLabelAttr);
            composer.writeString(detailX, colorY + 1, '(' + (colorIndex + 1) + '/' + totalColors + ')', instructAttr);
            var previewY = colorY + 3;
            this.renderCarPreview(composer, detailX + 8, previewY, currentCar.bodyStyle, currentColor);
        }
        else {
            var lockedMsgAttr = makeAttr(RED, BG_BLACK);
            composer.writeString(detailX, detailY, 'VEHICLE LOCKED', lockedMsgAttr);
            composer.writeString(detailX, detailY + 2, currentCar.unlockHint || 'Complete challenges to unlock', lockedAttr);
        }
        this.outputToConsole(composer);
    },
    outputToConsole: function (composer) {
        console.clear(BG_BLACK, false);
        var buffer = composer.getBuffer();
        for (var y = 0; y < buffer.length; y++) {
            console.gotoxy(1, y + 1);
            for (var x = 0; x < buffer[y].length; x++) {
                var cell = buffer[y][x];
                console.attributes = cell.attr;
                console.print(cell.char);
            }
        }
    },
    renderStatBar: function (composer, x, y, value, filledAttr, emptyAttr) {
        var filled = Math.round(value * 5);
        filled = Math.max(1, Math.min(10, filled));
        for (var i = 0; i < 10; i++) {
            var char = (i < filled) ? GLYPH.FULL_BLOCK : GLYPH.LIGHT_SHADE;
            var attr = (i < filled) ? filledAttr : emptyAttr;
            composer.setCell(x + i, y, char, attr);
        }
    },
    renderCarPreview: function (composer, x, y, bodyStyle, color) {
        var sprite = getPlayerCarSprite(bodyStyle, color.id, false);
        var variant = sprite.variants[0];
        for (var row = 0; row < variant.length; row++) {
            for (var col = 0; col < variant[row].length; col++) {
                var cell = variant[row][col];
                if (cell) {
                    composer.setCell(x + col, y + row, cell.char, cell.attr);
                }
            }
        }
        var labelAttr = makeAttr(DARKGRAY, BG_BLACK);
        composer.writeString(x - 2, y + 3, '(preview)', labelAttr);
    }
};
