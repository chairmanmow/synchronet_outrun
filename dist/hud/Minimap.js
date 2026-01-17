"use strict";
var Minimap = (function () {
    function Minimap(config) {
        this.config = config;
        this.scaleX = 1;
        this.scaleY = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    Minimap.prototype.initForTrack = function (track) {
        var minX = Infinity, maxX = -Infinity;
        var minY = Infinity, maxY = -Infinity;
        for (var i = 0; i < track.centerline.length; i++) {
            var p = track.centerline[i];
            if (p.x < minX)
                minX = p.x;
            if (p.x > maxX)
                maxX = p.x;
            if (p.y < minY)
                minY = p.y;
            if (p.y > maxY)
                maxY = p.y;
        }
        var trackWidth = maxX - minX;
        var trackHeight = maxY - minY;
        var mapInnerW = this.config.width - 2;
        var mapInnerH = this.config.height - 2;
        this.scaleX = mapInnerW / (trackWidth || 1);
        this.scaleY = mapInnerH / (trackHeight || 1);
        var scale = Math.min(this.scaleX, this.scaleY);
        this.scaleX = scale;
        this.scaleY = scale;
        this.offsetX = -minX;
        this.offsetY = -minY;
    };
    Minimap.prototype.worldToMinimap = function (worldX, worldY) {
        return {
            x: Math.round((worldX + this.offsetX) * this.scaleX) + this.config.x + 1,
            y: Math.round((worldY + this.offsetY) * this.scaleY) + this.config.y + 1
        };
    };
    Minimap.prototype.getVehiclePositions = function (vehicles, track, playerId) {
        var result = [];
        for (var i = 0; i < vehicles.length; i++) {
            var v = vehicles[i];
            var progress = (v.z % track.length) / track.length;
            var centerlineIdx = Math.floor(progress * track.centerline.length);
            var centerPoint = track.centerline[centerlineIdx] || { x: 0, y: 0 };
            var pos = this.worldToMinimap(centerPoint.x + v.x * 0.1, centerPoint.y);
            result.push({
                x: pos.x,
                y: pos.y,
                isPlayer: v.id === playerId,
                color: v.color
            });
        }
        return result;
    };
    Minimap.prototype.getConfig = function () {
        return this.config;
    };
    return Minimap;
}());
