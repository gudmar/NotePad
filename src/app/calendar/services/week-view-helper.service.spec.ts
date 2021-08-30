import { TestBed } from '@angular/core/testing';
import { EventManagerService } from './event-manager.service';

import { WeekViewHelperService } from './week-view-helper.service';
import { CalendarObjectProviderService } from './calendar-object-provider.service';

describe('WeekViewHelperService', () => {
  let service: WeekViewHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventManagerService, CalendarObjectProviderService]
    });
    service = TestBed.inject(WeekViewHelperService);
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
  it('should calcualte next cw next year and next month properly', () => {
    let eventManager = new EventManagerService()
    let calendar = new CalendarObjectProviderService(eventManager);
    let helper = new WeekViewHelperService(eventManager, calendar);
    let testCases = [
      {
        config:{currentCwIndex: 2, currentMonthIndex: 0, currentYear: 2021, cwInCurrentMonth: [53, 1, 2, 3, 4]},
        offset: 1,
        expectedOutput: {cw: 3, month: 0, year: 2021}
      },
      {
        config:{currentCwIndex: 2, currentMonthIndex: 0, currentYear: 2021, cwInCurrentMonth: [53, 1, 2, 3, 4]},
        offset: -1,
        expectedOutput: {cw: 1, month: 0, year: 2021}
      },
      {
        config:{currentCwIndex: 8, currentMonthIndex: 1, currentYear: 2021, cwInCurrentMonth: [5, 6, 7, 8]},
        offset: 1,
        expectedOutput: {cw: 9, month: 2, year: 2021}
      },
      {
        config:{currentCwIndex: 9, currentMonthIndex: 2, currentYear: 2021, cwInCurrentMonth: [9, 10, 11, 12, 13]},
        offset: -1,
        expectedOutput: {cw: 8, month: 1, year: 2021}
      },
      {
        config:{currentCwIndex: 52, currentMonthIndex: 11, currentYear: 2021, cwInCurrentMonth: [48, 49, 50, 51, 52]},
        offset: 1,
        expectedOutput: {cw: 1, month: 0, year: 2022}
      },
      {
        config:{currentCwIndex: 4, currentMonthIndex: 0, currentYear: 2021, cwInCurrentMonth: [53, 1, 2, 3, 4]},
        offset: 1,
        expectedOutput: {cw: 5, month: 1, year: 2021}
      },
      {
        config:{currentCwIndex: 1, currentMonthIndex: 0, currentYear: 2021, cwInCurrentMonth: [53, 1, 2, 3, 4]},
        offset: -1,
        expectedOutput: {cw: 53, month: 11, year: 2020}
      },
      {
        config:{currentCwIndex: 1, currentMonthIndex: 0, currentYear: 2020, cwInCurrentMonth: [ 1, 2, 3, 4, 5]},
        offset: -1,
        expectedOutput: {cw: 52, month: 11, year: 2019}
      },
      {
        config:{currentCwIndex: 52, currentMonthIndex:11, currentYear: 2021, cwInCurrentMonth: [ 48, 49, 50, 51, 52]},
        offset: 1,
        expectedOutput: {cw: 1, month: 0, year: 2022}
      },
      {
        config:{currentCwIndex: 53, currentMonthIndex:11, currentYear: 2020, cwInCurrentMonth: [ 49, 50, 51, 52, 53]},
        offset: 1,
        expectedOutput: {cw: 1, month: 0, year: 2021}
      }
    ]
    for(let tc of testCases){
      helper.configure(
        tc.config.currentCwIndex, tc.config.currentMonthIndex, tc.config.currentYear,tc.config.cwInCurrentMonth
      );
      let output = helper.calculateNextCW(<-1 | 1>tc.offset)
      expect(output).toEqual(tc.expectedOutput)
    }
  })
  // this.currentCwIndex = currentCwIndex;
  // this.currentMonthIndex = currentMonthIndex;
  // this.currentYear = currentYear;
  // this.cwInCurrentMonth = cwInCurrentMonth;
});
