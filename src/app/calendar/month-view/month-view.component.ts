import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'

@Component({
  selector: 'month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnInit {
  @Input() year: number = 0;
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

  initializeWithPresentYear(){
    let currentDate = Date.now();
    let dateObj = new Date(currentDate);
    this.year = dateObj.getFullYear();
    this.months = this.calendarProvider.getYearAsObject(this.year).months;

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