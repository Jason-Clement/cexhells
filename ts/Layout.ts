import { HexBase } from "./HexBase";
import { Orientation, OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";

export class Layout {

  public hexSize: Size;
  private orientation: Orientation;
  private origin: Point = new Point(0, 0);

  public constructor(
    public hexCount: Size,
  ) {
    this.orientation = Orientation.flat;
  }

  public hexToPixel(hex: HexBase): Point {
    const o = this.orientation;
    const x = (o.f0 * hex.q + o.f1 * hex.r) * this.hexSize.width;
    const y = (o.f2 * hex.q + o.f3 * hex.r) * this.hexSize.height;
    return new Point(x + this.origin.x, y + this.origin.y);
  }

  public pixelToHex(point: Point): HexBase {
    const o = this.orientation;
    const p = new Point(
      (point.x - this.origin.x) / this.hexSize.width,
      (point.y - this.origin.y) / this.hexSize.height);
    const q = o.b0 * p.x + o.b1 * p.y;
    const r = o.b2 * p.x + o.b3 * p.y;
    return new HexBase(q, r, -q - r);
  }

  public hexCornerOffset(corner: number, size: Size = this.hexSize): Point {
    const o = this.orientation;
    const angle = 2 * Math.PI * (o.startAngle + corner) / 6;
    return new Point(size.width * Math.cos(angle), size.height * Math.sin(angle));
  }

  public hexSideOffset(side: number, size: Size = this.hexSize): Point {
    const o = this.orientation;
    const angle = 2 * Math.PI * (o.startAngle + 0.5 + side) / 6;
    return new Point(size.width * Math.cos(angle), size.height * Math.sin(angle));
  }

  public hexSideAngle(side: number, size: Size = this.hexSize): number {
    const o = this.orientation;
    return 2 * Math.PI * (o.startAngle + 0.5 + side) / 6;
  }

  public hexCorners(hex: HexBase, size: Size = this.hexSize): Point[] {
    const corners: Point[] = [];
    const center = this.hexToPixel(hex);
    for (let i = 0; i < 6; i++) {
      const offset = this.hexCornerOffset(i, size);
      corners.push(new Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
  }
}
