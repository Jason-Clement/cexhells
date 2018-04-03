define(["require", "exports", "./Hex", "./Point", "lib/easeljs"], function (require, exports, Hex_1, Point_1) {
    "use strict";
    exports.__esModule = true;
    var HexMap = /** @class */ (function () {
        function HexMap() {
            this.background = new createjs.Shape();
            this.hexes = {};
        }
        HexMap.rectangle = function (layout) {
            var width = layout.size.width;
            var height = layout.size.height;
            var map = new HexMap();
            var i1 = -Math.floor(height / 2);
            var i2 = i1 + height;
            var j1 = -Math.floor(width / 2);
            var j2 = j1 + width;
            for (var j = j1; j < j2; j++) {
                var jOffset = -Math.floor(j / 2);
                for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
                    var hex = Hex_1.Hex.fromSQ(i, j);
                    map.hexes[hex.hash()] = hex;
                }
            }
            map.populateNeighbors();
            return map;
        };
        HexMap.prototype.get = function (q, r) {
            return this.hexes[Hex_1.Hex.fromQR(q, r).hash()];
        };
        HexMap.prototype.redraw = function () {
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    this.hexes[key].draw();
                }
            }
        };
        HexMap.prototype.draw = function (stage, layout) {
            var canvas = stage.canvas;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            var offset = this.centerOffset(layout);
            this.background.graphics.beginFill("#e7e7e7").drawRect(0, 0, width, height);
            stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    stage.addChild(this.hexes[key].shape);
                    stage.addChild(this.hexes[key].text);
                    this.hexes[key].draw(stage, layout);
                }
            }
        };
        HexMap.prototype.centerOffset = function (layout) {
            var c1 = new Point_1.Point(0, 0);
            var c2 = new Point_1.Point(0, 0);
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    var hex = this.hexes[key];
                    var corners = layout.hexCorners(hex);
                    for (var _i = 0, corners_1 = corners; _i < corners_1.length; _i++) {
                        var corner = corners_1[_i];
                        if (corner.x < c1.x) {
                            c1.x = corner.x;
                        }
                        if (corner.y < c1.y) {
                            c1.y = corner.y;
                        }
                        if (corner.x > c2.x) {
                            c2.x = corner.x;
                        }
                        if (corner.y > c2.y) {
                            c2.y = corner.y;
                        }
                    }
                }
            }
            return new Point_1.Point(Math.round((c2.x - Math.abs(c1.x)) / 2), Math.round((c2.y - Math.abs(c1.y)) / 2));
        };
        HexMap.prototype.populateNeighbors = function () {
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    var hex = this.hexes[key];
                    hex.neighbors = [];
                    for (var i = 0; i < Hex_1.Hex.directions.length; i++) {
                        var n = hex.neighbor(i);
                        hex.neighbors.push(this.get(n.q, n.r));
                    }
                }
            }
        };
        return HexMap;
    }());
    exports.HexMap = HexMap;
});
//# sourceMappingURL=HexMap.js.map