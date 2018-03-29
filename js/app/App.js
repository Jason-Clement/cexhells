define(["require", "exports", "./Hex", "./HexMap", "./Layout", "./Orientation", "./Size", "lib/easeljs"], function (require, exports, Hex_1, HexMap_1, Layout_1, Orientation_1, Size_1) {
    "use strict";
    exports.__esModule = true;
    var App = /** @class */ (function () {
        function App() {
        }
        App.start = function (canvas) {
            App.canvas = canvas;
            App.stage = new createjs.Stage(canvas);
            App.layout = Layout_1.Layout.fillByCount(Orientation_1.OrientationType.Flat, 
            //new Size(33, 17),
            new Size_1.Size(10, 10), new Size_1.Size(App.canvas.clientWidth * 0.97, App.canvas.clientHeight * 0.97));
            App.map = HexMap_1.HexMap.rectangle(App.layout);
            var types = [Hex_1.HexType.Invisible, Hex_1.HexType.Normal, Hex_1.HexType.Blue];
            for (var key in App.map.hexes) {
                if (App.map.hexes.hasOwnProperty(key)) {
                    App.map.hexes[key].changeType(types[Math.floor(Math.random() * 3)]);
                }
            }
            this.map.draw(App.stage, App.layout);
            App.stage.update();
        };
        return App;
    }());
    exports.App = App;
});
//# sourceMappingURL=App.js.map