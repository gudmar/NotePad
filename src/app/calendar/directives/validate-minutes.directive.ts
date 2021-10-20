import { Directive, Input, HostListener } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[ValidateMinutes]'
})
export class ValidateMinutesDirective {
  @Input('ifNotValid') ifNotValid: any;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keyup', ['$event'])
  onChange(event: any){
    this.validator.setColorsToMinutes(event)
  }

  @HostListener('keydown', ['$event'])
  blurOnEnter(event:any){
    if (event.keyCode === 13){
      event.preventDefault();
      event.target.blur();
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    this.validator.setEndMinutes(event, this.ifNotValid);
  }

}
