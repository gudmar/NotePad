import { Injectable } from '@angular/core';
import { EventManagerService } from './event-manager.service';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { CalendarObjectProviderService } from './calendar-object-provider.service';

@Injectable({
  providedIn: 'root'
})
export class WeekViewHelperService {
  currentCwIndex: number = 0;
  currentMonthIndex: number = 0;
  currentYear : number = 0;
  cwInCurrentMonth: number[] = [];

  constructor(
    private eventManager: EventManagerService,
    private calendarProvider: CalendarObjectProviderService
  ) { }

  configure(currentCwIndex: number, currentMonthIndex: number, currentYear: number, cwInCurrentMonth: number[]){
    this.currentCwIndex = currentCwIndex;
    this.currentMonthIndex = currentMonthIndex;
    this.currentYear = currentYear;
    this.cwInCurrentMonth = cwInCurrentMonth;
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

  calculateNextCW(offset: -1 | 1){
    let plannedCW: number = this.currentCwIndex + offset;
    let plannedMonth: number = this.currentMonthIndex;
    let plannedYear: number = this.currentYear;
    let getObjectToReturn = function() {return {cw: plannedCW, month: plannedMonth, year: plannedYear}}
    if (offset == -1 && this.currentCwIndex == 1) {
      plannedMonth = 11; plannedYear = this.currentYear-1; 
      let lastWeekLastDecember = Math.max(...this.calendarProvider.getCWNumbersForMonth(plannedYear,plannedMonth));
      // let lastWeekLastDecember = weeksLastDecember[weeksLastDecember.length - 1];
      plannedCW = lastWeekLastDecember;
      return getObjectToReturn();
    }
    if (this.getArrId(this.cwInCurrentMonth, plannedCW) == -1) {
      let indexOfCurrnetCW = this.getArrId(this.cwInCurrentMonth, this.currentCwIndex);
      if (indexOfCurrnetCW == 0) {
        plannedMonth--;
        if (plannedMonth < 0) {plannedMonth = 11; plannedYear--;}
      }
      if (indexOfCurrnetCW == this.cwInCurrentMonth.length - 1) {
        plannedMonth++;
        if (plannedMonth > 11) {plannedMonth = 0; plannedYear++; plannedCW = 1;}
      }
    } else {
      return getObjectToReturn();
    }
    return getObjectToReturn();
  }

  // calculateNextCW(offset: -1 | 1){
  //   let plannedCW: number = this.currentCwIndex + offset;
  //   let plannedMonth: number = this.currentMonthIndex;
  //   let plannedYear: number = this.currentYear;
  //   let getObjectToReturn = function() {return {cw: plannedCW, month: plannedMonth, year: plannedYear}}
  //   let doesMonthBelongToYear = function(monthIndex: number){
  //     return (monthIndex < 0 || monthIndex > 11)?false:true
  //   }
  //   if(this.doesCwBelongToCurrnetMonth(plannedCW)) return getObjectToReturn();
  //   debugger
  //   plannedMonth = this.getCorrectedMonthId(plannedCW);
  //   debugger
  //   plannedYear = plannedYear + this.getYearCorrectionOffset(plannedCW);
  //   return getObjectToReturn();

  // }

  // private doesCwBelongToCurrnetMonth(cwIndex: number):boolean{
  //   return this.cwInCurrentMonth.findIndex((element)=>{return element == cwIndex})==-1?false: true;
  // }
  // private getPlannedMonthIndex(plannedCW: number){
  //   if (plannedCW > this.cwInCurrentMonth[this.cwInCurrentMonth.length]) return this.currentMonthIndex+1;
  //   if (this.getArrId(this.cwInCurrentMonth, plannedCW) != -1) return this.currentMonthIndex;

  //   return  (plannedCW > Math.max(...this.cwInCurrentMonth))?this.currentMonthIndex+1:this.currentCwIndex-1;
  // }
  private getArrId(arr:number[],valueToSearch: number){
    return arr.findIndex((e)=>{return e == valueToSearch})
  }
  // private getCorrectedMonthId(plannedCW: number){
  //   let plannedMonthId = this.getPlannedMonthIndex(plannedCW);
  //   debugger;
  //   if (plannedMonthId < 0) return 11;
  //   if (plannedMonthId > 11) return 0;
  //   return plannedMonthId;
  // }

  // private getYearCorrectionOffset(plannedCW: number){
  //   let plannedMonthId = this.getPlannedMonthIndex(plannedCW);
  //   if (plannedMonthId > 11) return 1;
  //   if (plannedMonthId < 0) return -1;
  //   return 0;
  // }
}
