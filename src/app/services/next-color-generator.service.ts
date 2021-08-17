import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

// generate an iterator returning in loop some colors, that are not too bright to be readable, and that would repeat not too often

@Injectable({
  providedIn: 'root'
})
export class NextColorGeneratorService {
  hueGenerator = new HueGenerator();
  lightGenerator = new LightGenerator();
  saturatoinGenerator = new SaturationValueGetter();
  specialColorGetter = new SpecialColorsGetter();
  private light = -1;
  private saturation = -1;

  constructor() {}

  restart(){
    this.hueGenerator.restart();
    this.lightGenerator.restart();
    this.saturatoinGenerator.restart();
    this.specialColorGetter.restart();
    this.light = -1;
    this.saturation = -1;
  }

  wereAllLightValuesUsed(){
    return this.lightGenerator.wereAllUsed() && this.hueGenerator.wereAllUsed()
  }
  wereAllSaturationValuesUsed(){
    return this.lightGenerator.wereAllUsed() && this.saturatoinGenerator.wereAllUsed() && this.hueGenerator.wereAllUsed();
  }

  getNextColor(){

    if (this.wereAllLightValuesUsed() && this.wereAllSaturationValuesUsed()) {
      if (!this.specialColorGetter.wereAllUsed()) {
        return this.specialColorGetter.getValue()
      }
    }

    if (this.light < 0) this.light = this.lightGenerator.getValue();
    if (this.saturation < 0) this.saturation = this.saturatoinGenerator.getValue();

    
    if (this.wereAllLightValuesUsed()) {
      this.saturation = this.saturatoinGenerator.getValue();
    }


    if (this.hueGenerator.wereAllUsed()) {
      this.light = this.lightGenerator.getValue();
    }
    
    let hue = this.hueGenerator.getValue();

    return `hsl(${hue}, ${this.saturation}%, ${this.light}%)`
  }

}

class NextValueGetter{
  constructor(){}
  private nextIndex = 0;
  private wereAllValuesUsed =false;
  private arrayOfValues = [0, 1];

  getValueFromArrayByIndex(array: any[], index: number){
    return array[index]
  }

  wereAllUsed(){ 
    let output = this.wereAllValuesUsed;
    return output;
  }

  getValue(){
    let output = this.getValueFromArrayByIndex(this.arrayOfValues, this.nextIndex);
    this.nextIndex++;
    if (this.nextIndex == this.arrayOfValues.length) {this.wereAllValuesUsed = true; this.nextIndex = 0}
    else this.wereAllValuesUsed = false;
    return output
  }

  restart(){
    this.nextIndex = 0;
    this.wereAllValuesUsed = false;
  }
}


function configureNextValueGetter(arrayOfValues: any[], getValueFromArrayByIndex: Function = function(array: any[], index: number) {return array[index]}) {
  return function <T extends { new(...args: any[]): {}}>(constructor: T) {
    return class extends constructor {
      arrayOfValues = arrayOfValues;
      getValueFromArrayByIndex = getValueFromArrayByIndex;  
    }
  }
 }

@configureNextValueGetter(['hsl(60, 0%, 100%)', 'hsl(60, 0%, 80%)'])
class SpecialColorsGetter extends NextValueGetter{}

@configureNextValueGetter([80, 30])
class LightGenerator extends NextValueGetter{}

@configureNextValueGetter([100, 50])
class SaturationValueGetter extends NextValueGetter{}

@configureNextValueGetter([
  {name: 'yellow'    ,hue: 60 },
  {name: 'green'     ,hue: 120},
  {name: 'torquoise' ,hue: 180},
  {name: 'blue'      ,hue: 240},
  {name: 'pink'      ,hue: 300},
  {name: 'red'       ,hue: 0  },
  {name: 'aquamarine',hue: 150},
  {name: 'orange'    ,hue: 30 },
  {name: 'lightBlue' ,hue: 210},
  {name: 'vilet'     ,hue: 270},
  {name: 'beetroot'  ,hue: 330},
], function(array: any[], index: number) {return array[index].hue})
class HueGenerator extends NextValueGetter {}
