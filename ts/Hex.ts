import { App } from "./App";
import { AppMode } from "./AppMode";
import { HexBase } from "./HexBase";
import { HexCountType } from "./HexCountType";
import { HexType } from "./HexType";
import { Point } from "./Point";
import { Settings } from "./Settings";

export class Hex extends HexBase {

  public static fromHexBase(h: HexBase): Hex {
    return new Hex(h.q, h.r, h.s);
  }

  public type: HexType = HexType.Invisible;
  public normalCountType: HexCountType = HexCountType.Plain;
  public blueCountType: HexCountType = HexCountType.Invisible;
  public invisibleCountType: HexCountType = HexCountType.Plain;
  public shape: createjs.Shape = new createjs.Shape();
  public text: createjs.Text = new createjs.Text();
  public covered: boolean = false;
  public sideCountDirection: number = -1;
  public neighbors: Hex[] = [];

  constructor(
    public q: number,
    public r: number,
    public s: number,
  ) {
    super(q, r, s);
    this.addListeners();
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

  public cycleType() {
    let newType = HexType.Normal;
    switch (this.type) {
      case HexType.Normal: newType = HexType.Blue; break;
      case HexType.Blue: newType = HexType.Invisible; break;
    }
    this.changeType(newType);
    this.drawAllNeighbors();
    this.draw();
    App.stage.update();
  }

  public cycleSideCountSide() {
    if (this.type !== HexType.Invisible)
      return;
    let i = this.sideCountDirection;
    i = i === -1 ? 5 : i - 1;
    while (i !== -1 && this.neighbors[i] === undefined) {
      i = i === -1 ? 5 : i - 1;
    }
    this.sideCountDirection = i;
    if (i > -1 && this.invisibleCountType === HexCountType.Invisible)
      this.invisibleCountType = HexCountType.Plain;
    this.draw();
    App.stage.update();
  }

  public cycleCountType() {
    switch (this.type) {
      case HexType.Normal:
        switch (this.normalCountType) {
          case HexCountType.Invisible:
            this.normalCountType = HexCountType.Plain;
            break;
          case HexCountType.Plain:
            if (this.surroundCount > 1)
              this.normalCountType = HexCountType.Extended;
            else
              this.normalCountType = HexCountType.Invisible;
            break;
          case HexCountType.Extended:
            this.normalCountType = HexCountType.Invisible;
            break;
        }
      case HexType.Blue:
        if (this.blueCountType === HexCountType.Plain)
          this.blueCountType = HexCountType.Invisible;
        else
          this.blueCountType = HexCountType.Plain;
        break;
      case HexType.Invisible:
        if (this.sideCountDirection === -1) {
          this.cycleSideCountSide();
        } else {
          switch (this.invisibleCountType) {
            case HexCountType.Invisible:
              this.invisibleCountType = HexCountType.Plain;
              break;
            case HexCountType.Plain:
              if (this.sideCount[this.sideCountDirection] > 1)
                this.invisibleCountType = HexCountType.Extended;
              else
                this.invisibleCountType = HexCountType.Invisible;
              break;
            case HexCountType.Extended:
              this.invisibleCountType = HexCountType.Invisible;
              break;
          }
        }
        break;
    }
    this.draw();
    App.stage.update();
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

  public draw() {
    const p = App.board.hexToPixel(this);
    this.drawHex(p);
    this.drawText(p);
  }

  public changeType(type: HexType) {
    const prevType = this.type;
    this.type = type;
    if (prevType === HexType.Blue && type !== HexType.Blue) {
      this.updateCounts(-1);
    } else if (prevType !== HexType.Blue && type === HexType.Blue) {
      this.updateCounts(1);
    }
  }

  public changeCountType(type: HexCountType) {
    switch (this.type) {
      case HexType.Normal:
        this.normalCountType = type;
        break;
      case HexType.Blue:
        this.blueCountType = type === HexCountType.Invisible ? type : HexCountType.Plain;
        break;
      case HexType.Invisible:
        this.invisibleCountType = type;
        break;
    }
  }

  public randomize() {
    const types = [ HexType.Invisible, HexType.Normal, HexType.Blue ];
    this.changeType(types[Math.floor(Math.random() * 3)]);
    const countTypes = [ HexCountType.Plain, HexCountType.Invisible, HexCountType.Extended ];
    this.changeCountType(countTypes[Math.floor(Math.random() * 3)]);
  }

  public toImportString(): string {
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
  }

  public import(s: string) {
    const typeS = s.substr(0, 1);
    const countS = s.substr(1, 1);
    this.covered = false;
    switch (typeS) {
      case ".":  this.changeType(HexType.Invisible); break;
      case "o":  this.changeType(HexType.Normal);    this.covered = true; break;
      case "O":  this.changeType(HexType.Normal);    break;
      case "x":  this.changeType(HexType.Blue);      this.covered = true; break;
      case "X":  this.changeType(HexType.Blue);      break;
      case "\\": this.changeType(HexType.Invisible); this.sideCountDirection = 0; break;
      case "[":  this.changeType(HexType.Invisible); this.sideCountDirection = 1; break;
      case "-":  this.changeType(HexType.Invisible); this.sideCountDirection = 2; break;
      case "]":  this.changeType(HexType.Invisible); this.sideCountDirection = 3; break;
      case "/":  this.changeType(HexType.Invisible); this.sideCountDirection = 4; break;
      case "|":  this.changeType(HexType.Invisible); this.sideCountDirection = 5; break;
    }
    switch (countS) {
      case ".": this.changeCountType(HexCountType.Invisible); break;
      case "+": this.changeCountType(HexCountType.Plain);     break;
      case "c": this.changeCountType(HexCountType.Extended);  break;
      case "n": this.changeCountType(HexCountType.Extended);  break;
    }
  }

  private color() {
    let color = Settings.hexColors.normal;
    if (this.covered && App.mode !== AppMode.Edit) {
      color = Settings.hexColors.covered;
    } else {
      switch (this.type) {
        case HexType.Invisible:
          if (App.mode === AppMode.Edit)
            color = Settings.hexColors.invisibleEditing;
          else
            color = Settings.hexColors.invisible;
          break;
        case HexType.Blue:
          color = Settings.hexColors.blue;
          break;
      }
    }
    return color;
  }

  private drawHex(p: Point) {
    const color = this.color();
    const g = this.shape.graphics;
    g.clear();
    const size = App.board.hexSize;
    g.beginFill("white").drawPolyStar(p.x, p.y, size.width * 0.96, 6, 0, 0);
    g.beginFill(color.border).drawPolyStar(p.x, p.y, size.width * 0.92, 6, 0, 0);
    g.beginFill(color.fill).drawPolyStar(p.x, p.y, size.width * 0.75, 6, 0, 0);
  }

  private drawText(p: Point) {
    this.text.x = p.x;
    this.text.y = p.y;
    this.text.text = "";
    this.text.textBaseline = "middle";
    this.text.textAlign = "center";
    this.text.rotation = 0;
    if (this.covered && App.mode !== AppMode.Edit)
      return;
    switch (this.type) {
      case HexType.Normal: this.drawTextNormal(); break;
      case HexType.Blue: this.drawTextBlue(); break;
      case HexType.Invisible: this.drawTextInvisible(); break;
    }
  }

  private drawTextNormal() {
    this.text.font = (App.board.hexSize.width * Settings.hexFontScales.normal).toString() + "px Harabara";
    this.text.color = Settings.hexColors.normal.text;
    if (this.normalCountType === HexCountType.Invisible) {
      this.text.text = "?";
    } else {
      this.text.text = this.surroundCount.toString();
      if (this.normalCountType === HexCountType.Extended && this.surroundCount > 1) {
        let consecutive = true;
        if (this.surroundCount < 5) {
          let i = 0;
          for (;
            this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue;
            i++);
          for (;
            this.neighbors[i] === undefined || this.neighbors[i].type !== HexType.Blue;
            i = i === 5 ? 0 : i + 1);
          let j = 0;
          for (let k = 0; k < this.surroundCount; k++) {
            j += this.neighbors[i] !== undefined && this.neighbors[i].type === HexType.Blue ? 1 : 0;
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
  }

  private drawTextBlue() {
    if (this.blueCountType !== HexCountType.Invisible) {
      this.text.font = (App.board.hexSize.width * Settings.hexFontScales.blue).toString() + "px Harabara";
      this.text.color = Settings.hexColors.blue.text;
      this.text.text = this.extendCount.toString();
    }
  }

  private drawTextInvisible() {
    if (this.sideCountDirection > -1 && this.invisibleCountType !== HexCountType.Invisible) {
      const size = App.board.hexSize;
      const d = (6 - this.sideCountDirection) % 6;
      const pOffset = App.board.hexSideOffset(d, size.scale(0.5));
      this.text.x += pOffset.x;
      this.text.y += pOffset.y;
      this.text.font = (size.width * Settings.hexFontScales.invisible).toString() + "px Harabara";
      this.text.rotation = App.board.hexSideAngle(d) * 180 / Math.PI - 90;
      this.text.color = Settings.hexColors.invisible.text;
      this.text.text = this.sideCount[this.sideCountDirection].toString();
      if (this.invisibleCountType === HexCountType.Extended && this.sideCount[this.sideCountDirection] > 1) {
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

  private addListeners() {
    this.shape.addEventListener("mousedown", (event: createjs.MouseEvent) => {
      if (event.nativeEvent.which === 1) {
        this.handleLeftClick(event);
      } else if (event.nativeEvent.which === 3) {
        this.handleRightClick(event);
      }
    });
  }

  private handleLeftClick(event: createjs.MouseEvent) {
    if (App.mode === AppMode.Edit) {
      this.cycleType();
    } else if (App.mode === AppMode.EditInit && this.type !== HexType.Invisible) {
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
