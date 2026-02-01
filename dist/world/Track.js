"use strict";
var Track = (function () {
    function Track() {
        this.name = "Unnamed Track";
        this.centerline = [];
        this.width = 40;
        this.length = 0;
        this.checkpoints = [];
        this.spawnPoints = [];
        this.laps = 3;
        this.scenery = {
            sky: {
                type: 'sunset',
                sunAzimuth: 270,
                horizonColors: ['#ff00ff', '#ff6600', '#ffff00']
            },
            props: {
                palmTrees: 0.5,
                buildings: 0.3,
                billboards: 0.2
            },
            road: {
                color: '#333333',
                stripeColor: '#ffffff',
                stripeWidth: 2
            },
            skyline: {
                style: 'city',
                density: 0.5
            }
        };
    }
    Track.prototype.getCenterlineX = function (z) {
        if (this.centerline.length < 2)
            return 0;
        var wrappedZ = z % this.length;
        if (wrappedZ < 0)
            wrappedZ += this.length;
        var segmentLength = this.length / this.centerline.length;
        var segmentIndex = Math.floor(wrappedZ / segmentLength);
        var t = (wrappedZ % segmentLength) / segmentLength;
        var p1 = this.centerline[segmentIndex];
        var p2 = this.centerline[(segmentIndex + 1) % this.centerline.length];
        return lerp(p1.x, p2.x, t);
    };
    Track.prototype.getDirection = function (z) {
        if (this.centerline.length < 2)
            return 0;
        var segmentLength = this.length / this.centerline.length;
        var segmentIndex = Math.floor((z % this.length) / segmentLength);
        var p1 = this.centerline[segmentIndex];
        var p2 = this.centerline[(segmentIndex + 1) % this.centerline.length];
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };
    return Track;
}());
