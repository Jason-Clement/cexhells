/* tslint:disable:no-console */

import "lib/easeljs";
import { Hex, HexType } from "./Hex";
import { HexMap } from "./HexMap";
import { Layout } from "./Layout";
import { OrientationType } from "./Orientation";
import { Point } from "./Point";
import { Size } from "./Size";

export enum AppMode {
  Edit,
  EditInit,
  Play,
}

export class App {

  public static canvas: HTMLCanvasElement;
  public static stage: createjs.Stage;
  public static layout: Layout;
  public static map: HexMap;
  public static mode: AppMode = AppMode.Edit;

  public static importString =
      "............|n..|+..|+......|+......|+............................\n"
    + "..............\\+..\\+..|+................../+..\\c..................\n"
    + "............x+..x...o...x...o...x...x...o...o...o...x.............\n"
    + "......\\+..x...x...o+..x...x+..x...o...o+..x...x...o...x...........\n"
    + "........o...o...o+..o+..o...x+..o+..x...o+..o+..o+..o+..x+........\n"
    + "..........x...x...o...x...o+..o+..x...o+..x...x...o+..o...|n......\n"
    + "....|n..o+..x...o+..x...o...o...o+..o...o+..o+..o+..o+..x.........\n"
    + "......oc..o+..x...x...o...o...oc..o+..o...x...o+..x...o...x+......\n"
    + "....x...o...x...o+..x...x...x...oc..o...o...o+..x...x...x...x.....\n"
    + "......x...o...x...x...o...o...x...oc..o...x...o+..o+..o+..o.......\n"
    + "....o...x...oc..x...oc..x...o+..x...o...x...o+..x...on..x...o.....\n"
    + "......x+..o+..o+..o...o...o+..x...x...on..o+..on..x...on..o+......\n"
    + "....x+..o...o...x...o...o...x...|n..x...x+..x...x...on..on..x.....\n"
    + "......o...o...x...o+..x...o...o+..o...o...x...o+..o+..x...on......\n"
    + "....o+..x...o+..|+..o...o...o+..o+..x+..o...x.......x...x...o.....\n"
    + "......x+..x...x...o...o+..x...o+..o...x...o+..x...x...o+..o+......\n"
    + "....o...x+..o...o...x...o+..x...o...x...x...on..o+..x...x...x.....\n"
    + "......o+..o...x...o+..x...o+..oc..o...x...o+..on..x...o+..on......\n"
    + "....o+..|+..o+..oc..x...x...x...o+..o...x...x...o...o+......o.....\n"
    + "......o+..x...x...o...o+..o+../+..|n..o+..o...o+..o...o...oc......\n"
    + "....o...on..o+..|n..o+..x...x...o+..x...o...o+......x...x+..o.....\n"
    + "......x...o...o+..x...x...o+..o+..o...on..o...x...oc..o...x.../+..\n"
    + "....x...x...o...o+..x...o...x...x...x...x+..o...o+..x...o...oc....\n"
    + "......o+..o...o+..x...o+..x...x...o...o...x...on..o+..o...x.......\n"
    + "....x...on../+..x...o...x...o+..o+..o...x...o...x...|c..x...o+....\n"
    + "......x...o+..o+..o...x...x...o...o+..x...o...x...o...o...x.../+..\n"
    + "....o...o...o...x...o...o...o...x...o...o+..x+..o+..o...o+..o+....\n"
    + "..\\n..o+..o...x...x...o+..x...oc..x...o...x...x...x...x...x+../+..\n"
    + "....x...x...o...o+..o+..on..o...x...o...x...o...x...x+..x...x.....\n"
    + "......o+../n..x...x...x...o...oc..o+..x...x+..x...x.......o.......\n"
    + "....o...x...o+..x...x...x...o...x...on......o+..o...x+..o+..on....\n"
    + "......o...oc..x...o+..o+..o...oc..x...o+..on..o+..o...o...o.......\n"
    + "....x...x...o+..o+..x...x...o+..x...x...o+..x...x...x...x...x.....";

  public static start(canvas: HTMLCanvasElement) {

    App.canvas = canvas;
    App.stage = new createjs.Stage(canvas);

    App.import(App.importString);

    // App.layout = Layout.fillByCount(
    //   OrientationType.Flat,
    //   // new Size(33, 17),
    //   new Size(10, 10),
    //   new Size(App.canvas.clientWidth * 0.97, App.canvas.clientHeight * 0.97));
    // App.map = HexMap.rectangle(App.layout);
    // const types = [ HexType.Invisible, HexType.Normal, HexType.Blue ];
    // for (const key in App.map.hexes) {
    //   if (App.map.hexes.hasOwnProperty(key)) {
    //     App.map.hexes[key].changeType(types[Math.floor(Math.random() * 3)]);
    //   }
    // }
    // App.map.draw(App.stage, App.layout);

    // App.stage.update();

    window.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.key === "e") {
        if (App.mode !== AppMode.Edit)
          App.mode = AppMode.Edit;
        else
          App.mode = AppMode.EditInit;
        App.map.redraw();
        App.stage.update();
      }
    });
  }

  public static import(s: string) {
    const lineStrings = s.split("\n");
    let len = -1;
    const lines = [];
    let layout: Layout = null;
    let map: HexMap = null;
    for (let k = -1; k < lineStrings.length; k += 2) {
      let line1 = "";
      if (k > -1) {
        line1 = lineStrings[k].replace(/\s/, "");
      }
      let line2 = "";
      if (k + 1 < lineStrings.length) {
        line2 = lineStrings[k + 1].replace(/\s/, "");
      }
      if (k === -1) {
        len = line2.length;
        if (len % 2 !== 0) {
          console.log("Malformed import string");
          return;
        }
        layout = Layout.fillByCount(
          OrientationType.Flat,
          new Size(len / 2, Math.ceil(lineStrings.length / 2)),
          new Size(App.canvas.clientWidth * 0.97, App.canvas.clientHeight * 0.97),
        );
        map = HexMap.rectangle(layout);
      }
      if ((line1.length > 0 && line1.length !== len) || (line2.length > 0 &&  line2.length !== len)) {
        console.log("Malformed import string");
        return;
      }
      const cOffset = -Math.floor(len / 4);
      const r = Math.floor(lineStrings.length / 4) - Math.floor((k + 1) / 2);
      for (let i = 0; i < len; i += 2) {
        const lineT = i % 4 === 0 ? line2 : line1;
        const st = lineT === "" ? ".." : lineT.substr(i, 2);
        const h = Hex.fromImportString(i / 2 + cOffset, r, st);
        const h2 = map.get(h.q, h.r);
        h2.countType = h.countType;
        h2.sideCountDirection = h.sideCountDirection;
        h2.covered = h.covered;
        h2.changeType(h.type);
      }
    }
    App.layout = layout;
    App.map = map;
    App.map.draw(App.stage, App.layout);
    App.stage.update();
  }
}
