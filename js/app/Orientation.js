define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var OrientationType;
    (function (OrientationType) {
        OrientationType[OrientationType["Pointy"] = 0] = "Pointy";
        OrientationType[OrientationType["Flat"] = 1] = "Flat";
    })(OrientationType = exports.OrientationType || (exports.OrientationType = {}));
    var Orientation = /** @class */ (function () {
        function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
            this.f0 = f0;
            this.f1 = f1;
            this.f2 = f2;
            this.f3 = f3;
            this.b0 = b0;
            this.b1 = b1;
            this.b2 = b2;
            this.b3 = b3;
            this.startAngle = startAngle;
        }
        Orientation.pointy = new Orientation(Math.sqrt(3), Math.sqrt(3) / 2, 0, 3 / 2, Math.sqrt(3) / 3, -1 / 3, 0, 2 / 3, 0.5);
        Orientation.flat = new Orientation(3 / 2, 0, Math.sqrt(3) / 2, Math.sqrt(3), 2 / 3, 0, -1 / 3, Math.sqrt(3) / 3, 0);
        return Orientation;
    }());
    exports.Orientation = Orientation;
});
//# sourceMappingURL=Orientation.js.map