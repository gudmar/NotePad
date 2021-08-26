import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { CommunicationService } from '../../services/communication.service'
import { EventManagerService } from '../services/event-manager.service';
import { ConcatSource } from 'webpack-sources';
@Component({
  selector: 'month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  private _year: number = 0;
  @Input() events: any[] = [];
  @Input() set year(val: number) {
    if (val != this._year && this.isYearValid(val)){
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
  ) { }

  ngOnInit(): void {
    if (this.months.length == 0) this.initializeWithPresentYear()
    
  }

  refreshYear(){
    this.months = this.calendarProvider.getYearAsObject(this.year, this.events).months
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

  async turnOnSpinner(){
    return new Promise((resolve, reject) => {
      // setTimeout(()=>{this.communicator.inform('show/hideSpinner', true)})
      resolve(setTimeout(()=>{this.communicator.inform('show/hideSpinner', true)}))
    })
  }
  async turnOffSpinner(){
    return new Promise((resolve, reject) => {
      // setTimeout(()=>{this.communicator.inform('show/hideSpinner', false)})
      resolve(setTimeout(()=>{this.communicator.inform('show/hideSpinner', false)}))
    })
  }

  initializeWithPresentYear(){
    let currentDate = Date.now();
    let dateObj = new Date(currentDate);
    this.year = dateObj.getFullYear();
    // this.months = this.calendarProvider.getYearAsObject(this.year).months;
  }

  incrementYear(step: number){
    this.year = this.year + step;
  }

  changeYear(data: any){
    this.year = parseInt(data.target.innerText);
    if (this.year.toString() != data.target.innerText) data.target.innerText = this.year;
  }

  isYearValid(valueToTest: number ){
    let digitTestPattern = new RegExp("\\d{4}")
    let otherTestPattern = new RegExp('\\D')
    let s = digitTestPattern.test(valueToTest.toString())
    let w = otherTestPattern.test(valueToTest.toString())
    if (!digitTestPattern.test(valueToTest.toString())) return false
    if (otherTestPattern.test(valueToTest.toString())) return false
    if (valueToTest > 3000) return false
    return true;
  }
  switchToNotes(){
    this.communicator.inform('switchToNotes', '')
  }
  displaySaveWindow(){
    this.communicator.inform('displaySaveWindow', '')
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
