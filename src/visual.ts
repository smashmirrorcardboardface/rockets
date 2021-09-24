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

  private imageUrl = "http://map.altiusondemand.com/rocket.svg";
  private width: number = 50;
  private height: number = 88;
  private numberOfShips: number = 15;
  private maxSpeed: number = 10;
  private ships: Array<ship> = new Array();
  private timer: number;

  constructor(options: VisualConstructorOptions) {
    console.log("Visual constructor", options);
    this.target = options.element;
    if (document) {
    }
  }

  public generateRandomNumber(minValue, maxValue) {
    let randomNumber = Math.random() * (maxValue - minValue) + maxValue;
    return randomNumber;
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
