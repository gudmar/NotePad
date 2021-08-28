import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { EventManagerService } from '../../services/event-manager.service';
import { ValidatorService } from '../../services/validator.service';
import { CommunicationService } from '../../../services/communication.service';

  function asyncFunction (target: Function, propertyKey: string, descriptor: PropertyDescriptor):any{
    let originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]){
      let result = setTimeout(()=>{
        originalMethod.apply(args);
      })
      return result;
    }
  }



@Component({
  selector: 'move-to-window',
  templateUrl: './move-to-window.component.html',
  styleUrls: ['./move-to-window.component.css']
})
export class MoveToWindowComponent implements OnInit {
@Input() year: number = 0;
@Input() month: number = 0;
@Input() day: number = 0;
@Input() events: any[] = [];
@Input() targetEventId: any;
@Input() calendarEventsObject: any = [];
private _shouldDisplay: boolean = false;
@Input() set shouldDisplay(val: boolean) {
  this._shouldDisplay = val;
}
@Output() closeMoveWindowEvent: EventEmitter<any> = new EventEmitter();
@ViewChild('year') 
yearField: any;
@ViewChild('month')
monthField: any;
@ViewChild('day')
dayField: any;

toDay: number = this.day;
toMonth: number = this.month;
toYear: number = this.year;
allCalendarEvents: any = [];
shouldInformDateNotValid: boolean = false;
get shouldDisplay() {return this._shouldDisplay}
uniqueId: string = 'moveEventId'
  constructor(
    private eventManager: EventManagerService,
    private validator: ValidatorService,
    private communicator: CommunicationService
  ) { }

  ngOnInit(): void {
    this.toDay = this.day;
    this.toYear = this.year;
    this.toMonth = this.month;
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['calendarEvents']);
    this.getAllCalendarEvents();
  }

  closeMoveWindow(){
    this.closeMoveWindowEvent.emit();
  }

  getAllCalendarEvents(){
    this.communicator.inform('provideCalendarEvents', '')//, this.handleMessages.bind(this), )
  }
  handleMessages(eventType: string, data: any){
    if (eventType == 'calendarEvents') {
      this.allCalendarEvents = data;
    }
  }

  setEndDay(event: any){
    if (this.validator.isDayValid(event.target.innerText, this.toMonth, this.toDay)){
      this.toDay = parseInt(event.target.innerText);
    }
  }

  validateDay(event: any){
    let that = this;
    function dayValidator(month: number, year: number){
      let y = year;
      let m = month - 1;
      // -1 is difference between real month and js conunting from 0
      return function(day: number){
        return that.validator.isDayValid(day, m, y)
      }
    }
    return this.validate(event, dayValidator(this.toMonth, this.year).bind(this))
  }

  setEndMonth(event: any){
    let isValid = this.validator.isMonthValid(event.target.innerText);
    if (isValid){
      this.toMonth = parseInt(event.target.innerText);
    } else {
      event.target.innerText = this.toMonth;
    }
    event.target.style.backgroundColor = '';
  }

  validateMonth(event: any){ this.validate(event, this.validator.isMonthValid.bind(this.validator))}

  setEndYear(event: any){
    this.toYear = parseInt(event.target.innerText);
  }
  

  validate(event: any, validationFunction: Function){
    setTimeout(()=>{
      let isValid = validationFunction(event.target.innerText);
      event.target.style.backgroundColor = isValid ? 'rgb(200, 255, 200)' : 'rgb(255, 200, 200)'
    })
  }
  

  moveEvent(event:any){
    if (this.toDateDifferentCurrentDate()){
      let whatObjecsWereAdded = this.eventManager.moveEvent(
        {year: this.year, month: this.month - 1, day: this.day}, 
        {year: this.toYear, month: this.toMonth - 1, day: this.toDay}, 
        this.allCalendarEvents, 
        this.targetEventId
      )
      this.infromComponentsAboutChange(whatObjecsWereAdded);
      this.closeMoveWindow();
    }  else { this.informDateDidNotChange()}
  }

  toDateDifferentCurrentDate(){
    if (this.toYear != this.year) return true;
    if (this.toMonth != this.month) return true;
    if (this.toDay != this.day) return true;
    return false;
  }

  informDateDidNotChange(){
    this.shouldInformDateNotValid = true;
    let that = this;
    let t = setTimeout(() => {that.shouldInformDateNotValid = false}, 1300)
  }

  infromComponentsAboutChange(whatObjecsWereAdded: any){
    if (!whatObjecsWereAdded.newYearWasCreated){ //as year components are not created at all
      if (whatObjecsWereAdded.newDayWasCreated) this.informDayComponentsAboutChange();
    }
  }

  informDayComponentsAboutChange(){
    this.communicator.inform('eventWasMovedAndDayWasCreated', {day: this.toDay, month: this.toMonth - 1})
  }
  informMonthComponentsAboutChange(){
    this.communicator.inform('eventWasMovedAndMonthWasCreated', {month: this.toMonth})
  }
}


