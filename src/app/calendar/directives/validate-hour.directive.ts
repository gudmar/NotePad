import { Directive, Input, HostListener } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[ValidateHour]'
})
export class ValidateHourDirective {

  @Input('ifNotValid') ifNotValid: any;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  onChange(event: any){
    this.validator.setColorsToHour(event)
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    this.validator.setEndHour(event, this.ifNotValid);
  }
}
