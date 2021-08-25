import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'

@Component({
  selector: 'month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  private _year: number = 0;
  @Input() set year(val: number) {
    if (val != this._year && this.isYearValid(val)){
      this._year = val; 
      this.refreshYear();  
    }
  }
  get year() {return this._year}
  // @Input() monthDescriptor: {
  //   monthIndex: number,
  //   monthName: string,
  //   weeks: any[]
  // } = {monthIndex: 0, monthName: '', weeks: []}

  @Input() months: any[] = []

  constructor(private calendarProvider: CalendarObjectProviderService) { }

  ngOnInit(): void {
    if (this.months.length == 0) this.initializeWithPresentYear()
  }

  refreshYear(){
    this.months = this.calendarProvider.getYearAsObject(this.year).months;
  }

  initializeWithPresentYear(){
    let currentDate = Date.now();
    let dateObj = new Date(currentDate);
    this.year = dateObj.getFullYear();
    this.months = this.calendarProvider.getYearAsObject(this.year).months;
  }

  incrementYear(step: number){
    this.year = this.year + step;
  }

  changeYear(data: any){
    this.year = parseInt(data.target.innerText);
    if (this.year != parseInt(data.target.innerText)) data.target.innerText = this.year;
  }

  isYearValid(valueToTest: number ){
    let testPattern = new RegExp("\\d{4}")
    let s = testPattern.test(valueToTest.toString())
    // debugger
    if (!testPattern.test(valueToTest.toString())) return false
    if (valueToTest > 3000) return false
    return true;
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