define(["require", "exports", "./HexBase", "./Orientation", "./Point"], function (require, exports, HexBase_1, Orientation_1, Point_1) {
    "use strict";
    exports.__esModule = true;
    var Layout = /** @class */ (function () {
        function Layout(hexCount) {
            this.hexCount = hexCount;
            this.origin = new Point_1.Point(0, 0);
            this.orientation = Orientation_1.Orientation.flat;
        }
        Layout.prototype.hexToPixel = function (hex) {
            var o = this.orientation;
            var x = (o.f0 * hex.q + o.f1 * hex.r) * this.hexSize.width;
            var y = (o.f2 * hex.q + o.f3 * hex.r) * this.hexSize.height;
            return new Point_1.Point(x + this.origin.x, y + this.origin.y);
        };
        Layout.prototype.pixelToHex = function (point) {
            var o = this.orientation;
            var p = new Point_1.Point((point.x - this.origin.x) / this.hexSize.width, (point.y - this.origin.y) / this.hexSize.height);
            var q = o.b0 * p.x + o.b1 * p.y;
            var r = o.b2 * p.x + o.b3 * p.y;
            return new HexBase_1.HexBase(q, r, -q - r);
        };
        Layout.prototype.hexCornerOffset = function (corner, size) {
            if (size === void 0) { size = this.hexSize; }
            var o = this.orientation;
            var angle = 2 * Math.PI * (o.startAngle + corner) / 6;
            return new Point_1.Point(size.width * Math.cos(angle), size.height * Math.sin(angle));
        };
        Layout.prototype.hexSideOffset = function (side, size) {
            if (size === void 0) { size = this.hexSize; }
            var o = this.orientation;
            var angle = 2 * Math.PI * (o.startAngle + 0.5 + side) / 6;
            return new Point_1.Point(size.width * Math.cos(angle), size.height * Math.sin(angle));
        };
        Layout.prototype.hexSideAngle = function (side, size) {
            if (size === void 0) { size = this.hexSize; }
            var o = this.orientation;
            return 2 * Math.PI * (o.startAngle + 0.5 + side) / 6;
        };
        Layout.prototype.hexCorners = function (hex, size) {
            if (size === void 0) { size = this.hexSize; }
            var corners = [];
            var center = this.hexToPixel(hex);
            for (var i = 0; i < 6; i++) {
                var offset = this.hexCornerOffset(i, size);
                corners.push(new Point_1.Point(center.x + offset.x, center.y + offset.y));
            }
            return corners;
        };
        return Layout;
    }());
    exports.Layout = Layout;
});
//# sourceMappingURL=Layout.js.map