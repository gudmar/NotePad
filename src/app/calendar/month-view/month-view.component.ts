import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { CommunicationService } from '../../services/communication.service'
import { EventManagerService } from '../services/event-manager.service';
import { ConcatSource } from 'webpack-sources';
import { StorageManagerService } from '../../services/storage-manager.service';
import { ValidatorService } from '../services/validator.service';
import { resolve } from 'dns';
// import { setTimeout } from 'timers';
@Component({
  selector: 'month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  private _year: number = 0;
  uniqueId: string = 'month-view-id'
  private _events: any[] = [];
  // @Input() events: any[] = [];
  @Input() set year(val: number) {
    if (val != this._year && this.validator.isYearValid(val)){
      // this.communicator.inform('showHideWaitingSpinner', 'show')
      console.log(performance.now())
      this._year = val; 
      this.refreshYear();  
      
      console.log(performance.now())
      
    }
  }
  get year() {return this._year}
  // @Input() monthDescriptor: {
  //   monthIndex: number,
  //   monthName: string,
  //   weeks: any[]
  // } = {monthIndex: 0, monthName: '', weeks: []}

  @Input() months: any[] = []
  @Input() set events(val: any[]) {
    this._events = val; 
    if (this.year > 999 && this.year < 3001) this.refreshYear();
  }
  get events() {return this._events}

  constructor(
    private calendarProvider: CalendarObjectProviderService,
    private communicator: CommunicationService,
    private eventManager: EventManagerService,
    private storageManager: StorageManagerService,
    private validator: ValidatorService
  ) { }

  ngOnInit(): void {
    this.communicator.subscribe(
      this.uniqueId, this.handleMessages.bind(this), 
      ['refreshAllComponents', 'loadDocument', 'switchTaskViewerToNextDayDifferentYear', 'dayComponentCreated']
    )
    this.initializeWithPresentYear();
    this.communicator.inform('showHideWaitingSpinner', 'hide')
    
  }
  handleMessages(eventType: string, data: any){
    if(eventType == 'refreshAllComponents') {
      // this.refreshYear();
    }
    if (eventType == 'dayComponentCreated') {
      if (data.day == 1 && data.month == 0 && data.year == this.year){
        this.communicator.inform('showHideWaitingSpinner', 'hide')
      }
    }
    if (eventType == 'loadDocument') { 
      let newDocument = this.storageManager.loadContent(data);

      // this.events = this.eventManager.fetchYearEvents(this.year, newDocument.calendarInputs).entries
      this.events = newDocument.calendarInputs
      this.refreshYear();
    }
    if (eventType == 'switchTaskViewerToNextDayDifferentYear') {
      this.year = data.year;
      this.communicator.infromAfter(
        'switchTaskViewerToNextDayOfTheSameYear', 
        data, this.reloaded.call(this, data.day, data.month, data.year)
      )
  
    }
  }
  async reloaded(newDay: number, newMonth: number, newYear: number){
    let to = new Promise((resolve, reject) => {setTimeout(reject, 5000)})
    let isResolved = new Promise((resolve, reject)=>{
      let that = this;
      let et = 'dayComponentCreated';
      function isResolved(eventType: string, data:any){
        if (eventType == et){
          
          if (data.day == newDay, data.month == newMonth, data.year == newYear)
          {
            that.communicator.unsubscribe(id);
            resolve('');  
          }
        }
      }
      let id = 'jumpToDateId'
      this.communicator.subscribe(id, isResolved, [et]);
    })
    return Promise.race([to, isResolved])
  }

  refreshYear(){
    this.months = this.calendarProvider.getYearAsObject(this.year).months
  }  

  getMonthEvents(year: number, month: number){
    return this.eventManager.fetchMonthEvents(year, month, this.events)
  }
  get arrayOfEventsByMonth(){
    let arrayOfEvents = [];
    for(let month = 0; month < 12; month++){
      arrayOfEvents.push(this.getMonthEvents(this.year, month))
    }
    return arrayOfEvents;
  }

  initializeWithPresentYear(){
    let currentDate = Date.now();
    let dateObj = new Date(currentDate);
    this.year = dateObj.getFullYear();
  }

  incrementYear(step: number){
    this.year = this.year + step;
  }

  changeYear(data: any){
    this.year = parseInt(data.target.innerText);
  }

  switchToNotes(){
    this.communicator.inform('switchToNotes', '')
  }
  displaySaveWindow(){
    this.communicator.inform('displaySaveWindow', '')
  }

  validateYear(event:any){

  }

  // test(){
  //   console.dir(this.events)
  // }
}