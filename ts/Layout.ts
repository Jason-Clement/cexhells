import { Hex } from "./Hex";
import { Orientation, OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";

export class Layout {

  public static fillBySize(orientationType: OrientationType, hexSize: Size, fillSize: Size) {
    const layout = new Layout(orientationType, new Size(0, 0), hexSize, new Point(0, 0));
    layout.size.width = layout.fillToWidth(fillSize.width);
    layout.size.height = layout.fillToHeight(fillSize.height);
    return layout;
  }

  public static fillByCount(orientationType: OrientationType, hexCount: Size, fillSize: Size) {
    const layout = new Layout(orientationType, hexCount, new Size(0, 0), new Point(0, 0));
    if (orientationType === OrientationType.Pointy) {
      layout.hexSize = Size.square(Math.min(
        Math.floor(fillSize.width / (Math.sqrt(3) * hexCount.width)),
        Math.floor(fillSize.height / hexCount.height / 1.5),
      ));
    } else {
      layout.hexSize = Size.square(Math.min(
        Math.floor(fillSize.width / hexCount.width / 1.5),
        Math.floor(fillSize.height / (Math.sqrt(3) * hexCount.height)),
      ));
    }
    return layout;
  }

  private orientation: Orientation;

  private constructor(
    public orientationType: OrientationType,
    public size: Size,
    public hexSize: Size,
    public origin: Point,
  ) {
    this.orientation = orientationType === OrientationType.Flat ? Orientation.flat : Orientation.pointy;
  }

  public hexToPixel(hex: Hex): Point {
    const o = this.orientation;
    const x = (o.f0 * hex.q + o.f1 * hex.r) * this.hexSize.width;
    const y = (o.f2 * hex.q + o.f3 * hex.r) * this.hexSize.height;
    return new Point(x + this.origin.x, y + this.origin.y);
  }

  public pixelToHex(point: Point): Hex {
    const o = this.orientation;
    const p = new Point(
      (point.x - this.origin.x) / this.hexSize.width,
      (point.y - this.origin.y) / this.hexSize.height);
    const q = o.b0 * p.x + o.b1 * p.y;
    const r = o.b2 * p.x + o.b3 * p.y;
    return new Hex(q, r, -q - r);
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

  public hexCorners(hex: Hex, size: Size = this.hexSize): Point[] {
    const corners: Point[] = [];
    const center = this.hexToPixel(hex);
    for (let i = 0; i < 6; i++) {
      const offset = this.hexCornerOffset(i, size);
      corners.push(new Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
  }

  private fillToWidth(width: number): number {
    if (this.orientationType === OrientationType.Pointy) {
      return Math.floor(width / (Math.sqrt(3) * this.hexSize.width));
    } else {
      return Math.floor(width / (2 * this.hexSize.width * 0.75));
    }
  }

  private fillToHeight(height: number): number {
    if (this.orientationType === OrientationType.Pointy) {
      return Math.floor(height / (2 * this.hexSize.height * 0.75));
    } else {
      return Math.floor(height / (Math.sqrt(3) * this.hexSize.height));
    }
  }
}
