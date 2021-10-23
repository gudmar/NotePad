import { Injectable } from '@angular/core';
import { EventManagerService } from './event-manager.service';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { CalendarObjectProviderService } from './calendar-object-provider.service';
import { createWriteStream } from 'fs';

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
    let calculator = new nextCwCalculator(
      this.currentCwIndex, this.currentMonthIndex, this.currentYear, this.calendarProvider
    )
    return calculator.calculateNextCW(offset)
  }

  // calculateNextCW(offset: -1 | 1){
  //   let plannedCW: number = this.currentCwIndex + offset;
  //   let plannedMonth: number = this.currentMonthIndex;
  //   let plannedYear: number = this.currentYear;
  //   let decrease1CWJanuary = offset == -1 && this.currentCwIndex == 1;
  //   let plannedCwDoesNotBelongToCurrentMonth = this.getArrId(this.cwInCurrentMonth, plannedCW) == -1;
  //   let getObjectToReturn = function() {return {cw: plannedCW, month: plannedMonth, year: plannedYear}}
  //   if (decrease1CWJanuary) {
  //     plannedMonth = 11; plannedYear = this.currentYear-1; 
  //     let lastWeekLastDecember = Math.max(...this.calendarProvider.getCWNumbersForMonth(plannedYear,plannedMonth));
  //     plannedCW = lastWeekLastDecember;
  //     return getObjectToReturn();
  //   }
  //   if (plannedCwDoesNotBelongToCurrentMonth) {
  //     let indexOfCurrnetCW = this.getArrId(this.cwInCurrentMonth, this.currentCwIndex);
  //     if (indexOfCurrnetCW == 0) {
  //       plannedMonth--;
  //       if (plannedMonth < 0) {plannedMonth = 11; plannedYear--;}
  //     }
  //     if (indexOfCurrnetCW == this.cwInCurrentMonth.length - 1) {
  //       plannedMonth = plannedMonth+1;
  //       if (plannedMonth > 11) {plannedMonth = 0; plannedYear = plannedYear+1; plannedCW = 1;}//++
  //     }
  //   } else {
  //     return getObjectToReturn();
  //   }
  //   return getObjectToReturn();
  // }

  private getArrId(arr:number[],valueToSearch: number){
    return arr.findIndex((e)=>{return e == valueToSearch})
  }
}


class nextCwCalculator{
  currentCwIndex:number;
  currentMonthIndex:number;
  currentYear:number;
  plannedCW:number;
  plannedMonth:number;
  plannedYear:number;
  constructor(currentCwIndex:number, 
    currentMonthIndex:number, 
    currentYear:number,
    private calendarProvider: CalendarObjectProviderService
  ){
    this.currentCwIndex = currentCwIndex;
    this.currentMonthIndex = currentMonthIndex;
    this.currentYear = currentYear;
    this.plannedCW = currentCwIndex;
    this.plannedMonth = currentMonthIndex;
    this.plannedYear = currentYear;
  }
  
  calculateNextCW(offset: -1 | 1){
    this.plannedCW = this.plannedCW + offset;
    
    if (this.actionIsToDecrease1CWJanuary(offset)) {
      this.plannedMonth = 11; this.plannedYear = this.currentYear-1; 
      let lastWeekOfDecember = Math.max(...this.getCwIndexesForMonth(11,this.plannedYear));
      this.plannedCW = lastWeekOfDecember;
      return this.getPlannedCwData();
    }
    if (this.plannedCwDoesNotBelongToCurrentMonth(this.plannedCW)) {
      if (this.isFirstCwOfCurrentMonth(this.currentCwIndex)) {
        this.plannedMonth = this.plannedMonth - 1;
        if (this.plannedMonth < 0) {this.plannedMonth = 11; this.plannedYear = this.plannedYear - 1;}
      }
      if (this.isLastCwOfCurrentMonth(this.currentCwIndex)) {
        this.plannedMonth = this.plannedMonth + 1;
        if (this.plannedMonth > 11) {this.plannedMonth = 0; this.plannedYear = this.plannedYear+1; this.plannedCW = 1;}
      }
    } else {
      return this.getPlannedCwData();
    }
    return this.getPlannedCwData();
  }

  private getCwIndexesForMonth(month:number, year:number){
    return this.calendarProvider.getCWNumbersForMonth(year,month)
  };

  get cwInCurrentMonth(){return this.getCwIndexesForMonth(this.currentMonthIndex, this.currentYear)}

  private actionIsToDecrease1CWJanuary(offset:-1|1){return offset == -1 && this.currentCwIndex == 1;}
  private plannedCwDoesNotBelongToCurrentMonth(plannedCw:number) {return this.getArrId(this.cwInCurrentMonth, plannedCw) == -1};

  private getPlannedCwData(){return {cw: this.plannedCW, month: this.plannedMonth, year: this.plannedYear}}

  private isFirstCwOfCurrentMonth(cwIndex:number){
    let indexOfCurrnetCW = this.getArrId(this.cwInCurrentMonth, cwIndex);
    return indexOfCurrnetCW == 0;
  }
  private isLastCwOfCurrentMonth(cwIndex:number){
    let indexOfCurrnetCW = this.getArrId(this.cwInCurrentMonth, cwIndex);
    return indexOfCurrnetCW == this.cwInCurrentMonth.length - 1 
  }

  private getArrId(arr:number[],valueToSearch: number){
    return arr.findIndex((e)=>{return e == valueToSearch})
  }
}
