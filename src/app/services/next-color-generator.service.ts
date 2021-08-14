import { Injectable } from '@angular/core';

// generate an iterator returning in loop some colors, that are not too bright to be readable, and that would repeat not too often

@Injectable({
  providedIn: 'root'
})
export class NextColorGeneratorService {

  colorToHue: Map<string, number> = new Map();
  lightValues: number[] = [80, 30];
  saturationValues: number[] = [100, 50];
  specialColors: string[] = ['hsl(60, 0%, 100%)', 'hsl(60, 0%, 80%)']; // white, grey;
  private internalColorIterator = this.endlesColorIterator();

  constructor() {   }

  setColorsToMap(){
    this.colorToHue.set('yellow', 60);
    this.colorToHue.set('green', 120);
    this.colorToHue.set('torquoise', 180);
    this.colorToHue.set('blue', 240);
    this.colorToHue.set('pink', 300);
    this.colorToHue.set('red', 0);
    this.colorToHue.set('aquamarine', 150);
    this.colorToHue.set('yellow', 60);
    this.colorToHue.set('orange', 30);
    this.colorToHue.set('lightBlue', 210);
    this.colorToHue.set('vilet', 270);
    this.colorToHue.set('beetroot', 330);
  }

  colorsIterator(){
    let nextIndex = 0;
    let keys = Array.from(this.colorToHue.keys())
    return {
      next: function() {
        return nextIndex < this.colors.size ? 
          {value: this.colorToHue.get(keys[nextIndex]), done: false} :
          {done: true}
      }
    }
  }

  endlesColorIterator(){
    let currentLightIndex = 0;
    let currentSaturationIndex = 0;
    let specialColorsIndex = 0;
    let hueIterator = this.colorsIterator();
    let incrementOtherColorParameters = function(){
      currentLightIndex++;
      if (currentLightIndex < this.lightValues.length) return null;
      currentLightIndex = 0;
      currentSaturationIndex++;
      if (currentSaturationIndex < this.saturationValues.length) return null;
      specialColorsIndex++;
      if (specialColorsIndex < this.specialColors.length) return null;
      currentLightIndex = currentSaturationIndex = specialColorsIndex = 0;
      return null;
    }
    return {
      next: function() {
        let nextHue =hueIterator.next();
        if (nextHue.done) {
          hueIterator = this.colorsIterator();
          nextHue = hueIterator.next();
          incrementOtherColorParameters()
        }
        return {
          value: `hsl(${nextHue}, ${this.saturationValues[currentSaturationIndex]}%, ${this.lightValues[currentLightIndex]}%)`,
          done: false
        }  // Will never end, as potentially there will always be demand for some next color. 
          // Colors will eventually loop, as there are not many colors that are good enough for a background and that can be distinguished 
          // by end user, so they have to repete
      }
    }
  }

  getNextColor(){
    return this.internalColorIterator.next().value;
  }

}
