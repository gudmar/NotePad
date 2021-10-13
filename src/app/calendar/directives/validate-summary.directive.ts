import { Directive, Input, HostListener } from '@angular/core';
import { ValidatorService } from '../services/validator.service';

@Directive({
  selector: '[ValidateSummary]'
})
export class ValidateSummaryDirective {
  @Input('ifNotValid') ifNotValid: any;
  @Input('maxValue') maxValue: number = 50;
  constructor(private validator: ValidatorService) { }

  @HostListener('mousedown', ['$event'])
  @HostListener('keydown', ['$event'])
  onChange(event: any){
    this.validator.setColorsToSummary(event, this.maxValue)
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: any){
    console.log(this.ifNotValid)
    this.validator.setEndSummary(event, this.ifNotValid, this.maxValue);
  }
}
