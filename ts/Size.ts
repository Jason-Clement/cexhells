export class Size {

  public static square(width: number) {
    return new Size(width, width);
  }

  constructor(
    public width: number,
    public height: number,
  ) { }

  public scale(value: number) {
    return new Size(this.width * value, this.height * value);
  }
}
