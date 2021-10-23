import { Component, OnInit, Input, HostListener } from '@angular/core';
import { CommunicationService } from '../../services/communication.service'
import { CalendarObjectProviderService } from '../services/calendar-object-provider.service'
import { UniqueIdProviderService } from '../../services/unique-id-provider.service';
import { EventManagerService } from '../services/event-manager.service';
import { WindowSizeEvaluatorService } from '../../services/window-size-evaluator.service'
import { ValidatorService } from '../services/validator.service';
import { Add0prefixPipe } from '../../pipes/add0prefix.pipe'

@Component({
  selector: 'task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css', './task-viewer-forMobile.component.css']
})
export class TaskViewerComponent implements OnInit {
  private _shouldMoveWindowBeVisible: boolean = false;
  dayWeekIndex: number = 0;
  uniqueId: string = 'taskViewerId'
  allCalendarEvents: any;
  get shouldDisplayMobileVersion() {return this.windowSizeEvaluator.isWindowTooNarrow(750)}
  @Input() day: number = 0;
  @Input() month: number = 0;
  @Input() year: number = 0;
  @Input() cw: number = 0;
  @Input() events: any[] = [];
  shouldBeDisplayed: boolean = false;
  set shouldMoveWindowBeVisible(val: boolean) {
    this._shouldMoveWindowBeVisible = val;
    if (val == false) this.eventToMoveId = '';
  }
  get shouldMoveWindowBeVisible() {return this._shouldMoveWindowBeVisible}
  eventToMoveId: string = '';
  private indexOfTaskToShowInForm: number = 0;
  shouldShowEditFrom: boolean = false;
  get formTask() {return this.events[this.indexOfTaskToShowInForm]}

  openMoveWindow(uniqueId: string) {
    this.eventToMoveId = uniqueId;
    this.shouldMoveWindowBeVisible = true;
  }
  showEditForm(index: number){
    this.shouldShowEditFrom = true;
    this.indexOfTaskToShowInForm = index;
  }

  get entries() {return this.events}
  get dayAsString() {return this.calendarProvider.getDayName(this.dayWeekIndex)}
  get currentDate() {
    return `${this.day} / ${this.month} / ${this.year} CW: ${this.cw}`
  }
  
  constructor(
    private communicator: CommunicationService,
    private eventManager: EventManagerService,
    private calendarProvider: CalendarObjectProviderService,
    private uuidProvider: UniqueIdProviderService,
    private windowSizeEvaluator: WindowSizeEvaluatorService,
    private validator: ValidatorService,
  ) { 
    communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), 
    ['eventViewerShouldBeDisplayed', 'calendarEvents', 'taskEditFormShouldBeClosed'])
  }


  setTaskMinutes(event:any, uniqueId: string){
    this.modifyIfValid(uniqueId, 'minutes', event.target.innerText, 
    this.validator.isMinutesValid.bind(this.validator,event.target.innerText)
  )}
  setTaskHours(event:any, uniqueId: string, entry:any){
    this.modifyIfValid(uniqueId, 'hours', event.target.innerText, 
    this.validator.isHoursValid.bind(this.validator,event.target.innerText)    
  );
}
  setTaskDuration(event:any, uniqueId: string){
    this.modifyIfValid(uniqueId, 'duration', event.target.innerText, 
    this.validator.isDurationValid.bind(this.validator,event.target.innerText)
  )}

  lastSummary: string = '';

  setLastTaskSummary(event:any){
    let isValid = this.validator.isSummaryValid(event.target.innerText);
    if (isValid) this.lastSummary = event.target.innerText;
    else event.target.innerText = this.lastSummary;
  }

  keepLastSummary(event:any){

  }
  setTaskSummary(event:any, uniqueId: string){
    this.modifyIfValid(uniqueId, 'summary', this.lastSummary,
    this.validator.isSummaryValid.bind(this.validator,event.target.innerText, 50)
  )
  }

  setTaskDescription(event: any, uniqueId: string){
    this.modifyIfValid(uniqueId, 'description', event.target.innerText, ()=>{return true;})
  }

  // add0prefix(n: number){
  //   return parseInt(n.toString()) < 10 ? `0${parseInt(n.toString())}` : n;
  // }

  handleMessages(eventType: string, data: any){
    if (eventType == 'calendarEvents') {
      this.allCalendarEvents = data;
    }
    if (eventType == 'eventViewerShouldBeDisplayed'){
      this.day = data.day;
      this.month = data.month;
      this.year = data.year;
      this.cw = data.cw;
      this.dayWeekIndex = data.dayWeekIndex,
      this.events = data.events;
      this.shouldBeDisplayed = true;
    }
    if (eventType == 'taskEditFormShouldBeClosed'){
      this.shouldShowEditFrom = false;
    }
  }

  switchToAnotherDay(offset: -1 | 1){
    let nextDate:any;
    if (offset == 1) nextDate = this.calendarProvider.getNextDay({year: this.year, month: this.month, day: this.day});
    if (offset == -1) nextDate = this.calendarProvider.getPreviousDay({year: this.year, month: this.month, day: this.day});
    if (this.year == nextDate.year){
      this.communicator.inform('switchTaskViewerToNextDayOfTheSameYear', nextDate);
    } else {
      this.communicator.inform('switchTaskViewerToNextDayDifferentYear', nextDate);
    }
    this.shouldMoveWindowBeVisible = false;
  }

  ngOnInit(): void {
    this.communicator.inform('provideCalendarEvents', '')
  }

  close(){
    this.shouldBeDisplayed = false;
    this.shouldMoveWindowBeVisible = false;
  }

  addEventAfter(event: any, uniqueId: string){
    let eventToAddAfterIndex = this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId);
    this.events.splice(eventToAddAfterIndex, 0, {
      hours: 0, minutes: 0, duration: 0, summary: '', description: '', uniqueId: this.uuidProvider.getUniqueId()
    })
    this.informWeekViewToRerender()
  }

  informWeekViewToRerender(){
    this.communicator.inform('weekViewShouldRerender', null)
  }

  removeEvent(event:any, uniqueId: string){
    let eventToBeRemovedIndex = this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId);
    this.events.splice(eventToBeRemovedIndex, 1);
  }
  
  modifyIfValid(uniqueId: string, key: string, newValue: any, conditionFunction: Function){
    let isValid = conditionFunction(newValue);
    if (isValid) this.modifyEvent(uniqueId, key, newValue);
    return isValid
  }
  modifyEvent(uniqueId: string, key: string, newValue: any){
    let objectToModify: any = this.events[this.getIndexOfElemetnInArray(this.events, 'uniqueId', uniqueId)]
    objectToModify[key] = newValue;
  }

  getIndexOfElemetnInArray(array: any[], matchKey: string, value: any){
    let singleMatch = function(element: any) { return element[matchKey] == value; }
    return array.findIndex(singleMatch);
  }

  addFirstTask(){
    let executionStatus = this.eventManager.addFirstTask(
      {day: this.day, month: this.month, year: this.year}, 
      this.allCalendarEvents, 
      this.uuidProvider.getUniqueId()
  )
    this.events = this.eventManager.fetchDayEvents(this.year, this.month, this.day, this.allCalendarEvents).entries
    this.infromComponentsAboutChange(executionStatus);
    this.informWeekViewToRerender();
  }

  infromComponentsAboutChange(whatObjecsWereAdded: any){
    if (whatObjecsWereAdded.newDayWasCreated) this.informDayComponentsAboutChange();
  }

  informDayComponentsAboutChange(){
    this.communicator.inform('eventWasMovedAndDayWasCreated', {day: this.day, month: this.month})
  }
  informMonthComponentsAboutChange(){
    this.communicator.inform('eventWasMovedAndMonthWasCreated', {month: this.month})
  }
  

}
