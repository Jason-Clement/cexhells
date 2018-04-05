/* tslint:disable:no-console */
define(["require", "exports", "./AppMode", "./Board", "./Size", "lib/easeljs"], function (require, exports, AppMode_1, Board_1, Size_1) {
    "use strict";
    exports.__esModule = true;
    var App = /** @class */ (function () {
        function App() {
        }
        App.width = function () {
            return this.canvas.clientWidth * 0.9;
        };
        App.height = function () {
            return this.canvas.clientHeight * 0.9;
        };
        App.start = function (canvas) {
            App.canvas = canvas;
            App.stage = new createjs.Stage(canvas);
            App.board = new Board_1.Board(new Size_1.Size(10, 10));
            for (var key in App.board.hexes) {
                if (App.board.hexes.hasOwnProperty(key)) {
                    App.board.hexes[key].randomize();
                }
            }
            // App.board.import(App.importString);
            canvas.oncontextmenu = function () { return false; };
            window.addEventListener("resize", function () {
                App.draw();
            });
            window.addEventListener("keypress", function (event) {
                if (event.key === "e") {
                    if (App.mode !== AppMode_1.AppMode.Edit)
                        App.mode = AppMode_1.AppMode.Edit;
                    else
                        App.mode = AppMode_1.AppMode.EditInit;
                    App.board.redraw();
                    App.stage.update();
                }
            });
            App.board.draw();
            App.draw();
        };
        App.draw = function () {
            App.canvas.width = App.canvas.parentElement.offsetWidth;
            App.canvas.height = App.canvas.parentElement.offsetHeight;
            App.board.resize();
            App.board.redraw();
            App.stage.update();
        };
        App.mode = AppMode_1.AppMode.Edit;
        App.importString = "\n\n\n\n\n"
            + "............|n..|+..|+......|+......|+............................\n"
            + "..............\\+..\\+..|+................../+..\\c..................\n"
            + "............x+..x...o...x...o...x...x...o...o...o...x.............\n"
            + "......\\+..x...x...o+..x...x+..x...o...o+..x...x...o...x...........\n"
            + "........o...o...o+..o+..o...x+..o+..x...o+..o+..o+..o+..x+........\n"
            + "..........x...x...o...x...o+..o+..x...o+..x...x...o+..o...|n......\n"
            + "....|n..o+..x...o+..x...o...o...o+..o...o+..o+..o+..o+..x.........\n"
            + "......oc..o+..x...x...o...o...oc..o+..o...x...o+..x...o...x+......\n"
            + "....x...o...x...o+..x...x...x...oc..o...o...o+..x...x...x...x.....\n"
            + "......x...o...x...x...o...o...x...oc..o...x...o+..o+..o+..o.......\n"
            + "....o...x...oc..x...oc..x...o+..x...o...x...o+..x...on..x...o.....\n"
            + "......x+..o+..o+..o...o...o+..x...x...on..o+..on..x...on..o+......\n"
            + "....x+..o...o...x...o...o...x...|n..x...x+..x...x...on..on..x.....\n"
            + "......o...o...x...o+..x...o...o+..o...o...x...o+..o+..x...on......\n"
            + "....o+..x...o+..|+..o...o...o+..o+..x+..o...x.......x...x...o.....\n"
            + "......x+..x...x...o...o+..x...o+..o...x...o+..x...x...o+..o+......\n"
            + "....o...x+..o...o...x...o+..x...o...x...x...on..o+..x...x...x.....\n"
            + "......o+..o...x...o+..x...o+..oc..o...x...o+..on..x...o+..on......\n"
            + "....o+..|+..o+..oc..x...x...x...o+..o...x...x...o...o+......o.....\n"
            + "......o+..x...x...o...o+..o+../+..|n..o+..o...o+..o...o...oc......\n"
            + "....o...on..o+..|n..o+..x...x...o+..x...o...o+......x...x+..o.....\n"
            + "......x...o...o+..x...x...o+..o+..o...on..o...x...oc..o...x.../+..\n"
            + "....x...x...o...o+..x...o...x...x...x...x+..o...o+..x...o...oc....\n"
            + "......o+..o...o+..x...o+..x...x...o...o...x...on..o+..o...x.......\n"
            + "....x...on../+..x...o...x...o+..o+..o...x...o...x...|c..x...o+....\n"
            + "......x...o+..o+..o...x...x...o...o+..x...o...x...o...o...x.../+..\n"
            + "....o...o...o...x...o...o...o...x...o...o+..x+..o+..o...o+..o+....\n"
            + "..\\n..o+..o...x...x...o+..x...oc..x...o...x...x...x...x...x+../+..\n"
            + "....x...x...o...o+..o+..on..o...x...o...x...o...x...x+..x...x.....\n"
            + "......o+../n..x...x...x...o...oc..o+..x...x+..x...x.......o.......\n"
            + "....o...x...o+..x...x...x...o...x...on......o+..o...x+..o+..on....\n"
            + "......o...oc..x...o+..o+..o...oc..x...o+..on..o+..o...o...o.......\n"
            + "....x...x...o+..o+..x...x...o+..x...x...o+..x...x...x...x...x.....";
        return App;
    }());
    exports.App = App;
});
//# sourceMappingURL=App.js.map