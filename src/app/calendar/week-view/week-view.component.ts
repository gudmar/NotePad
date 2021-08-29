import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { EventManagerService } from '../services/event-manager.service';
import { ConcatSource } from 'webpack-sources';
import { NgModule } from '@angular/compiler/src/core';
import { WeekViewHelperService } from '../services/week-view-helper.service';

@Component({
  selector: 'week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnInit {
  @Input() calendarObjectWithEvents: any;
  shouldBeDisplayed: boolean = false;
  currentMonthIndex: number = 0;
  currentYear: number = 0;
  currentCwIndex: number = 0;
  uniqueId: string = 'week-view-id';
  get cwInCurrentMonth() {
    let weekObjects: any = this.helper.getMonthOutOfCalendar(this.calendarObjectWithEvents, this.currentMonthIndex);
    let weeks: any[] = [];
    debugger
    for (let week of weekObjects) { weeks.push(week.cwIndex)}
    return weeks;
  }
  get daysOfCurrnetCw(){
    return this.helper.getCwOutOfCalendar(this.calendarObjectWithEvents, this.currentMonthIndex, this.currentCwIndex).days
  }
  constructor(
    private communicator: CommunicationService,
    private eventManager: EventManagerService,
    private helper: WeekViewHelperService
  ) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['displayWeekView'])
  }

  configureHelper() {
    this.helper.configure(this.currentCwIndex, this.currentMonthIndex, this.currentYear,this.cwInCurrentMonth)
  }

  handleMessages(eventType: string, data: any){
    if (eventType = "displayWeekView"){
      this.currentCwIndex = data.cwIndex;
      this.currentMonthIndex = data.monthIndex;
      this.shouldBeDisplayed = true;
      this.currentYear = data.currentYear;
    }
  }

  ngOnInit(): void {
  }

  close(){
    this.shouldBeDisplayed = false;
  }

  switchToAnotherCw(offset: -1 | 1){
    this.configureHelper();
    let newDate = this.helper.calculateNextCW(offset)
    this.currentCwIndex = newDate.cw;
    this.currentMonthIndex = newDate.cw;
    this.currentYear = newDate.year;
  }
}
