import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { EventManagerService } from '../services/event-manager.service';
import { ConcatSource } from 'webpack-sources';

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
    let weekObjects: any = this.getMonthOutOfCalendar(this.calendarObjectWithEvents, this.currentMonthIndex);
    let weeks: any[] = [];
    for (let week of weekObjects) { weeks.push(week.cwIndex)}
    return weeks;
  }
  get daysOfCurrnetCw(){
    return this.getCwOutOfCalendar(this.calendarObjectWithEvents, this.currentMonthIndex, this.currentCwIndex).days
  }
  constructor(
    private communicator: CommunicationService,
    private eventManager: EventManagerService
  ) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['displayWeekView'])
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

  getMonthOutOfCalendar(calendarObj: any, monthIndex: number){
    let indexOfFoundElement: number = this.eventManager.getIndexOfElemetnInArray(calendarObj, 'monthIndex', monthIndex);
    return calendarObj[indexOfFoundElement]
  }

  getCwOutOfCalendar(calendarObj: any, monthIndex: number, cwIndex: number){
    let monthObj: any = this.getMonthOutOfCalendar(calendarObj, monthIndex);
    let weeks = monthObj.weeks;
    let indexOfFoundElement = this.eventManager.getIndexOfElemetnInArray(weeks, 'cwIndex', cwIndex);
    return weeks[indexOfFoundElement]
  }

  switchToAnotherCw(offset: number){
    // let plannedCwIndex = this.currentCwIndex + offset;
    // if (this.doesCwBelongToCurrnetMonth(plannedCwIndex)) {
    //   this.currentCwIndex = plannedCwIndex;
    //   return true;
    // }
    // let planndedMonthIndex = 
    //   (plannedCwIndex > Math.max(...this.cwInCurrentMonth))?this.currentMonthIndex+1:this.currentCwIndex-1;
    // if (this.doesPlannedCwBelongToCurrentYear(plannedCwIndex, planndedMonthIndex)) {
    //   this.currentCwIndex = plannedCwIndex;
    //   this.currentMonthIndex = planndedMonthIndex;
    //   return false;
    // }
    // console.warn('Switching to next year needs implementation'); return false;
  }

  doesCwBelongToCurrnetMonth(cwIndex: number):boolean{
    return this.cwInCurrentMonth.findIndex((element)=>{return element == cwIndex})==-1?false: true;
  }
  doesPlannedCwBelongToCurrentYear(cwIndex:number, monthIndex: number){
    // if (monthIndex < 11 && monthIndex > 0) return true;
    // if (cwIndex == 1) return false;
  }

}
