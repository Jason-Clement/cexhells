/* tslint:disable:no-bitwise */
define(["require", "exports", "./Point", "lib/easeljs"], function (require, exports, Point_1) {
    "use strict";
    exports.__esModule = true;
    var HexBase = /** @class */ (function () {
        function HexBase(q, r, s) {
            this.q = q;
            this.r = r;
            this.s = s;
            this.sideCount = [];
            this.surroundCount = 0;
            this.extendCount = 0;
            for (var i = 0; i < 6; i++) {
                this.sideCount.push(0);
            }
        }
        HexBase.fromQR = function (q, r) {
            return new HexBase(q, r, -q - r);
        };
        HexBase.fromQS = function (q, s) {
            return new HexBase(q, -q - s, s);
        };
        HexBase.fromRS = function (r, s) {
            return new HexBase(-r - s, r, s);
        };
        HexBase.fromRQ = function (r, q) {
            return new HexBase(q, r, -q - r);
        };
        HexBase.fromSQ = function (s, q) {
            return new HexBase(q, -q - s, s);
        };
        HexBase.fromSR = function (s, r) {
            return new HexBase(-r - s, r, s);
        };
        HexBase.fromAxial = function (col, row) {
            var q = col;
            var s = row - (col - (col & 1)) / 2;
            return HexBase.fromQS(q, s);
        };
        HexBase.prototype.toAxial = function () {
            var col = this.q;
            var row = this.s + (this.q - (this.q & 1)) / 2;
            return new Point_1.Point(col, row);
        };
        HexBase.prototype.hash = function () {
            return this.q + "," + this.r;
        };
        HexBase.prototype.add = function (h) {
            return new HexBase(this.q + h.q, this.r + h.r, this.s + h.s);
        };
        HexBase.prototype.neighbor = function (direction) {
            return this.add(HexBase.directions[direction]);
        };
        HexBase.prototype.round = function () {
            var q = Math.floor(Math.round(this.q));
            var r = Math.floor(Math.round(this.r));
            var s = Math.floor(Math.round(this.s));
            var qD = Math.abs(q - this.q);
            var rD = Math.abs(r - this.r);
            var sD = Math.abs(s - this.s);
            if (qD > rD && qD > sD) {
                q = -r - s;
            }
            else {
                if (rD > sD) {
                    r = -q - s;
                }
                else {
                    s = -q - r;
                }
            }
            return new HexBase(q, r, s);
        };
        HexBase.directions = [
            new HexBase(1, 0, -1),
            new HexBase(1, -1, 0),
            new HexBase(0, -1, 1),
            new HexBase(-1, 0, 1),
            new HexBase(-1, 1, 0),
            new HexBase(0, 1, -1),
        ];
        return HexBase;
    }());
    exports.HexBase = HexBase;
});
//# sourceMappingURL=HexBase.js.map