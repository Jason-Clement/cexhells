export enum OrientationType {
  Pointy,
  Flat,
}

export class Orientation {

  public static pointy: Orientation = new Orientation(
    Math.sqrt(3),
    Math.sqrt(3) / 2,
    0,
    3 / 2,
    Math.sqrt(3) / 3,
    -1 / 3,
    0,
    2 / 3,
    0.5,
  );

  public static flat: Orientation = new Orientation(
    3 / 2,
    0,
    Math.sqrt(3) / 2,
    Math.sqrt(3),
    2 / 3,
    0,
    -1 / 3,
    Math.sqrt(3) / 3,
    0,
  );

  constructor(
    public f0: number,
    public f1: number,
    public f2: number,
    public f3: number,
    public b0: number,
    public b1: number,
    public b2: number,
    public b3: number,
    public startAngle: number,
  ) { }

}
