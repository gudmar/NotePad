import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EventManagerService } from '../../services/event-manager.service';
import { ValidatorService } from '../../services/validator.service';

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
private _shouldDisplay: boolean = false;
@Input() set shouldDisplay(val: boolean) {
  console.log(val)
  this._shouldDisplay = val;
}
@Output() closeMoveWindowEvent: EventEmitter<any> = new EventEmitter();
toDay: number = this.day;
toMonth: number = this.month;
toYear: number = this.year;

get shouldDisplay() {return this._shouldDisplay}
uniqueId: string = 'moveEventId'
  constructor(
    private eventManager: EventManagerService,
    private validator: ValidatorService,
  ) { }

  ngOnInit(): void {
  }

  closeMoveWindow(){this.closeMoveWindowEvent.emit()}

  setEndDay(event: any){this.toDay = event.target.innerText;}

  validateDay(event: any){
    return this.validator.isDayValid(event.target.innerText, this.toMonth, this.toYear)
  }
  setEndMonth(event: any){this.toMonth = event.target.innerText}

  validateMonth(event: any){return this.validator.isMonthValid(event.target.innerText)}
  
  setEndYear(event: any){this.toYear = event.target.innerText;}

  validateYear(event: any){this.validator.isYearValid(event.target.innerText)}
  

  moveEvent(){
    this.eventManager.moveEvent(
      {year: this.year, month: this.month, day: this.day}, 
      {year: this.toYear, month: this.toMonth, day: this.toDay}, 
      this.events, 
      this.targetEventId
    )
  }
}
