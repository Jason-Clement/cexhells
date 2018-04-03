/* tslint:disable:no-bitwise */

import "lib/easeljs";
import { App, AppMode } from "./App";
import { Layout } from "./Layout";
import { Point } from "./Point";

export enum HexType {
  Invisible,
  Normal,
  Blue,
}

export enum HexCountType {
  Plain,
  QuestionMark,
  Invisible,
  Extended,
}

export class Hex {

  public static directions: Hex[] = [
    new Hex(1, 0, -1),
    new Hex(1, -1, 0),
    new Hex(0, -1, 1),
    new Hex(-1, 0, 1),
    new Hex(-1, 1, 0),
    new Hex(0, 1, -1),
  ];

  public static fromQR(q: number, r: number): Hex {
    return new Hex(q, r, -q - r);
  }

  public static fromQS(q: number, s: number): Hex {
    return new Hex(q, -q - s, s);
  }

  public static fromRS(r: number, s: number): Hex {
    return new Hex(-r - s, r, s);
  }

  public static fromRQ(r: number, q: number): Hex {
    return new Hex(q, r, -q - r);
  }

  public static fromSQ(s: number, q: number): Hex {
    return new Hex(q, -q - s, s);
  }

  public static fromSR(s: number, r: number): Hex {
    return new Hex(-r - s, r, s);
  }

  public static fromAxial(x: number, y: number): Hex {
    const q = x;
    const s = y - (x - (x & 1)) / 2;
    return Hex.fromQS(q, s);
  }

  public static fromImportString(x: number, y: number, s: string): Hex {
    const typeS = s.substr(0, 1);
    const countS = s.substr(1, 1);
    const h = Hex.fromAxial(x, y);
    h.covered = false;
    switch (typeS) {
      case ".": h.type = HexType.Invisible; break;
      case "o": h.type = HexType.Normal; h.covered = true; break;
      case "O": h.type = HexType.Normal; break;
      case "x": h.type = HexType.Blue; h.covered = true; break;
      case "X": h.type = HexType.Blue; break;
      case "\\": h.type = HexType.Invisible; h.sideCountDirection = 0; break;
      case "[": h.type = HexType.Invisible; h.sideCountDirection = 1; break;
      case "-": h.type = HexType.Invisible; h.sideCountDirection = 2; break;
      case "]": h.type = HexType.Invisible; h.sideCountDirection = 3; break;
      case "/": h.type = HexType.Invisible; h.sideCountDirection = 4; break;
      case "|": h.type = HexType.Invisible; h.sideCountDirection = 5; break;
    }
    switch (countS) {
      case ".": h.countType = h.type === HexType.Normal ? HexCountType.QuestionMark : HexCountType.Invisible; break;
      case "+": h.countType = HexCountType.Plain; break;
      case "c": h.countType = HexCountType.Extended; break;
      case "n": h.countType = HexCountType.Extended; break;
    }
    return h;
  }

  public sideCountImportStrings = ["\\", "[", "-", "]", "/", "|"];

  public type: HexType = HexType.Invisible;
  public neighbors: Hex[];
  public sideCount: number[];
  public surroundCount: number = 0;
  public extendCount: number = 0;
  public countType: HexCountType = HexCountType.Invisible;
  public sideCountDirection: number = -1;
  public shape: createjs.Shape = new createjs.Shape();
  public text: createjs.Text = new createjs.Text();
  public stage: createjs.Stage = null;
  public layout: Layout = null;
  public covered: boolean = false;

  private colors = {
    blue: { border: "#149cd8", fill: "#05a4eb" },
    covered: { border: "#ff9f00", fill: "#ffaf29" },
    invisible: { border: "transparent", fill: "transparent" },
    normal: { border: "#2c2f31", fill: "#3e3e3e" },
  };

  constructor(
    public q: number,
    public r: number,
    public s: number,
  ) {
    this.neighbors = [];
    this.sideCount = [];
    for (let i = 0; i < 6; i++) {
      this.sideCount.push(0);
    }
    this.shape.addEventListener("mousedown", (event: createjs.MouseEvent) => {
      if (event.nativeEvent.which === 1) {
        this.handleLeftClick(event);
      } else if (event.nativeEvent.which === 3) {
        this.handleRightClick(event);
      }
    });
  }

  public toAxial(): Point {
    const col = this.q;
    const row = this.s + (this.q - (this.q & 1)) / 2;
    return new Point(col, row);
  }

  public toImportString() {
    let t = ".";
    if (this.countType !== HexCountType.Invisible && this.countType !== HexCountType.Plain) {
      t = "+";
      if (this.countType === HexCountType.Extended) {
        const u = this.text.text.substr(0, 1);
        if (u === "{")
          t = "c";
        else if (u === "-")
          t = "n";
      }
    }
    if (this.type === HexType.Invisible) {
      if (this.sideCountDirection > -1) { return this.sideCountImportStrings[this.sideCountDirection] + t; }
      return "." + t;
    } else if (this.type === HexType.Normal) {
      if (this.covered) { return "O" + t; }
      return "o" + t;
    } else {
      if (this.covered) { return "X" + t; }
      return "x" + t;
    }
  }

  public hash(): string {
    return this.q + "," + this.r;
  }

  public add(h: Hex): Hex {
    return new Hex(this.q + h.q, this.r + h.r, this.s + h.s);
  }

  public neighbor(direction: number): Hex {
    return this.add(Hex.directions[direction]);
  }

  public round(): Hex {
    let q = Math.floor(Math.round(this.q));
    let r = Math.floor(Math.round(this.r));
    let s = Math.floor(Math.round(this.s));
    const qD = Math.abs(q - this.q);
    const rD = Math.abs(r - this.r);
    const sD = Math.abs(s - this.s);
    if (qD > rD && qD > sD) {
      q = -r - s;
    } else {
      if (rD > sD) {
        r = -q - s;
      } else {
        s = -q - r;
      }
    }
    return new Hex(q, r, s);
  }

  public draw(stage: createjs.Stage = null, layout: Layout = null) {
    if (stage !== null) { this.stage = stage; }
    if (layout !== null) { this.layout = layout; }
    if (this.stage === null || this.layout === null) { return; }
    let color = this.colors.normal;
    switch (this.type) {
      case HexType.Invisible: { color = this.colors.invisible; break; }
      case HexType.Blue: { color = this.colors.blue; break; }
    }
    if (this.covered && App.mode !== AppMode.Edit) {
      color = this.colors.covered;
    }
    const g = this.shape.graphics;
    g.clear();
    const p = this.layout.hexToPixel(this);
    const size = this.layout.hexSize;
    g.beginFill("white").drawPolyStar(p.x, p.y, size.width * 0.96, 6, 0, 0);
    g.beginFill(color.border).drawPolyStar(p.x, p.y, size.width * 0.92, 6, 0, 0);
    g.beginFill(color.fill).drawPolyStar(p.x, p.y, size.width * 0.75, 6, 0, 0);
    this.text.x = p.x;
    this.text.y = p.y;
    this.text.text = "";
    this.text.textBaseline = "middle";
    this.text.textAlign = "center";
    this.text.rotation = 0;
    if (this.covered && App.mode !== AppMode.Edit)
      return;
    if (this.type === HexType.Normal) {
      this.text.font = (size.width * 0.75).toString() + "px Harabara";
      this.text.color = "white";
      if (this.countType === HexCountType.QuestionMark) {
        this.text.text = "?";
      } else {
        this.text.text = this.surroundCount.toString();
        if (this.countType === HexCountType.Extended && this.surroundCount > 1) {
          let consecutive = true;
          if (this.surroundCount < 5) {
            let i = 0;
            for (; this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue; i++);
            for (; this.neighbors[i] === undefined || this.neighbors[i].type !== HexType.Blue; i = i === 5 ? 0 : i + 1);
            let j = 0;
            for (let k = 0; k < this.surroundCount; k++) {
              j += this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue ? 1 : 0;
              i = i === 5 ? 0 : i + 1;
            }
            consecutive = j === this.surroundCount;
          }
          if (consecutive)
            this.text.text  = "{" + this.text.text + "}";
          else
            this.text.text = "-" + this.text.text + "-";
        }
      }
    } else if (this.type === HexType.Blue) {
      if (this.countType !== HexCountType.Invisible) {
        this.text.font = (size.width * 0.75).toString() + "px Harabara";
        this.text.color = "white";
        this.text.text = this.extendCount.toString();
      }
    } else if (this.type === HexType.Invisible) {
      if (this.sideCountDirection > -1) {
        const d = (6 - this.sideCountDirection) % 6;
        const pOffset = this.layout.hexSideOffset(d, size.scale(0.5));
        this.text.x += pOffset.x;
        this.text.y += pOffset.y;
        this.text.font = (size.width * 0.55).toString() + "px Harabara";
        this.text.rotation = this.layout.hexSideAngle(d) * 180 / Math.PI - 90;
        this.text.color = "#464646";
        this.text.text = this.sideCount[this.sideCountDirection].toString();
        if (this.countType === HexCountType.Extended && this.sideCount[this.sideCountDirection] > 1) {
          const i = this.sideCountDirection;
          let c = 0;
          let n = this.neighbors[i];
          while (n !== undefined && n.type !== HexType.Blue)
            n = n.neighbors[i];
          while (n !== undefined && n.type !== HexType.Normal && c < this.sideCount[i]) {
            if (n.type === HexType.Blue)
              c++;
            n = n.neighbors[i];
          }
          if (c === this.sideCount[i])
            this.text.text = "{" + this.text.text + "}";
          else
            this.text.text = "-" + this.text.text + "-";
        }
      }
    }
  }

  public cycleType() {
    let newType = HexType.Normal;
    switch (this.type) {
      case HexType.Normal: newType = HexType.Blue; break;
      case HexType.Blue: newType = HexType.Invisible; break;
    }
    this.changeType(newType);
    this.draw();
    this.stage.update();
  }

  public cycleSideCountSide() {
    if (this.type !== HexType.Invisible) {
      return;
    }
    let i = this.sideCountDirection;
    i = i === -1 ? 5 : i - 1;
    while (i !== -1 && this.neighbors[i] === undefined) {
      i = i === -1 ? 5 : i - 1;
    }
    this.sideCountDirection = i;
    this.draw();
    this.stage.update();
  }

  public cycleCountType() {
    if (this.type === HexType.Normal) {
      if (this.countType === HexCountType.QuestionMark) {
        this.countType = HexCountType.Plain;
      } else if (this.countType === HexCountType.Invisible || this.countType === HexCountType.Plain) {
        if (this.surroundCount > 1) {
          this.countType = HexCountType.Extended;
        } else {
          this.countType = HexCountType.QuestionMark;
        }
      } else /* Extended */ {
        this.countType = HexCountType.QuestionMark;
      }
    } else if (this.type === HexType.Blue) {
      if (this.countType === HexCountType.Plain) {
        this.countType = HexCountType.Invisible;
      } else {
        this.countType = HexCountType.Plain;
      }
    } else if (this.type === HexType.Invisible) {
      const i = this.sideCountDirection;
      if (i > -1) {
        if (this.sideCount[i] <= 1 || this.countType === HexCountType.Extended) {
          this.countType = HexCountType.Plain;
        } else {
          this.countType = HexCountType.Extended;
        }
      }
    }
    this.draw();
    this.stage.update();
  }

  public updateCounts(amount: number) {
    for (let i = 0; i < 6; i++) {
      let n = this.neighbors[i];
      if (n !== undefined) {
        n.surroundCount += amount;
        n.extendCount += amount;
        if (n.neighbors[i] !== undefined) {
          n.neighbors[i].extendCount += amount;
        }
        let j = i === 5 ? 0 : i + 1;
        if (n.neighbors[j] !== undefined) {
          n.neighbors[j].extendCount += amount;
        }
        j = (i - 3  + 6) % 6;
        while (n !== undefined) {
          n.sideCount[j] += amount;
          n = n.neighbors[i];
        }
      }
    }
  }

  public drawAllNeighbors() {
    for (let i = 0; i < 6; i++) {
      let n = this.neighbors[i];
      if (n !== undefined) {
        if (n.neighbors[i] !== undefined) {
          n.neighbors[i].draw();
        }
        const j = i === 5 ? 0 : i + 1;
        if (n.neighbors[j] !== undefined) {
          n.neighbors[j].draw();
        }
        while (n !== undefined) {
          n.draw();
          n = n.neighbors[i];
        }
      }
    }
  }

  public changeType(type: HexType) {
    const prevType = this.type;
    this.type = type;
    if (prevType === HexType.Blue && type !== HexType.Blue) {
      this.updateCounts(-1);
    } else if (prevType !== HexType.Blue && type === HexType.Blue) {
      this.updateCounts(1);
    }
    this.drawAllNeighbors();
  }

  public randomize() {
    const types = [ HexType.Invisible, HexType.Normal, HexType.Blue ];
    this.type = types[Math.floor(Math.random() * 4)];
  }

  private handleLeftClick(event: createjs.MouseEvent) {
    if (App.mode === AppMode.Edit) {
      this.cycleType();
    } else if (App.mode === AppMode.EditInit) {
      this.covered = !this.covered;
      this.draw();
      App.stage.update();
    }
  }

  private handleRightClick(event: createjs.MouseEvent) {
    if (App.mode === AppMode.Edit) {
      if (this.type === HexType.Invisible && event.nativeEvent.shiftKey) {
        this.cycleSideCountSide();
      } else {
        this.cycleCountType();
      }
    }
  }

}
