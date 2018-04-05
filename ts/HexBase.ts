/* tslint:disable:no-bitwise */

import "lib/easeljs";
import { Point } from "./Point";

export class HexBase {

  public static directions: HexBase[] = [
    new HexBase(1, 0, -1),
    new HexBase(1, -1, 0),
    new HexBase(0, -1, 1),
    new HexBase(-1, 0, 1),
    new HexBase(-1, 1, 0),
    new HexBase(0, 1, -1),
  ];

  public static fromQR(q: number, r: number): HexBase {
    return new HexBase(q, r, -q - r);
  }

  public static fromQS(q: number, s: number): HexBase {
    return new HexBase(q, -q - s, s);
  }

  public static fromRS(r: number, s: number): HexBase {
    return new HexBase(-r - s, r, s);
  }

  public static fromRQ(r: number, q: number): HexBase {
    return new HexBase(q, r, -q - r);
  }

  public static fromSQ(s: number, q: number): HexBase {
    return new HexBase(q, -q - s, s);
  }

  public static fromSR(s: number, r: number): HexBase {
    return new HexBase(-r - s, r, s);
  }

  public static fromAxial(col: number, row: number): HexBase {
    const q = col;
    const s = row - (col - (col & 1)) / 2;
    return HexBase.fromQS(q, s);
  }

  public sideCount: number[] = [];
  public surroundCount: number = 0;
  public extendCount: number = 0;

  constructor(
    public q: number,
    public r: number,
    public s: number,
  ) {
    for (let i = 0; i < 6; i++) {
      this.sideCount.push(0);
    }
  }

  public toAxial(): Point {
    const col = this.q;
    const row = this.s + (this.q - (this.q & 1)) / 2;
    return new Point(col, row);
  }

  public hash(): string {
    return this.q + "," + this.r;
  }

  public add(h: HexBase): HexBase {
    return new HexBase(this.q + h.q, this.r + h.r, this.s + h.s);
  }

  public neighbor(direction: number): HexBase {
    return this.add(HexBase.directions[direction]);
  }

  public round(): HexBase {
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
    return new HexBase(q, r, s);
  }

}
