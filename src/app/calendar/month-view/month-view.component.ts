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
  @Input() events: any[] = [];
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

  constructor(
    private calendarProvider: CalendarObjectProviderService,
    private communicator: CommunicationService,
    private eventManater: EventManagerService,
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

      // this.events = this.eventManater.fetchYearEvents(this.year, newDocument.calendarInputs).entries
      this.events = newDocument.calendarInputs
      this.refreshYear();
    }
    if (eventType == 'switchTaskViewerToNextDayDifferentYear') {
      this.year = data.year;
      // console.log(this.year)
      // console.log(data)
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
      // let eT = 'yearReloaded';
      // console.log(newYear)
      let et = 'dayComponentCreated';
      function isResolved(eventType: string, data:any){
        if (eventType == et){
          
          if (data.day == newDay, data.month == newMonth, data.year == newYear)
          {
            that.communicator.unsubscribe(id);
            // clearTimeout(to);
            // console.log('RESOLVED')
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
    // console.dir(this.months)
  }  

  getMonthEvents(year: number, month: number){
    
    return this.eventManater.fetchMonthEvents(year, month, this.events)
  }

  // async refreshYear(){

  //   this.turnOnSpinner()
  //     .then((v: any)=>{
  //       return this.calendarProvider.getYearAsObjectAsync(this.year)
  //     })
  //     .then((v: any[])=>{
  //       this.months = v; 
  //       this.turnOffSpinner()
  //     })
  //   // let resolved = await this.calendarProvider.getYearAsObjectAsync(this.year);
  //   // this.months = resolved.months
  //   // setTimeout(()=>{this.communicator.inform('show/hideSpinner', false)})
  // }

  // async turnOnSpinner(){
  //   return new Promise((resolve, reject) => {
  //     // setTimeout(()=>{this.communicator.inform('show/hideSpinner', true)})
  //     resolve(setTimeout(()=>{this.communicator.inform('show/hideSpinner', true)}))
  //   })
  // }
  // async turnOffSpinner(){
  //   return new Promise((resolve, reject) => {
  //     // setTimeout(()=>{this.communicator.inform('show/hideSpinner', false)})
  //     resolve(setTimeout(()=>{this.communicator.inform('show/hideSpinner', false)}))
  //   })
  // }

  initializeWithPresentYear(){
    let currentDate = Date.now();
    let dateObj = new Date(currentDate);
    this.year = dateObj.getFullYear();
    console.log(this.year)
    // this.months = this.calendarProvider.getYearAsObject(this.year).months;
  }

  incrementYear(step: number){
    this.year = this.year + step;
  }

  changeYear(data: any){
    this.year = parseInt(data.target.innerText);
    // if (this.year.toString() != data.target.innerText) data.target.innerText = this.year;
  }

  // isYearValid(valueToTest: number ){
  //   let digitTestPattern = new RegExp("\\d{4}")
  //   let otherTestPattern = new RegExp('\\D')
  //   let s = digitTestPattern.test(valueToTest.toString())
  //   let w = otherTestPattern.test(valueToTest.toString())
  //   if (!digitTestPattern.test(valueToTest.toString())) return false
  //   if (otherTestPattern.test(valueToTest.toString())) return false
  //   if (valueToTest > 3000) return false
  //   return true;
  // }
  switchToNotes(){
    this.communicator.inform('switchToNotes', '')
  }
  displaySaveWindow(){
    this.communicator.inform('displaySaveWindow', '')
  }

  validateYear(event:any){

  }

  test(){
    console.dir(this.events)
  }
}


// <div class="year center">{{year}}</div>
// <div class="arrow ceter">&gt;&gt;</div>
// </div>
// <div class="calendar-content">
// <month *ngFor="month of months"
//     [year] = "year"
//     [monthDescriptor] = "getMonthDescriptor(month)"
// >
