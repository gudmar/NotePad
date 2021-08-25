import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() viewMode: 'month' | 'week' | 'mobile' = 'month';
  @Input() events: any[] = [];
  calendarEvents: any[] = []; // kept here, because view is dynamic, and this is static, not to be deleted
  constructor(private calendarProvider: CalendarObjectProviderService) { }

  ngOnInit(): void {
    this.calendarProvider.test();
    console.dir(this.events)
  }

}
