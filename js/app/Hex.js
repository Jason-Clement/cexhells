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
define(["require", "exports", "./App", "./AppMode", "./HexBase", "./HexCountType", "./HexType", "./Settings"], function (require, exports, App_1, AppMode_1, HexBase_1, HexCountType_1, HexType_1, Settings_1) {
    "use strict";
    exports.__esModule = true;
    var Hex = /** @class */ (function (_super) {
        __extends(Hex, _super);
        function Hex(q, r, s) {
            var _this = _super.call(this, q, r, s) || this;
            _this.q = q;
            _this.r = r;
            _this.s = s;
            _this.type = HexType_1.HexType.Invisible;
            _this.normalCountType = HexCountType_1.HexCountType.Plain;
            _this.blueCountType = HexCountType_1.HexCountType.Invisible;
            _this.invisibleCountType = HexCountType_1.HexCountType.Plain;
            _this.shape = new createjs.Shape();
            _this.text = new createjs.Text();
            _this.covered = false;
            _this.sideCountDirection = -1;
            _this.neighbors = [];
            _this.addListeners();
            return _this;
        }
        Hex.fromHexBase = function (h) {
            return new Hex(h.q, h.r, h.s);
        };
        Hex.prototype.updateCounts = function (amount) {
            for (var i = 0; i < 6; i++) {
                var n = this.neighbors[i];
                if (n !== undefined) {
                    n.surroundCount += amount;
                    n.extendCount += amount;
                    if (n.neighbors[i] !== undefined) {
                        n.neighbors[i].extendCount += amount;
                    }
                    var j = i === 5 ? 0 : i + 1;
                    if (n.neighbors[j] !== undefined) {
                        n.neighbors[j].extendCount += amount;
                    }
                    j = (i - 3 + 6) % 6;
                    while (n !== undefined) {
                        n.sideCount[j] += amount;
                        n = n.neighbors[i];
                    }
                }
            }
        };
        Hex.prototype.cycleType = function () {
            var newType = HexType_1.HexType.Normal;
            switch (this.type) {
                case HexType_1.HexType.Normal:
                    newType = HexType_1.HexType.Blue;
                    break;
                case HexType_1.HexType.Blue:
                    newType = HexType_1.HexType.Invisible;
                    break;
            }
            this.changeType(newType);
            this.drawAllNeighbors();
            this.draw();
            App_1.App.stage.update();
        };
        Hex.prototype.cycleSideCountSide = function () {
            if (this.type !== HexType_1.HexType.Invisible)
                return;
            var i = this.sideCountDirection;
            i = i === -1 ? 5 : i - 1;
            while (i !== -1 && this.neighbors[i] === undefined) {
                i = i === -1 ? 5 : i - 1;
            }
            this.sideCountDirection = i;
            if (i > -1 && this.invisibleCountType === HexCountType_1.HexCountType.Invisible)
                this.invisibleCountType = HexCountType_1.HexCountType.Plain;
            this.draw();
            App_1.App.stage.update();
        };
        Hex.prototype.cycleCountType = function () {
            switch (this.type) {
                case HexType_1.HexType.Normal:
                    switch (this.normalCountType) {
                        case HexCountType_1.HexCountType.Invisible:
                            this.normalCountType = HexCountType_1.HexCountType.Plain;
                            break;
                        case HexCountType_1.HexCountType.Plain:
                            if (this.surroundCount > 1)
                                this.normalCountType = HexCountType_1.HexCountType.Extended;
                            else
                                this.normalCountType = HexCountType_1.HexCountType.Invisible;
                            break;
                        case HexCountType_1.HexCountType.Extended:
                            this.normalCountType = HexCountType_1.HexCountType.Invisible;
                            break;
                    }
                case HexType_1.HexType.Blue:
                    if (this.blueCountType === HexCountType_1.HexCountType.Plain)
                        this.blueCountType = HexCountType_1.HexCountType.Invisible;
                    else
                        this.blueCountType = HexCountType_1.HexCountType.Plain;
                    break;
                case HexType_1.HexType.Invisible:
                    if (this.sideCountDirection === -1) {
                        this.cycleSideCountSide();
                    }
                    else {
                        switch (this.invisibleCountType) {
                            case HexCountType_1.HexCountType.Invisible:
                                this.invisibleCountType = HexCountType_1.HexCountType.Plain;
                                break;
                            case HexCountType_1.HexCountType.Plain:
                                if (this.sideCount[this.sideCountDirection] > 1)
                                    this.invisibleCountType = HexCountType_1.HexCountType.Extended;
                                else
                                    this.invisibleCountType = HexCountType_1.HexCountType.Invisible;
                                break;
                            case HexCountType_1.HexCountType.Extended:
                                this.invisibleCountType = HexCountType_1.HexCountType.Invisible;
                                break;
                        }
                    }
                    break;
            }
            this.draw();
            App_1.App.stage.update();
        };
        Hex.prototype.drawAllNeighbors = function () {
            for (var i = 0; i < 6; i++) {
                var n = this.neighbors[i];
                if (n !== undefined) {
                    if (n.neighbors[i] !== undefined) {
                        n.neighbors[i].draw();
                    }
                    var j = i === 5 ? 0 : i + 1;
                    if (n.neighbors[j] !== undefined) {
                        n.neighbors[j].draw();
                    }
                    while (n !== undefined) {
                        n.draw();
                        n = n.neighbors[i];
                    }
                }
            }
        };
        Hex.prototype.draw = function () {
            var p = App_1.App.board.hexToPixel(this);
            this.drawHex(p);
            this.drawText(p);
        };
        Hex.prototype.changeType = function (type) {
            var prevType = this.type;
            this.type = type;
            if (prevType === HexType_1.HexType.Blue && type !== HexType_1.HexType.Blue) {
                this.updateCounts(-1);
            }
            else if (prevType !== HexType_1.HexType.Blue && type === HexType_1.HexType.Blue) {
                this.updateCounts(1);
            }
        };
        Hex.prototype.changeCountType = function (type) {
            switch (this.type) {
                case HexType_1.HexType.Normal:
                    this.normalCountType = type;
                    break;
                case HexType_1.HexType.Blue:
                    this.blueCountType = type === HexCountType_1.HexCountType.Invisible ? type : HexCountType_1.HexCountType.Plain;
                    break;
                case HexType_1.HexType.Invisible:
                    this.invisibleCountType = type;
                    break;
            }
        };
        Hex.prototype.randomize = function () {
            var types = [HexType_1.HexType.Invisible, HexType_1.HexType.Normal, HexType_1.HexType.Blue];
            this.changeType(types[Math.floor(Math.random() * 3)]);
            var countTypes = [HexCountType_1.HexCountType.Plain, HexCountType_1.HexCountType.Invisible, HexCountType_1.HexCountType.Extended];
            this.changeCountType(countTypes[Math.floor(Math.random() * 3)]);
        };
        Hex.prototype.toImportString = function () {
            return "";
            // let t = ".";
            // if (this.countType !== HexCountType.Invisible && this.countType !== HexCountType.Plain) {
            //   t = "+";
            //   if (this.countType === HexCountType.Extended) {
            //     const u = this.text.text.substr(0, 1);
            //     if (u === "{")
            //       t = "c";
            //     else if (u === "-")
            //       t = "n";
            //   }
            // }
            // switch (this.type) {
            //   case HexType.Invisible:
            //     if (this.sideCountDirection > -1)
            //       return ["\\", "[", "-", "]", "/", "|"][this.sideCountDirection] + t;
            //     return "." + t;
            //   case HexType.Normal:
            //     if (this.covered)
            //       return "O" + t;
            //     return "o" + t;
            //   case HexType.Blue:
            //     if (this.covered)
            //       return "X" + t;
            //     return "x" + t;
            // }
        };
        Hex.prototype["import"] = function (s) {
            var typeS = s.substr(0, 1);
            var countS = s.substr(1, 1);
            this.covered = false;
            switch (typeS) {
                case ".":
                    this.changeType(HexType_1.HexType.Invisible);
                    break;
                case "o":
                    this.changeType(HexType_1.HexType.Normal);
                    this.covered = true;
                    break;
                case "O":
                    this.changeType(HexType_1.HexType.Normal);
                    break;
                case "x":
                    this.changeType(HexType_1.HexType.Blue);
                    this.covered = true;
                    break;
                case "X":
                    this.changeType(HexType_1.HexType.Blue);
                    break;
                case "\\":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 0;
                    break;
                case "[":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 1;
                    break;
                case "-":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 2;
                    break;
                case "]":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 3;
                    break;
                case "/":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 4;
                    break;
                case "|":
                    this.changeType(HexType_1.HexType.Invisible);
                    this.sideCountDirection = 5;
                    break;
            }
            switch (countS) {
                case ".":
                    this.changeCountType(HexCountType_1.HexCountType.Invisible);
                    break;
                case "+":
                    this.changeCountType(HexCountType_1.HexCountType.Plain);
                    break;
                case "c":
                    this.changeCountType(HexCountType_1.HexCountType.Extended);
                    break;
                case "n":
                    this.changeCountType(HexCountType_1.HexCountType.Extended);
                    break;
            }
        };
        Hex.prototype.color = function () {
            var color = Settings_1.Settings.hexColors.normal;
            if (this.covered && App_1.App.mode !== AppMode_1.AppMode.Edit) {
                color = Settings_1.Settings.hexColors.covered;
            }
            else {
                switch (this.type) {
                    case HexType_1.HexType.Invisible:
                        if (App_1.App.mode === AppMode_1.AppMode.Edit)
                            color = Settings_1.Settings.hexColors.invisibleEditing;
                        else
                            color = Settings_1.Settings.hexColors.invisible;
                        break;
                    case HexType_1.HexType.Blue:
                        color = Settings_1.Settings.hexColors.blue;
                        break;
                }
            }
            return color;
        };
        Hex.prototype.drawHex = function (p) {
            var color = this.color();
            var g = this.shape.graphics;
            g.clear();
            var size = App_1.App.board.hexSize;
            g.beginFill("white").drawPolyStar(p.x, p.y, size.width * 0.96, 6, 0, 0);
            g.beginFill(color.border).drawPolyStar(p.x, p.y, size.width * 0.92, 6, 0, 0);
            g.beginFill(color.fill).drawPolyStar(p.x, p.y, size.width * 0.75, 6, 0, 0);
        };
        Hex.prototype.drawText = function (p) {
            this.text.x = p.x;
            this.text.y = p.y;
            this.text.text = "";
            this.text.textBaseline = "middle";
            this.text.textAlign = "center";
            this.text.rotation = 0;
            if (this.covered && App_1.App.mode !== AppMode_1.AppMode.Edit)
                return;
            switch (this.type) {
                case HexType_1.HexType.Normal:
                    this.drawTextNormal();
                    break;
                case HexType_1.HexType.Blue:
                    this.drawTextBlue();
                    break;
                case HexType_1.HexType.Invisible:
                    this.drawTextInvisible();
                    break;
            }
        };
        Hex.prototype.drawTextNormal = function () {
            this.text.font = (App_1.App.board.hexSize.width * Settings_1.Settings.hexFontScales.normal).toString() + "px Harabara";
            this.text.color = Settings_1.Settings.hexColors.normal.text;
            if (this.normalCountType === HexCountType_1.HexCountType.Invisible) {
                this.text.text = "?";
            }
            else {
                this.text.text = this.surroundCount.toString();
                if (this.normalCountType === HexCountType_1.HexCountType.Extended && this.surroundCount > 1) {
                    var consecutive = true;
                    if (this.surroundCount < 5) {
                        var i = 0;
                        for (; this.neighbors[i] !== undefined && this.neighbors[i].type === HexType_1.HexType.Blue; i++)
                            ;
                        for (; this.neighbors[i] === undefined || this.neighbors[i].type !== HexType_1.HexType.Blue; i = i === 5 ? 0 : i + 1)
                            ;
                        var j = 0;
                        for (var k = 0; k < this.surroundCount; k++) {
                            j += this.neighbors[i] !== undefined && this.neighbors[i].type === HexType_1.HexType.Blue ? 1 : 0;
                            i = i === 5 ? 0 : i + 1;
                        }
                        consecutive = j === this.surroundCount;
                    }
                    if (consecutive)
                        this.text.text = "{" + this.text.text + "}";
                    else
                        this.text.text = "-" + this.text.text + "-";
                }
            }
        };
        Hex.prototype.drawTextBlue = function () {
            if (this.blueCountType !== HexCountType_1.HexCountType.Invisible) {
                this.text.font = (App_1.App.board.hexSize.width * Settings_1.Settings.hexFontScales.blue).toString() + "px Harabara";
                this.text.color = Settings_1.Settings.hexColors.blue.text;
                this.text.text = this.extendCount.toString();
            }
        };
        Hex.prototype.drawTextInvisible = function () {
            if (this.sideCountDirection > -1 && this.invisibleCountType !== HexCountType_1.HexCountType.Invisible) {
                var size = App_1.App.board.hexSize;
                var d = (6 - this.sideCountDirection) % 6;
                var pOffset = App_1.App.board.hexSideOffset(d, size.scale(0.5));
                this.text.x += pOffset.x;
                this.text.y += pOffset.y;
                this.text.font = (size.width * Settings_1.Settings.hexFontScales.invisible).toString() + "px Harabara";
                this.text.rotation = App_1.App.board.hexSideAngle(d) * 180 / Math.PI - 90;
                this.text.color = Settings_1.Settings.hexColors.invisible.text;
                this.text.text = this.sideCount[this.sideCountDirection].toString();
                if (this.invisibleCountType === HexCountType_1.HexCountType.Extended && this.sideCount[this.sideCountDirection] > 1) {
                    var i = this.sideCountDirection;
                    var c = 0;
                    var n = this.neighbors[i];
                    while (n !== undefined && n.type !== HexType_1.HexType.Blue)
                        n = n.neighbors[i];
                    while (n !== undefined && n.type !== HexType_1.HexType.Normal && c < this.sideCount[i]) {
                        if (n.type === HexType_1.HexType.Blue)
                            c++;
                        n = n.neighbors[i];
                    }
                    if (c === this.sideCount[i])
                        this.text.text = "{" + this.text.text + "}";
                    else
                        this.text.text = "-" + this.text.text + "-";
                }
            }
        };
        Hex.prototype.addListeners = function () {
            var _this = this;
            this.shape.addEventListener("mousedown", function (event) {
                if (event.nativeEvent.which === 1) {
                    _this.handleLeftClick(event);
                }
                else if (event.nativeEvent.which === 3) {
                    _this.handleRightClick(event);
                }
            });
        };
        Hex.prototype.handleLeftClick = function (event) {
            if (App_1.App.mode === AppMode_1.AppMode.Edit) {
                this.cycleType();
            }
            else if (App_1.App.mode === AppMode_1.AppMode.EditInit && this.type !== HexType_1.HexType.Invisible) {
                this.covered = !this.covered;
                this.draw();
                App_1.App.stage.update();
            }
        };
        Hex.prototype.handleRightClick = function (event) {
            if (App_1.App.mode === AppMode_1.AppMode.Edit) {
                if (this.type === HexType_1.HexType.Invisible && event.nativeEvent.shiftKey) {
                    this.cycleSideCountSide();
                }
                else {
                    this.cycleCountType();
                }
            }
        };
        return Hex;
    }(HexBase_1.HexBase));
    exports.Hex = Hex;
});
//# sourceMappingURL=Hex.js.map