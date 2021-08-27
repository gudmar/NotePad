import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { CommunicationService } from '../../services/communication.service';
import { EventManagerService } from '../services/event-manager.service';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() viewMode: 'month' | 'week' | 'mobile' = 'month';
  @Input() events: any[] = [];
  uniqueId = 'calendarId'
  calendarEvents: any[] = []; // kept here, because view is dynamic, and this is static, not to be deleted
  constructor(
    private calendarProvider: CalendarObjectProviderService,
    private communicator: CommunicationService,
    private eventManager: EventManagerService
  ) { }

  ngOnInit(): void {
    this.communicator.subscribe(this.uniqueId, 
      this.messageHandler.bind(this), ['provideCalendarEvents', 'provideCalendarEventsForSingleDay'])
    console.dir(this.events)
  }

  messageHandler(eventType: string, data: any){
    if (eventType == 'provideCalendarEvents'){
      this.communicator.inform('calendarEvents', this.events);
    }
    if (eventType == 'provideCalendarEventsForSingleDay'){
      let events = this.eventManager.fetchDayEvents(data.year, data.month, data.day, this.events)
      // debugger
      if (typeof(events.entries) != 'function'){
        this.communicator.inform('calendarEventsForDay',
        {events: events.entries, day: data.day, month: data.month, year: data.year})
      } else {
        this.communicator.inform('calendarEventsForDay', null)
      }
      
    }
  }

}
