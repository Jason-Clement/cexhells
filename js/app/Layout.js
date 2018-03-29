define(["require", "exports", "./Hex", "./Orientation", "./Point", "./Size"], function (require, exports, Hex_1, Orientation_1, Point_1, Size_1) {
    "use strict";
    exports.__esModule = true;
    var Layout = /** @class */ (function () {
        function Layout(orientationType, size, hexSize, origin) {
            this.orientationType = orientationType;
            this.size = size;
            this.hexSize = hexSize;
            this.origin = origin;
            this.orientation = orientationType === Orientation_1.OrientationType.Flat ? Orientation_1.Orientation.flat : Orientation_1.Orientation.pointy;
        }
        Layout.fillBySize = function (orientationType, hexSize, fillSize) {
            var layout = new Layout(orientationType, new Size_1.Size(0, 0), hexSize, new Point_1.Point(0, 0));
            layout.size.width = layout.fillToWidth(fillSize.width);
            layout.size.height = layout.fillToHeight(fillSize.height);
            return layout;
        };
        Layout.fillByCount = function (orientationType, hexCount, fillSize) {
            var layout = new Layout(orientationType, hexCount, new Size_1.Size(0, 0), new Point_1.Point(0, 0));
            if (orientationType === Orientation_1.OrientationType.Pointy) {
                layout.hexSize = Size_1.Size.square(Math.min(Math.floor(fillSize.width / (Math.sqrt(3) * hexCount.width)), Math.floor(fillSize.height / hexCount.height / 1.5)));
            }
            else {
                layout.hexSize = Size_1.Size.square(Math.min(Math.floor(fillSize.width / hexCount.width / 1.5), Math.floor(fillSize.height / (Math.sqrt(3) * hexCount.height))));
            }
            return layout;
        };
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
            return new Hex_1.Hex(q, r, -q - r);
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
        Layout.prototype.fillToWidth = function (width) {
            if (this.orientationType === Orientation_1.OrientationType.Pointy) {
                return Math.floor(width / (Math.sqrt(3) * this.hexSize.width));
            }
            else {
                return Math.floor(width / (2 * this.hexSize.width * 0.75));
            }
        };
        Layout.prototype.fillToHeight = function (height) {
            if (this.orientationType === Orientation_1.OrientationType.Pointy) {
                return Math.floor(height / (2 * this.hexSize.height * 0.75));
            }
            else {
                return Math.floor(height / (Math.sqrt(3) * this.hexSize.height));
            }
        };
        return Layout;
    }());
    exports.Layout = Layout;
});
//# sourceMappingURL=Layout.js.map