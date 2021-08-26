import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service'
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { EEXIST } from 'constants';
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css']
})
export class TaskViewerComponent implements OnInit {
  uniqueId: string = 'taskViewerId'
  @Input() day: number = 0;
  @Input() month: number = 0;
  @Input() year: number = 0;
  @Input() cw: number = 0;
  @Input() events: any[] = [];
  @Input() shouldBeDisplayed: boolean = true;
  get entries() {return this.events}
  get dayAsString() {return this.calendarProvider.getDayName(this.day)}
  get currentDate() {
    return `${this.day} / ${this.month} / ${this.year} CW: ${this.cw}`
  }
  constructor(
    private communicator: CommunicationService,
    private calendarProvider: CalendarObjectProviderService
  ) { 
    communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['eventViewerShouldBeDisplayed'])
  }

  hourValidationClass = {'valid': false,'notValid': false}
  validateHours(event: any){
    setTimeout(()=>{
      let isValid = this.hoursMinutesValidationFunctionFactory(24)(event.target.innerText)
      event.target.style.backgroundColor = isValid?'rgb(180, 255, 180)':'rgb(255, 180, 180)'
    })
  }
  validateMinutes(event: any){
    setTimeout(()=>{
      let isValid = this.hoursMinutesValidationFunctionFactory(59)(event.target.innerText)
      event.target.style.backgroundColor = isValid?'rgb(180, 255, 180)':'rgb(255, 180, 180)'
    })
  }
  validateDuration(event: any){
    setTimeout(()=>{
      let isValid = this.durationValidationFunction(event.target.innerText)
      event.target.style.backgroundColor = isValid?'rgb(180, 255, 180)':'rgb(255, 180, 180)'
    })
  }
  validateSummary(event: any){
    setTimeout(()=>{
      let isValid = this.summaryValidationFunction(event.target.innerText)
      event.target.style.backgroundColor = isValid?'rgb(180, 255, 180)':'rgb(255, 180, 180)'
    })
  }

  add0prefix(n: number){
    return parseInt(n.toString()) < 10 ? `0${parseInt(n.toString())}` : n;
  }

  handleMessages(eventType: string, data: any){
    this.day = data.day;
    this.month = data.month;
    this.year = data.year;
    this.cw = data.cw;
    this.events = data.events;
    this.shouldBeDisplayed = true;
  }

  test(){console.log('changed')}

  ngOnInit(): void {
    console.log(this.add0prefix(0))
    console.log(this.add0prefix(1))
    console.log(this.add0prefix(9))
    console.log(this.add0prefix(10))
  }

  close(){
    this.shouldBeDisplayed = false;
  }

  onFocusOut(event: any, modificationTarget: string, uniqueId: string){
    // this.hourValidationClass.valid = false;
    // this.hourValidationClass.notValid = false;
    event.target.style.backgroundColor = ''
    this.modifyNote(event, modificationTarget, uniqueId)
  }

  modifyNote(event: any, modificationTarget: string, uniqueId: string){
    event.stopPropagation();
    let valueFromField = event.target.innerText;

    let isValid: boolean = false;
    if (modificationTarget == 'hours') { 
      isValid = this.modifyIfValid(uniqueId, modificationTarget, valueFromField, 
        this.hoursMinutesValidationFunctionFactory(24))
    } else if (modificationTarget == 'minutes') {
      isValid = this.modifyIfValid(uniqueId, modificationTarget, valueFromField, 
        this.hoursMinutesValidationFunctionFactory(59))
    } else if (modificationTarget == 'summary') { 
      isValid = this.modifyIfValid(uniqueId, modificationTarget, valueFromField, this.summaryValidationFunction)
    } else if (modificationTarget == 'duration') { 
      isValid = this.modifyIfValid(uniqueId, modificationTarget, valueFromField, this.durationValidationFunction)
    } else if (modificationTarget == 'description') { 
      isValid = true;
      this.modifyEvent(uniqueId, modificationTarget, valueFromField);
    }
    // debugger
    if (modificationTarget == "hours" || modificationTarget == "minutes"){
      let a = this.add0prefix(this.getOriginalValue(uniqueId, modificationTarget));
    
      if (!isValid) event.target.innerText = this.add0prefix(this.getOriginalValue(uniqueId, modificationTarget))
      event.target.innerText = this.add0prefix(event.target.innerText)
    } else {
      if (!isValid) event.target.innerText = this.getOriginalValue(uniqueId, modificationTarget)
      if (modificationTarget == 'duration') event.target.innerText = parseInt(event.target.innerText)
    }
    
  }
  summaryValidationFunction(toValidate: any){
    return toValidate.toString().length <= 50;
  }

  hoursMinutesValidationFunctionFactory(maxVal: number){
    let max = maxVal;
    return (toValidate:string | number) => {
      let digitRe = new RegExp('\\d{1,2}');
      let nonDigitRe = new RegExp('\\D')
      let a = nonDigitRe.test(toValidate.toString())
      let b  = digitRe.test(toValidate.toString())
      // debugger
      if (nonDigitRe.test(toValidate.toString())) return false;
      if (!digitRe.test(toValidate.toString())) return false;
      if (parseInt(toValidate.toString()) < 0 || parseInt(toValidate.toString()) >= maxVal) return false;

      return true;  
    }
  }
  durationValidationFunction(toValidate: string | number){
    //if (typeof(toValidate) == 'number') toValidate = toValidate.toString();
    // let digitRe = new RegExp('\\d{1,3}');
    let nonDigitRe = new RegExp('\\D')
    if (nonDigitRe.test(toValidate.toString())) return false;
    if (parseInt(toValidate.toString()) > 999) return false
    // if (!digitRe.test(toValidate.toString())) {return false;}
    return true;
  }
  
  modifyIfValid(uniqueId: string, key: string, newValue: any, conditionFunction: Function){
    let isValid = conditionFunction(newValue);
    if (isValid) this.modifyEvent(uniqueId, key, newValue);
    return isValid
  }
  modifyEvent(uniqueId: string, key: string, newValue: any){
    // let a = this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)
    let objectToModify: any = this.events[this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)]
    objectToModify[key] = newValue;
  }

  getOriginalValue(uniqueId: string, key: string){
    // let a = this.events[this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)]
    // let b = this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)
    // let c = this.events[this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)]
    return this.events[this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)][key]
  }

  getIndexOfElemetnInArray(array: any[], matchKey: string, value: any){
    let singleMatch = function(element: any) { return element[matchKey] == value; }
    return array.findIndex(singleMatch);
  }

}
