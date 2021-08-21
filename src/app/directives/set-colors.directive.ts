import { Directive, Input, ElementRef } from '@angular/core';
import { NextColorGeneratorService } from '../services/next-color-generator.service'

@Directive({
  selector: '[setColors]',
  providers: [ NextColorGeneratorService]
})
export class SetColorsDirective {
  private _bgColor:string = 'white';
  private _shouldSetBgColor = true;
  fgColor: string = "black";
  colorManager: NextColorGeneratorService;
  elRef: ElementRef;
  @Input ('shouldSetBgColor') set shouldSetBgColor(val: boolean){
    this._shouldSetBgColor = val;
    this.setBgColorIfSetSo(this.bgColor)
  } 
  @Input('dBgColor') set bgColor (val: string) { 
    this._bgColor  = val;
    this.fgColor = this.colorManager.getFgColor(val);
    this.setBgColorIfSetSo(val)
    this.elRef.nativeElement.style.color = this.colorManager.getFgColor(val)
  }
  get bgColor() {return this._bgColor}
  constructor(colorManager: NextColorGeneratorService, elRef: ElementRef) { 
    this.colorManager = colorManager;
    this.elRef = elRef
  }

  setBgColorIfSetSo(color: string){
    if (this._shouldSetBgColor){
      this.elRef.nativeElement.style.backgroundColor = color;
    } else {
      this.elRef.nativeElement.style.backgroundColor = '';
    }
  }
}

