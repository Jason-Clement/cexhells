import "lib/easeljs";
import { App } from "./App";
import { Hex } from "./Hex";
import { HexBase } from "./HexBase";
import { Layout } from "./Layout";
import { OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";
export class Board extends Layout {

  public background: createjs.Shape = new createjs.Shape();
  public hexes: { [key: string]: Hex } = {};
  public author: string;
  public title: string;
  public info: string;

  public constructor(
    public hexCount: Size,
  ) {
    super(hexCount);
    this.init(hexCount.width, hexCount.height);
  }

  public init(width: number, height: number) {
    this.hexCount = new Size(width, height);
    this.hexes = {};
    this.resize();
    const i1 = -Math.floor(height / 2);
    const i2 = i1 + height;
    const j1 = -Math.floor(width / 2);
    const j2 = j1 + width;
    for (let j = j1; j < j2; j++) {
      const jOffset = -Math.floor(j / 2);
      for (let i = i1 + jOffset; i < i2 + jOffset; i++) {
        const hex = HexBase.fromSQ(i, j);
        this.hexes[hex.hash()] = Hex.fromHexBase(hex);
      }
    }
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        const hex = this.hexes[key];
        hex.neighbors = [];
        for (let i = 0; i < HexBase.directions.length; i++) {
          const n = hex.neighbor(i);
          hex.neighbors.push(this.get(n.q, n.r));
        }
      }
    }
  }

  public get(q: number, r: number): Hex {
    return this.hexes[HexBase.fromQR(q, r).hash()];
  }

  public resize() {
    this.hexSize = Size.square(Math.min(
      Math.floor(App.width() / this.hexCount.width / 1.5),
      Math.floor(App.height() / (Math.sqrt(3) * this.hexCount.height)),
    ));
    const canvas = App.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const offset = this.centerOffset();
    App.stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
  }

  public redraw() {
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        this.hexes[key].draw();
      }
    }
  }

  public draw() {
    const canvas = App.canvas;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const offset = this.centerOffset();
    this.background.graphics.beginFill("#e7e7e7").drawRect(0, 0, width, height);
    App.stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        App.stage.addChild(this.hexes[key].shape);
        App.stage.addChild(this.hexes[key].text);
        this.hexes[key].draw();
      }
    }
  }

  public import(s: string): boolean {

    const lineStrings = s.split("\n");
    if (lineStrings.length < 6)
      return false;

    const title = lineStrings[1];
    const author = lineStrings[2];
    let info = lineStrings[3];
    if (lineStrings[4].replace(/\s/, "").length > 0)
      info += "\n" + lineStrings[4];
    lineStrings.splice(0, 5);

    for (let i = lineStrings.length - 1; i >= 0; i--) {
      lineStrings[i] = lineStrings[i].replace(/\s/, "");
      if (lineStrings[i].length === 0)
        lineStrings.splice(i, 1);
    }
    if (lineStrings.length === 0)
      return false;
    const len = lineStrings[0].length;
    if (len % 2 !== 0)
      return false;
    for (const lineString of lineStrings) {
      if (lineString.length !== len)
        return false;
      if (/[^oOxX\\\|\/\[\-\]\.\+cn]/.test(lineString))
        return false;
    }

    this.init(len / 2, Math.ceil(lineStrings.length / 2));
    const lines = [];
    for (let k = -1; k < lineStrings.length; k += 2) {
      let line1 = "";
      if (k > -1)
        line1 = lineStrings[k];
      let line2 = "";
      if (k + 1 < lineStrings.length)
        line2 = lineStrings[k + 1];
      const cOffset = -Math.floor(len / 4);
      const r = Math.floor(lineStrings.length / 4) - Math.floor((k + 1) / 2);
      for (let i = 0; i < len; i += 2) {
        const lineT = i % 4 === 0 ? line2 : line1;
        const st = lineT === "" ? ".." : lineT.substr(i, 2);
        const h = Hex.fromAxial(i / 2 + cOffset, r);
        const h2 = this.get(h.q, h.r);
        h2.import(st);
      }
    }
    this.draw();
    App.stage.update();
  }

  private centerOffset(): Point {
    const c1 = new Point(0, 0);
    const c2 = new Point(0, 0);
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        const hex = this.hexes[key];
        const corners = this.hexCorners(hex);
        for (const corner of corners) {
          if (corner.x < c1.x) { c1.x = corner.x; }
          if (corner.y < c1.y) { c1.y = corner.y; }
          if (corner.x > c2.x) { c2.x = corner.x; }
          if (corner.y > c2.y) { c2.y = corner.y; }
        }
      }
    }
    return new Point(
      Math.round((c2.x - Math.abs(c1.x)) / 2),
      Math.round((c2.y - Math.abs(c1.y)) / 2),
    );
  }

}
