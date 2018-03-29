import "lib/easeljs";
import { Hex } from "./Hex";
import { Layout } from "./Layout";
import { OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";

export class HexMap {

  public static rectangle(layout: Layout): HexMap {
    const width = layout.size.width;
    const height = layout.size.height;
    const map = new HexMap();
    const i1 = -Math.floor(height / 2);
    const i2 = i1 + height;
    const j1 = -Math.floor(width / 2);
    const j2 = j1 + width;
    for (let j = j1; j < j2; j++) {
      const jOffset = -Math.floor(j / 2);
      for (let i = i1 + jOffset; i < i2 + jOffset; i++) {
        const hex = Hex.fromSQ(i, j);
        map.hexes[hex.hash()] = hex;
      }
    }
    map.populateNeighbors();
    return map;
  }

  public background: createjs.Shape = new createjs.Shape();
  public hexes: { [key: string]: Hex } = {};

  public get(q: number, r: number): Hex {
    return this.hexes[Hex.fromQR(q, r).hash()];
  }

  public draw(stage: createjs.Stage, layout: Layout) {
    const canvas = stage.canvas as HTMLCanvasElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const offset = this.centerOffset(layout);
    this.background.graphics.beginFill("#e7e7e7").drawRect(0, 0, width, height);
    stage.setTransform(width / 2 - offset.x, height / 2 - offset.y);
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        stage.addChild(this.hexes[key].shape);
        stage.addChild(this.hexes[key].text);
        this.hexes[key].draw(stage, layout);
      }
    }
  }

  private centerOffset(layout: Layout): Point {
    const c1 = new Point(0, 0);
    const c2 = new Point(0, 0);
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        const hex = this.hexes[key];
        const corners = layout.hexCorners(hex);
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

  private populateNeighbors() {
    for (const key in this.hexes) {
      if (this.hexes.hasOwnProperty(key)) {
        const hex = this.hexes[key];
        hex.neighbors = [];
        for (let i = 0; i < Hex.directions.length; i++) {
          const n = hex.neighbor(i);
          hex.neighbors.push(this.get(n.q, n.r));
        }
      }
    }
  }

}
