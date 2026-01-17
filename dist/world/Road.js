"use strict";
var Road = (function () {
    function Road() {
        this.segments = [];
        this.segmentLength = 200;
        this.baseWidth = 2000;
        this.totalLength = 0;
        this.laps = 3;
        this.name = "Unnamed Road";
    }
    Road.prototype.getSegment = function (z) {
        var index = Math.floor(z / this.segmentLength) % this.segments.length;
        if (index < 0)
            index += this.segments.length;
        return this.segments[index];
    };
    Road.prototype.getSegmentIndex = function (z) {
        var index = Math.floor(z / this.segmentLength) % this.segments.length;
        if (index < 0)
            index += this.segments.length;
        return index;
    };
    Road.prototype.getCurvature = function (z) {
        return this.getSegment(z).curve;
    };
    Road.prototype.isOnRoad = function (x, z) {
        var segment = this.getSegment(z);
        var halfWidth = segment.width / 2;
        return Math.abs(x) <= halfWidth ? 1 : 0;
    };
    return Road;
}());
var RoadBuilder = (function () {
    function RoadBuilder() {
        this.road = new Road();
        this.currentZ = 0;
        this.currentCurve = 0;
        this.stripeCounter = 0;
        this.stripeLength = 3;
    }
    RoadBuilder.prototype.name = function (n) {
        this.road.name = n;
        return this;
    };
    RoadBuilder.prototype.laps = function (n) {
        this.road.laps = n;
        return this;
    };
    RoadBuilder.prototype.straight = function (numSegments) {
        for (var i = 0; i < numSegments; i++) {
            this.addSegment(0);
        }
        return this;
    };
    RoadBuilder.prototype.curve = function (numSegments, curvature) {
        for (var i = 0; i < numSegments; i++) {
            this.addSegment(curvature);
        }
        return this;
    };
    RoadBuilder.prototype.easeIn = function (numSegments, targetCurve) {
        var startCurve = this.currentCurve;
        for (var i = 0; i < numSegments; i++) {
            var t = i / numSegments;
            this.addSegment(lerp(startCurve, targetCurve, t));
        }
        this.currentCurve = targetCurve;
        return this;
    };
    RoadBuilder.prototype.easeOut = function (numSegments) {
        var startCurve = this.currentCurve;
        for (var i = 0; i < numSegments; i++) {
            var t = i / numSegments;
            this.addSegment(lerp(startCurve, 0, t));
        }
        this.currentCurve = 0;
        return this;
    };
    RoadBuilder.prototype.addSegment = function (curve) {
        this.road.segments.push({
            z: this.currentZ,
            curve: curve,
            hill: 0,
            width: 1.0,
            stripe: Math.floor(this.stripeCounter / this.stripeLength) % 2,
            spriteLeft: null,
            spriteRight: null
        });
        this.currentZ += this.road.segmentLength;
        this.stripeCounter++;
    };
    RoadBuilder.prototype.build = function () {
        this.road.totalLength = this.currentZ;
        return this.road;
    };
    return RoadBuilder;
}());
function createNeonCoastRoad() {
    return new RoadBuilder()
        .name("Neon Coast")
        .laps(3)
        .straight(30)
        .easeIn(10, 0.4)
        .curve(30, 0.4)
        .easeOut(10)
        .straight(40)
        .easeIn(8, -0.6)
        .curve(25, -0.6)
        .easeOut(8)
        .straight(25)
        .easeIn(6, 0.5)
        .curve(15, 0.5)
        .easeOut(6)
        .easeIn(6, -0.5)
        .curve(15, -0.5)
        .easeOut(6)
        .straight(35)
        .build();
}
