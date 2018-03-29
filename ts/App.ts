import "lib/easeljs";
import { HexType } from "./Hex";
import { HexMap } from "./HexMap";
import { Layout } from "./Layout";
import { OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";

export class App {

  public static canvas: HTMLCanvasElement;
  public static stage: createjs.Stage;
  public static layout: Layout;
  public static map: HexMap;

  public static start(canvas: HTMLCanvasElement) {

    App.canvas = canvas;
    App.stage = new createjs.Stage(canvas);

    App.layout = Layout.fillByCount(
      OrientationType.Flat,
      //new Size(33, 17),
      new Size(10, 10),
      new Size(App.canvas.clientWidth * 0.97, App.canvas.clientHeight * 0.97));
    App.map = HexMap.rectangle(App.layout);
    const types = [ HexType.Invisible, HexType.Normal, HexType.Blue ];
    for (const key in App.map.hexes) {
      if (App.map.hexes.hasOwnProperty(key)) {
        App.map.hexes[key].changeType(types[Math.floor(Math.random() * 3)]);
      }
    }
    this.map.draw(App.stage, App.layout);

    App.stage.update();
  }
}
