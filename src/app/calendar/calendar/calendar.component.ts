import { Component, OnInit, Input } from '@angular/core';
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { CommunicationService } from '../../services/communication.service';
import { EventManagerService } from '../services/event-manager.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { GetDocumentService } from '../../services/get-document.service';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() viewMode: 'month' | 'week' | 'mobile' = 'month';

  @Input() set events(val: any[]) {
    this._events = [];
    this.calendarProvider.injectEvents(val);
    this._events = val; 
  } 

  get events(){return this._events}
  private _events:any[] = [];
  uniqueId = 'calendarId'
  calendarEvents: any[] = []; // kept here, because view is dynamic, and this is static, not to be deleted
  constructor(
    private documentProvider: GetDocumentService,
    private calendarProvider: CalendarObjectProviderService,
    private communicator: CommunicationService,
    private eventManager: EventManagerService,
    private storageManager: StorageManagerService
  ) { }

  ngOnInit(): void {
    // this.events = this.documentProvider.getDocument().calendarInputs;
    this.communicator.inform('routeSwitched', 'calendar')
    this.communicator.subscribe(this.uniqueId, 
      this.messageHandler.bind(this), 
      ['provideCalendarEvents', 
       'provideCalendarEventsForSingleDay',
       'loadDocument',
       'loadFreshDocument',
       'LoadFromFile',
       'providingDocumentObjectToWorkbookChild'
      ]);
    this.calendarProvider.injectEvents(this.events)
    this.communicator.inform('provideDocumentToChildComponent', null);
  }

  ngOnDestroy(){
    this.communicator.unsubscribe(this.uniqueId);
  }


  messageHandler(eventType: string, data: any){
    if (eventType == 'providingDocumentObjectToWorkbookChild'){
      // setTimeout(()=>{this.document = data;});
      this.events = data.calendarInputs;
    }
    if (eventType == 'provideCalendarEvents'){
      this.communicator.inform('calendarEvents', this.events);
    }
    if(eventType=="loadDocument"){
      let newDocument = this.storageManager.loadContent(data)
      this.calendarProvider.injectEvents(newDocument.calendarInputs)
      this.events = newDocument.calendarInputs;
    }
    if (eventType == "LoadFromFile"){
      this.calendarProvider.injectEvents(data.calendarInputs);
      this.events = data.calendarInputs;
    }
    if (eventType =='loadFreshDocument'){
      let newDocument = this.storageManager.getNewDocumentAndClearLastUsed();
      this.calendarProvider.injectEvents(newDocument.calendarInputs)
      this.events = newDocument.calendarInputs;      
    }

    if (eventType == 'provideCalendarEventsForSingleDay'){
      let events = this.eventManager.fetchDayEvents(data.year, data.month, data.day, this.events)
      if (typeof(events.entries) != 'function'){
        this.communicator.inform('calendarEventsForDay',
        {events: events.entries, day: data.day, month: data.month, year: data.year})
      } else {
        this.communicator.inform('calendarEventsForDay', null)
      }
      
    }
  }

}
