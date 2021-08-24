import { Component, OnInit } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private calendarProvider: CalendarObjectProviderService) { }

  ngOnInit(): void {
    this.calendarProvider.test();
  }

}
