import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ColorToRGBService } from './color-to-rgba.service';
import { Rgb2HslService } from './rgb-2-hsl.service'

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

  getFirstColor(){
    return `hsl(${this.hueGenerator.peepFirstValue((v:any)=>{return v.hue})}, ${this.saturatoinGenerator.peepFirstValue()}%, ${this.lightGenerator.peepFirstValue()}%)`
  }

  getColorAfterGiven(color: string){
    let round10 = function(n: number) {return Math.round(n / 10)*10}
    
    let colorAsHSL = this.colorToHSLValues(color);
    colorAsHSL = {h: round10(colorAsHSL.h), s: round10(colorAsHSL.s * 100), l: round10(colorAsHSL.l * 100)}
    let colorAsHSLString = `hsl(${colorAsHSL.h}, ${colorAsHSL.s}%, ${colorAsHSL.l}%)`;
    let specialColorValue = this.specialColorGetter.peepNextValue(colorAsHSLString);
    let areAllSaturationValuesUsed: boolean = this.saturatoinGenerator.areValuesUsed(colorAsHSL.s);
    let areAllLightValuesUsed: boolean = this.lightGenerator.areValuesUsed(colorAsHSL.l)
    let areAllHueValuesUsed: boolean = this.hueGenerator.areValuesUsed(colorAsHSL.h, (val: any)=>{return val.hue})
    let isFirstSpecialColor = areAllHueValuesUsed && areAllLightValuesUsed && areAllSaturationValuesUsed;
    let isLastSpecialColor = this.specialColorGetter.areValuesUsed(colorAsHSLString)
    if (isLastSpecialColor) {
      return `hsl(${this.hueGenerator.peepFirstValue((v:any)=>{return v.hue})}, ${this.saturatoinGenerator.peepFirstValue()}%, ${this.lightGenerator.peepFirstValue()}%)`
    }
    if (specialColorValue != null) return this.specialColorGetter.peepNextValue(colorAsHSLString);   
    if (isFirstSpecialColor) return this.specialColorGetter.peepFirstValue();
    let hue = this.hueGenerator.peepNextValue(colorAsHSL.h, (val: any)=>{return val.hue})
    let light = this.lightGenerator.peepNextValue(colorAsHSL.l)
    let saturation = this.saturatoinGenerator.peepNextValue(colorAsHSL.s)

    if (!areAllHueValuesUsed) return `hsl(${hue}, ${colorAsHSL.s}%, ${colorAsHSL.l}%)`
    if (!areAllLightValuesUsed && areAllHueValuesUsed) return `hsl(${hue}, ${colorAsHSL.s}%, ${light}%)`
    if (areAllLightValuesUsed && areAllHueValuesUsed) return `hsl(${hue}, ${saturation}%, ${light}%)`
    if (!areAllSaturationValuesUsed) return `hsl(${hue}, ${saturation}%, ${colorAsHSL.l}%)`
    
    return `hsl(${hue}, ${saturation}%, ${light}%)`

  }



  colorToHSLValues(colorAsString: string){
    let color2rgb = new ColorToRGBService();
    let toHSLconverter = new Rgb2HslService();
    let rgbValues: number[] = color2rgb.transform(colorAsString);
    let hslValues = toHSLconverter.convert(rgbValues[0], rgbValues[1], rgbValues[2])
    return hslValues
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

  peepNextValue(currentValue: any, valueGetter?: Function){
    if (valueGetter == undefined) valueGetter = (val: any) => {return val};
    let indexOfCurrnet = this.getIndexOfValue(currentValue, valueGetter);
    // debugger

    if (indexOfCurrnet == -1)  return null;
    if (indexOfCurrnet == this.arrayOfValues.length - 1) return valueGetter(this.arrayOfValues[0])
    return valueGetter(this.arrayOfValues[indexOfCurrnet + 1])
  }

  peepFirstValue(valueGetter?: Function){
    if (valueGetter == undefined) valueGetter = (val: any) => {return val};
    return valueGetter(this.arrayOfValues[0]);
  }

  areValuesUsed(currentValue: any, valueGetter?: Function){
    if (valueGetter == undefined) valueGetter = (val: any) => {return val};
    let i = this.getIndexOfValue(currentValue, valueGetter)

    return this.getIndexOfValue(currentValue, valueGetter) == this.arrayOfValues.length - 1 ? true : false;
  }

  private getIndexOfValue(value: any, valueGetter: Function){
    function singleMatch(element: any) { return value === valueGetter(element)}
    return this.arrayOfValues.findIndex(singleMatch);
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

class HSLorRGBValuesGetter {
  constructor(){}
  // removeWrappingString(hslString: string){
  //   let indexOfOppener = Array.from(hslString).findIndex((element:string)=> {return element == '('? true : false})
  //   let indexOfCloser = Array.from(hslString).length - 1;
  //   return hslString.slice(indexOfOppener, indexOfCloser);
  // }
  // getValues(hslOrRgbString:string){
  //   let comaSeparatedValues = this.removeWrappingString(hslOrRgbString);
  //   let arrayOfStrings = comaSeparatedValues.split(',');
  //   // 0: h or r, 1: g or s, 2 : b or l
  //   return [parseFloat(arrayOfStrings[0]), parseFloat(arrayOfStrings[1]), parseFloat(arrayOfStrings[2])]
  // }
  colorToHSLValues(colorAsString: string){
    let color2rgb = new ColorToRGBService();
    let toHSLconverter = new Rgb2HslService();
    let rgbValues: number[] = color2rgb.transform(colorAsString);
    let hslValues = toHSLconverter.convert(rgbValues[0], rgbValues[1], rgbValues[2])
    return hslValues
  }
}

@configureNextValueGetter(['hsl(0, 0%, 100%)', 'hsl(0, 0%, 80%)'])
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
