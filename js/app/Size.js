define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        Size.square = function (width) {
            return new Size(width, width);
        };
        Size.prototype.scale = function (value) {
            return new Size(this.width * value, this.height * value);
        };
        return Size;
    }());
    exports.Size = Size;
});
//# sourceMappingURL=Size.js.map