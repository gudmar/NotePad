import { Injectable } from '@angular/core';
import { NgModule } from '@angular/compiler/src/core';
import { ConcatSource } from 'webpack-sources';
import { ConstantPool } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class Rgb2HslService {

  constructor() { }

  convertToString(r: number, g: number, b: number){
    let converted = this.convert(r, g, b);
    return `hsl(${converted.h}, ${(converted.s * 100).toFixed(0)}%, ${(converted.l * 100).toFixed(0)}%)`
  }
  convert(red: number, green: number, blue: number){
    let {r, g, b} = this.normalize(red, green, blue);
    let {h, s, l} = {h: 0, s: 0, l: 0};
    let maxColorIngr = Math.max(r, g, b);
    let minColorIngr = Math.min(r, g, b);
    let delta = maxColorIngr - minColorIngr;
    let roundHue = function(hue: number):number{
      let value = Math.round(hue * 60);
      return value < 0 ? value + 360 : value
    }
    let calculateHue = function(): number{
      if (delta == 0) return 0;
      if (maxColorIngr == r) return roundHue(((g - b) / delta) % 6);
      if (maxColorIngr == g) return roundHue(((b - r) / delta) + 2);
      return roundHue((r - g) / delta + 4);
    }
    let calculateLight = function() {
      return (maxColorIngr + minColorIngr) / 2;
    }
    let calculateSaturation = function() {
      return delta == 0 ? 0 : delta / (1 - Math.abs(2 * calculateLight() - 1));
    }
    return {h: this.round(calculateHue()), s: this.round(calculateSaturation()), l: this.round(calculateLight())}
  }

  private round(number: number){
    return Math.round(number * 100) / 100;
  }


  normalize(r: number, g: number, b: number){
    return {r: r / 255, g: g / 255, b: b / 255}
  }

}


// https://stackoverflow.com/questions/39118528/rgb-to-hsl-conversion



// function RGBToHSL(r,g,b) {
//   // Make r, g, and b fractions of 1
//   r /= 255;
//   g /= 255;
//   b /= 255;

//   // Find greatest and smallest channel values
//   let cmin = Math.min(r,g,b),
//       cmax = Math.max(r,g,b),
//       delta = cmax - cmin,
//       h = 0,
//       s = 0,
//       l = 0;

//   // Calculate hue
//   // No difference
//   if (delta == 0)
//     h = 0;
//   // Red is max
//   else if (cmax == r)
//     h = ((g - b) / delta) % 6;
//   // Green is max
//   else if (cmax == g)
//     h = (b - r) / delta + 2;
//   // Blue is max
//   else
//     h = (r - g) / delta + 4;

//   h = Math.round(h * 60);
    
//   // Make negative hues positive behind 360°
//   if (h < 0)
//       h += 360;

//   // Calculate lightness
//   l = (cmax + cmin) / 2;

//   // Calculate saturation
//   s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
//   // Multiply l and s by 100
//   s = +(s * 100).toFixed(1);
//   l = +(l * 100).toFixed(1);

//   return "hsl(" + h + "," + s + "%," + l + "%)";
// }