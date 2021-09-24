"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";

export interface ship {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  width: number;
  height: number;
  angle: number;
  zIndex: number;
}

export class Visual implements IVisual {
  private target: HTMLElement;
  private settings: VisualSettings;

  // private imageUrl = "assets/rocket-312767.svg";
  private imageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/f/f7/Bananas.svg";
  private width: number = 50;
  private height: number = 88;
  private numberOfShips: number = 15;
  private maxSpeed: number = 10;
  private ships: Array<ship> = new Array();
  private timer: number;

  public generateRandomNumber(minValue, maxValue) {
    let randomNumber = Math.random() * (maxValue - minValue) + minValue;
    return randomNumber;
  }

  private initialiseShips(target: HTMLElement) {
    let width = target.clientWidth;
    let height = target.clientHeight;

    console.log(width, height);

    for (let n = 0; n < this.numberOfShips; n++) {
      let xSpeed = 0;
      let ySpeed = 0;

      if (this.maxSpeed !== 0) {
        while (xSpeed === 0 || ySpeed === 0) {
          xSpeed = this.generateRandomNumber(this.maxSpeed * -1, this.maxSpeed);
          ySpeed = this.generateRandomNumber(this.maxSpeed * -1, this.maxSpeed);
        }
      }

      let sizeMultiplier = this.generateRandomNumber(0.25, 1.5);

      this.ships.push({
        x: this.generateRandomNumber(0, width),
        y: this.generateRandomNumber(0, height),
        xSpeed: xSpeed,
        ySpeed: ySpeed,
        width: this.width * sizeMultiplier,
        height: this.height * sizeMultiplier,
        angle: this.generateRandomNumber(0, 359),
        zIndex: Math.round(sizeMultiplier * 100),
      });

      this.drawShips(target);
    }
  }

  private drawShips(target: HTMLElement) {
    //
    for (let n = 0; n < this.numberOfShips; n++) {
      let img: HTMLImageElement = <HTMLImageElement>(
        document.getElementById("ship" + n.toString())
      );
      if (!img) {
        // let testp = document.createElement("p");
        // testp.innerHTML = "pooopy";
        img = document.createElement("img");
        img.src = this.imageUrl;
        img.style.width = this.ships[n].width + "px";
        img.style.height = this.ships[n].height + "px";
        img.style.position = "absolute";
        img.style.zIndex = this.ships[n].zIndex.toString();
        img.id = "ship" + n.toString();

        target.appendChild(img);
      }
      img.style.left = this.ships[n].x + "px";
      img.style.top = this.ships[n].y + "px";
      console.log(img);
      if (
        img.style.transform !==
        "rotate(" + Math.round(this.ships[n].angle).toString() + ")"
      ) {
        img.style.transform =
          "rotate(" + Math.round(this.ships[n].angle).toString() + ")";

        //img.style.webkitTransition = "transform 0.5s";
      }
    }
  }

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.target = options.element;
    if (document) {
      this.initialiseShips(this.target);
    }
  }

  public update(options: VisualUpdateOptions) {
    this.settings = Visual.parseSettings(
      options && options.dataViews && options.dataViews[0]
    );
    console.log("Visual update", options);
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }
}
