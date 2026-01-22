"use strict";
var CAR_COLORS = {
    'yellow': {
        id: 'yellow',
        name: 'Sunshine Yellow',
        body: YELLOW,
        trim: WHITE,
        effectFlash: LIGHTCYAN
    },
    'red': {
        id: 'red',
        name: 'Racing Red',
        body: LIGHTRED,
        trim: WHITE,
        effectFlash: YELLOW
    },
    'blue': {
        id: 'blue',
        name: 'Electric Blue',
        body: LIGHTBLUE,
        trim: LIGHTCYAN,
        effectFlash: YELLOW
    },
    'green': {
        id: 'green',
        name: 'Neon Green',
        body: LIGHTGREEN,
        trim: WHITE,
        effectFlash: LIGHTMAGENTA
    },
    'cyan': {
        id: 'cyan',
        name: 'Cyber Cyan',
        body: LIGHTCYAN,
        trim: WHITE,
        effectFlash: LIGHTMAGENTA
    },
    'magenta': {
        id: 'magenta',
        name: 'Synthwave Pink',
        body: LIGHTMAGENTA,
        trim: WHITE,
        effectFlash: LIGHTCYAN
    },
    'white': {
        id: 'white',
        name: 'Ghost White',
        body: WHITE,
        trim: LIGHTCYAN,
        effectFlash: YELLOW
    },
    'orange': {
        id: 'orange',
        name: 'Sunset Orange',
        body: YELLOW,
        trim: LIGHTRED,
        effectFlash: LIGHTCYAN
    }
};
var CAR_CATALOG = [
    {
        id: 'sports',
        name: 'TURBO GT',
        description: 'Balanced performance for all tracks',
        bodyStyle: 'sports',
        stats: {
            topSpeed: 1.0,
            acceleration: 1.0,
            handling: 1.0
        },
        availableColors: ['yellow', 'red', 'blue', 'green', 'cyan', 'magenta', 'white'],
        defaultColor: 'yellow',
        brakeLights: [{ x: 0, y: 1 }, { x: 4, y: 1 }],
        unlocked: true
    },
    {
        id: 'muscle',
        name: 'THUNDER V8',
        description: 'Raw power, slower handling',
        bodyStyle: 'muscle',
        stats: {
            topSpeed: 1.15,
            acceleration: 1.1,
            handling: 0.85
        },
        availableColors: ['red', 'yellow', 'blue', 'white', 'orange'],
        defaultColor: 'red',
        brakeLights: [{ x: 0, y: 1 }, { x: 4, y: 1 }],
        unlocked: true
    },
    {
        id: 'compact',
        name: 'SWIFT RS',
        description: 'Quick and nimble, lower top speed',
        bodyStyle: 'compact',
        stats: {
            topSpeed: 0.9,
            acceleration: 1.2,
            handling: 1.25
        },
        availableColors: ['cyan', 'green', 'magenta', 'yellow', 'white'],
        defaultColor: 'cyan',
        brakeLights: [{ x: 0, y: 1 }, { x: 4, y: 1 }],
        unlocked: true
    },
    {
        id: 'super',
        name: 'PHANTOM X',
        description: 'Elite supercar - unlock to drive',
        bodyStyle: 'super',
        stats: {
            topSpeed: 1.2,
            acceleration: 1.15,
            handling: 1.1
        },
        availableColors: ['white', 'red', 'blue', 'magenta'],
        defaultColor: 'white',
        brakeLights: [{ x: 0, y: 1 }, { x: 4, y: 1 }],
        unlocked: false,
        unlockHint: 'Win a Grand Prix to unlock'
    },
    {
        id: 'classic',
        name: 'RETRO 86',
        description: 'Old school charm, balanced feel',
        bodyStyle: 'classic',
        stats: {
            topSpeed: 0.95,
            acceleration: 1.0,
            handling: 1.05
        },
        availableColors: ['yellow', 'red', 'white', 'green', 'blue'],
        defaultColor: 'yellow',
        brakeLights: [{ x: 0, y: 1 }, { x: 4, y: 1 }],
        unlocked: true
    }
];
function getCarDefinition(carId) {
    for (var i = 0; i < CAR_CATALOG.length; i++) {
        if (CAR_CATALOG[i].id === carId) {
            return CAR_CATALOG[i];
        }
    }
    return null;
}
function getCarColor(colorId) {
    return CAR_COLORS[colorId] || null;
}
function getUnlockedCars() {
    var unlocked = [];
    for (var i = 0; i < CAR_CATALOG.length; i++) {
        if (CAR_CATALOG[i].unlocked) {
            unlocked.push(CAR_CATALOG[i]);
        }
    }
    return unlocked;
}
function getAllCars() {
    return CAR_CATALOG.slice();
}
function unlockCar(carId) {
    for (var i = 0; i < CAR_CATALOG.length; i++) {
        if (CAR_CATALOG[i].id === carId) {
            CAR_CATALOG[i].unlocked = true;
            return true;
        }
    }
    return false;
}
function isCarUnlocked(carId) {
    var car = getCarDefinition(carId);
    return car !== null && car.unlocked;
}
function getEffectFlashColor(colorId) {
    var color = getCarColor(colorId);
    return color ? color.effectFlash : LIGHTCYAN;
}
function applyCarStats(carId) {
    var car = getCarDefinition(carId);
    if (!car)
        return;
    if (typeof VEHICLE_PHYSICS._baseMaxSpeed === 'undefined') {
        VEHICLE_PHYSICS._baseMaxSpeed = VEHICLE_PHYSICS.MAX_SPEED;
        VEHICLE_PHYSICS._baseAccel = VEHICLE_PHYSICS.ACCEL;
        VEHICLE_PHYSICS._baseSteer = VEHICLE_PHYSICS.STEER_RATE;
    }
    VEHICLE_PHYSICS.MAX_SPEED = VEHICLE_PHYSICS._baseMaxSpeed * car.stats.topSpeed;
    VEHICLE_PHYSICS.ACCEL = VEHICLE_PHYSICS._baseAccel * car.stats.acceleration;
    VEHICLE_PHYSICS.STEER_RATE = VEHICLE_PHYSICS._baseSteer * car.stats.handling;
    logInfo('Applied car stats for ' + car.name +
        ': speed=' + VEHICLE_PHYSICS.MAX_SPEED.toFixed(0) +
        ', accel=' + VEHICLE_PHYSICS.ACCEL.toFixed(0) +
        ', steer=' + VEHICLE_PHYSICS.STEER_RATE.toFixed(2));
}
function resetCarStats() {
    if (typeof VEHICLE_PHYSICS._baseMaxSpeed !== 'undefined') {
        VEHICLE_PHYSICS.MAX_SPEED = VEHICLE_PHYSICS._baseMaxSpeed;
        VEHICLE_PHYSICS.ACCEL = VEHICLE_PHYSICS._baseAccel;
        VEHICLE_PHYSICS.STEER_RATE = VEHICLE_PHYSICS._baseSteer;
    }
}
