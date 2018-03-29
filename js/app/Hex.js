define(["require", "exports", "lib/easeljs"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var HexType;
    (function (HexType) {
        HexType[HexType["Invisible"] = 0] = "Invisible";
        HexType[HexType["Normal"] = 1] = "Normal";
        HexType[HexType["Blue"] = 2] = "Blue";
    })(HexType = exports.HexType || (exports.HexType = {}));
    var HexCountType;
    (function (HexCountType) {
        HexCountType[HexCountType["Plain"] = 0] = "Plain";
        HexCountType[HexCountType["QuestionMark"] = 1] = "QuestionMark";
        HexCountType[HexCountType["Invisible"] = 2] = "Invisible";
        HexCountType[HexCountType["Extended"] = 3] = "Extended";
    })(HexCountType = exports.HexCountType || (exports.HexCountType = {}));
    var Hex = /** @class */ (function () {
        function Hex(q, r, s) {
            var _this = this;
            this.q = q;
            this.r = r;
            this.s = s;
            this.shape = new createjs.Shape();
            this.text = new createjs.Text();
            this.stage = null;
            this.layout = null;
            this.covered = false;
            this.colors = {
                blue: { border: "#149cd8", fill: "#05a4eb" },
                covered: { border: "#ff9f00", fill: "#ffaf29" },
                invisible: { border: "transparent", fill: "transparent" },
                normal: { border: "#2c2f31", fill: "#3e3e3e" }
            };
            this.type = HexType.Invisible;
            this.surroundCount = 0;
            this.extendCount = 0;
            this.sideCountDirection = -1;
            this.countType = HexCountType.Invisible;
            this.displayOnStart = false;
            this.neighbors = [];
            this.sideCount = [];
            for (var i = 0; i < 6; i++) {
                this.sideCount.push(0);
            }
            this.shape.addEventListener("mousedown", function (event) {
                if (event.nativeEvent.which === 1) {
                    _this.cycleType();
                }
                else if (event.nativeEvent.which === 3) {
                    if (_this.type === HexType.Invisible && event.nativeEvent.shiftKey) {
                        _this.cycleSideCountSide();
                    }
                    else {
                        _this.cycleCountType();
                    }
                }
            });
        }
        Hex.fromQR = function (q, r) {
            return new Hex(q, r, -q - r);
        };
        Hex.fromQS = function (q, s) {
            return new Hex(q, -q - s, s);
        };
        Hex.fromRS = function (r, s) {
            return new Hex(-r - s, r, s);
        };
        Hex.fromRQ = function (r, q) {
            return new Hex(q, r, -q - r);
        };
        Hex.fromSQ = function (s, q) {
            return new Hex(q, -q - s, s);
        };
        Hex.fromSR = function (s, r) {
            return new Hex(-r - s, r, s);
        };
        Hex.prototype.hash = function () {
            return this.q + "," + this.r;
        };
        Hex.prototype.add = function (h) {
            return new Hex(this.q + h.q, this.r + h.r, this.s + h.s);
        };
        Hex.prototype.neighbor = function (direction) {
            return this.add(Hex.directions[direction]);
        };
        Hex.prototype.round = function () {
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
            return new Hex(q, r, s);
        };
        Hex.prototype.draw = function (stage, layout) {
            if (stage === void 0) { stage = null; }
            if (layout === void 0) { layout = null; }
            if (stage !== null) {
                this.stage = stage;
            }
            if (layout !== null) {
                this.layout = layout;
            }
            if (this.stage === null || this.layout === null) {
                return;
            }
            var color = this.colors.normal;
            switch (this.type) {
                case HexType.Invisible: {
                    color = this.colors.invisible;
                    break;
                }
                case HexType.Blue: {
                    color = this.colors.blue;
                    break;
                }
            }
            if (this.covered) {
                color = this.colors.covered;
            }
            var g = this.shape.graphics;
            g.clear();
            var p = this.layout.hexToPixel(this);
            var size = this.layout.hexSize;
            g.beginFill("white").drawPolyStar(p.x, p.y, size.width * 0.96, 6, 0, 0);
            g.beginFill(color.border).drawPolyStar(p.x, p.y, size.width * 0.92, 6, 0, 0);
            g.beginFill(color.fill).drawPolyStar(p.x, p.y, size.width * 0.75, 6, 0, 0);
            this.text.x = p.x;
            this.text.y = p.y;
            this.text.text = "";
            this.text.textBaseline = "middle";
            this.text.textAlign = "center";
            this.text.rotation = 0;
            if (this.type === HexType.Normal) {
                this.text.font = (size.width * 0.75).toString() + "px Harabara";
                this.text.color = "white";
                if (this.countType === HexCountType.QuestionMark) {
                    this.text.text = "?";
                }
                else {
                    this.text.text = this.surroundCount.toString();
                    if (this.countType === HexCountType.Extended && this.surroundCount > 1) {
                        var consecutive = true;
                        if (this.surroundCount < 5) {
                            var i = 0;
                            for (; this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue; i++)
                                ;
                            for (; this.neighbors[i] === undefined || this.neighbors[i].type !== HexType.Blue; i = i === 5 ? 0 : i + 1)
                                ;
                            var j = 0;
                            for (var k = 0; k < this.surroundCount; k++) {
                                j += this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue ? 1 : 0;
                                i = i === 5 ? 0 : i + 1;
                            }
                            consecutive = j === this.surroundCount;
                        }
                        if (consecutive) {
                            this.text.text = "{" + this.text.text + "}";
                        }
                        else {
                            this.text.text = "-" + this.text.text + "-";
                        }
                    }
                }
            }
            else if (this.type === HexType.Blue) {
                if (this.countType !== HexCountType.Invisible) {
                    this.text.font = (size.width * 0.75).toString() + "px Harabara";
                    this.text.color = "white";
                    this.text.text = this.extendCount.toString();
                }
            }
            else if (this.type === HexType.Invisible) {
                if (this.sideCountDirection > -1) {
                    var d = (6 - this.sideCountDirection) % 6;
                    var p_1 = this.layout.hexSideOffset(d, size.scale(0.5));
                    this.text.x += p_1.x;
                    this.text.y += p_1.y;
                    this.text.font = (size.width * 0.55).toString() + "px Harabara";
                    this.text.rotation = this.layout.hexSideAngle(d) * 180 / Math.PI - 90;
                    this.text.color = "#464646";
                    this.text.text = this.sideCount[this.sideCountDirection].toString();
                    if (this.countType === HexCountType.Extended && this.sideCount[this.sideCountDirection] > 1) {
                        var i = this.sideCountDirection;
                        var c = 0;
                        var n = this.neighbors[i];
                        while (n !== undefined && n.type !== HexType.Blue) {
                            n = n.neighbors[i];
                        }
                        while (n !== undefined && n.type !== HexType.Normal && c < this.sideCount[i]) {
                            if (n.type === HexType.Blue) {
                                c++;
                            }
                            n = n.neighbors[i];
                        }
                        if (c === this.sideCount[i]) {
                            this.text.text = "{" + this.text.text + "}";
                        }
                        else {
                            this.text.text = "-" + this.text.text + "-";
                        }
                    }
                }
            }
        };
        Hex.prototype.cycleType = function () {
            var newType = HexType.Normal;
            switch (this.type) {
                case HexType.Normal:
                    newType = HexType.Blue;
                    break;
                case HexType.Blue:
                    newType = HexType.Invisible;
                    break;
            }
            this.changeType(newType);
            this.draw();
            this.stage.update();
        };
        Hex.prototype.cycleSideCountSide = function () {
            if (this.type !== HexType.Invisible) {
                return;
            }
            var i = this.sideCountDirection;
            i = i === -1 ? 5 : i - 1;
            while (i !== -1 && this.neighbors[i] === undefined) {
                i = i === -1 ? 5 : i - 1;
            }
            this.sideCountDirection = i;
            this.draw();
            this.stage.update();
        };
        Hex.prototype.cycleCountType = function () {
            if (this.type === HexType.Normal) {
                if (this.countType === HexCountType.QuestionMark) {
                    this.countType = HexCountType.Plain;
                }
                else if (this.countType === HexCountType.Invisible || this.countType === HexCountType.Plain) {
                    if (this.surroundCount > 1) {
                        this.countType = HexCountType.Extended;
                    }
                    else {
                        this.countType = HexCountType.QuestionMark;
                    }
                }
                else {
                    this.countType = HexCountType.QuestionMark;
                }
            }
            else if (this.type === HexType.Blue) {
                if (this.countType === HexCountType.Plain) {
                    this.countType = HexCountType.Invisible;
                }
                else {
                    this.countType = HexCountType.Plain;
                }
            }
            else if (this.type === HexType.Invisible) {
                var i = this.sideCountDirection;
                if (i > -1) {
                    if (this.sideCount[i] <= 1 || this.countType === HexCountType.Extended) {
                        this.countType = HexCountType.Plain;
                    }
                    else {
                        this.countType = HexCountType.Extended;
                    }
                }
            }
            this.draw();
            this.stage.update();
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
        Hex.prototype.changeType = function (type) {
            var prevType = this.type;
            this.type = type;
            if (prevType === HexType.Blue && type !== HexType.Blue) {
                this.updateCounts(-1);
            }
            else if (prevType !== HexType.Blue && type === HexType.Blue) {
                this.updateCounts(1);
            }
            this.drawAllNeighbors();
        };
        Hex.prototype.randomize = function () {
            var types = [HexType.Invisible, HexType.Normal, HexType.Blue];
            this.type = types[Math.floor(Math.random() * 4)];
        };
        Hex.directions = [
            new Hex(1, 0, -1),
            new Hex(1, -1, 0),
            new Hex(0, -1, 1),
            new Hex(-1, 0, 1),
            new Hex(-1, 1, 0),
            new Hex(0, 1, -1),
        ];
        return Hex;
    }());
    exports.Hex = Hex;
});
//# sourceMappingURL=Hex.js.map