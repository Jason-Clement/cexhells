var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./App", "./Hex", "./HexBase", "./Layout", "./Point", "./Size", "lib/easeljs"], function (require, exports, App_1, Hex_1, HexBase_1, Layout_1, Point_1, Size_1) {
    "use strict";
    exports.__esModule = true;
    var Board = /** @class */ (function (_super) {
        __extends(Board, _super);
        function Board(hexCount) {
            var _this = _super.call(this, hexCount) || this;
            _this.hexCount = hexCount;
            _this.background = new createjs.Shape();
            _this.hexes = {};
            _this.init(hexCount.width, hexCount.height);
            return _this;
        }
        Board.prototype.init = function (width, height) {
            this.hexCount = new Size_1.Size(width, height);
            this.hexes = {};
            this.resize();
            var i1 = -Math.floor(height / 2);
            var i2 = i1 + height;
            var j1 = -Math.floor(width / 2);
            var j2 = j1 + width;
            for (var j = j1; j < j2; j++) {
                var jOffset = -Math.floor(j / 2);
                for (var i = i1 + jOffset; i < i2 + jOffset; i++) {
                    var hex = HexBase_1.HexBase.fromSQ(i, j);
                    this.hexes[hex.hash()] = Hex_1.Hex.fromHexBase(hex);
                }
            }
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    var hex = this.hexes[key];
                    hex.neighbors = [];
                    for (var i = 0; i < HexBase_1.HexBase.directions.length; i++) {
                        var n = hex.neighbor(i);
                        hex.neighbors.push(this.get(n.q, n.r));
                    }
                }
            }
        };
        Board.prototype.get = function (q, r) {
            return this.hexes[HexBase_1.HexBase.fromQR(q, r).hash()];
        };
        Board.prototype.resize = function () {
            this.hexSize = Size_1.Size.square(Math.min(Math.floor(App_1.App.width() / this.hexCount.width / 1.5), Math.floor(App_1.App.height() / (Math.sqrt(3) * this.hexCount.height))));
            var canvas = App_1.App.canvas;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            var offset = this.centerOffset();
            App_1.App.stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
        };
        Board.prototype.redraw = function () {
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    this.hexes[key].draw();
                }
            }
        };
        Board.prototype.draw = function () {
            var canvas = App_1.App.canvas;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            var offset = this.centerOffset();
            this.background.graphics.beginFill("#e7e7e7").drawRect(0, 0, width, height);
            App_1.App.stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    App_1.App.stage.addChild(this.hexes[key].shape);
                    App_1.App.stage.addChild(this.hexes[key].text);
                    this.hexes[key].draw();
                }
            }
        };
        Board.prototype["import"] = function (s) {
            var lineStrings = s.split("\n");
            if (lineStrings.length < 6)
                return false;
            var title = lineStrings[1];
            var author = lineStrings[2];
            var info = lineStrings[3];
            if (lineStrings[4].replace(/\s/, "").length > 0)
                info += "\n" + lineStrings[4];
            lineStrings.splice(0, 5);
            for (var i = lineStrings.length - 1; i >= 0; i--) {
                lineStrings[i] = lineStrings[i].replace(/\s/, "");
                if (lineStrings[i].length === 0)
                    lineStrings.splice(i, 1);
            }
            if (lineStrings.length === 0)
                return false;
            var len = lineStrings[0].length;
            if (len % 2 !== 0)
                return false;
            for (var _i = 0, lineStrings_1 = lineStrings; _i < lineStrings_1.length; _i++) {
                var lineString = lineStrings_1[_i];
                if (lineString.length !== len)
                    return false;
                if (/[^oOxX\\\|\/\[\-\]\.\+cn]/.test(lineString))
                    return false;
            }
            this.init(len / 2, Math.ceil(lineStrings.length / 2));
            var lines = [];
            for (var k = -1; k < lineStrings.length; k += 2) {
                var line1 = "";
                if (k > -1)
                    line1 = lineStrings[k];
                var line2 = "";
                if (k + 1 < lineStrings.length)
                    line2 = lineStrings[k + 1];
                var cOffset = -Math.floor(len / 4);
                var r = Math.floor(lineStrings.length / 4) - Math.floor((k + 1) / 2);
                for (var i = 0; i < len; i += 2) {
                    var lineT = i % 4 === 0 ? line2 : line1;
                    var st = lineT === "" ? ".." : lineT.substr(i, 2);
                    var h = Hex_1.Hex.fromAxial(i / 2 + cOffset, r);
                    var h2 = this.get(h.q, h.r);
                    h2["import"](st);
                }
            }
            this.draw();
            App_1.App.stage.update();
        };
        Board.prototype.centerOffset = function () {
            var c1 = new Point_1.Point(0, 0);
            var c2 = new Point_1.Point(0, 0);
            for (var key in this.hexes) {
                if (this.hexes.hasOwnProperty(key)) {
                    var hex = this.hexes[key];
                    var corners = this.hexCorners(hex);
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
        return Board;
    }(Layout_1.Layout));
    exports.Board = Board;
});
//# sourceMappingURL=Board.js.map