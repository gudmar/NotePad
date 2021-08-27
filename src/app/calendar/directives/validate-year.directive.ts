import { Directive, HostListener, Input } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[validateYear]',
  providers: [ValidatorService]
})
export class ValidateYearDirective {
  @Input('ifNotValid') ifNotValid: any;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  onChange(event: any){
    this.validator.setColorsToYear(event)
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    this.validator.setEndYear(event, this.ifNotValid);
  }
}
