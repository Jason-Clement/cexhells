define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Settings = /** @class */ (function () {
        function Settings() {
        }
        Settings.hexColors = {
            blue: { border: "#149cd8", fill: "#05a4eb", text: "white" },
            covered: { border: "#ff9f00", fill: "#ffaf29", text: "white" },
            invisible: { border: "transparent", fill: "transparent", text: "#464646" },
            invisibleEditing: { border: "#f0f0f0", fill: "white", text: "#464646" },
            normal: { border: "#2c2f31", fill: "#3e3e3e", text: "white" }
        };
        Settings.hexFontScales = {
            blue: 0.72,
            invisible: 0.64,
            normal: 0.72
        };
        return Settings;
    }());
    exports.Settings = Settings;
});
//# sourceMappingURL=Settings.js.map