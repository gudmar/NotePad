import { Directive, Input, HostListener } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[ValidateDuration]'
})
export class ValidateDurationDirective {
  @Input('ifNotValid') ifNotValid: any;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  onChange(event: any){
    this.validator.setColorsToDuration(event)
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    this.validator.setEndDuration(event, this.ifNotValid);
  }

}
