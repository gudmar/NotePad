import { TestBed } from '@angular/core/testing';

import { CalendarObjectProviderService } from './calendar-object-provider.service';

describe('CalendarObjectProviderService', () => {
  let service: CalendarObjectProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarObjectProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct CWs', () => {
    let calendar = new CalendarObjectProviderService();
    let transformToValid = function(m: number):0|1|2|3|4|5|6|7|8|9|10|11{
      return <0|1|2|3|4|5|6|7|8|9|10|11>m;
    }
    let testCases = [
      {input: {year: 2021, month: transformToValid(7), day: 23}, expected: 34},
      {input: {year: 2021, month: transformToValid(11), day: 31}, expected: 52},
      {input: {year: 2022, month: transformToValid(0), day: 1}, expected: 52},
      {input: {year: 2021, month: transformToValid(0), day: 1}, expected: 53},
      {input: {year: 2021, month: transformToValid(0), day: 4}, expected: 1},
      {input: {year: 2021, month: transformToValid(0), day: 3}, expected: 53},
      {input: {year: 2020, month: transformToValid(11), day: 30}, expected: 53},
      {input: {year: 2016, month: transformToValid(11), day: 31}, expected: 52},
      {input: {year: 2017, month: transformToValid(0), day: 1}, expected: 52},
      {input: {year: 2013, month: transformToValid(0), day: 1}, expected: 1},
      {input: {year: 2012, month: transformToValid(11), day: 31}, expected: 1},
      {input: {year: 2022, month: transformToValid(10), day: 1}, expected: 44},
      {input: {year: 2023, month: transformToValid(11), day: 31}, expected: 52},
      {input: {year: 2024, month: transformToValid(0), day: 1}, expected: 1},
      {input: {year: 2024, month: transformToValid(11), day: 29}, expected: 52},
      {input: {year: 2024, month: transformToValid(11), day: 30}, expected: 1},
      {input: {year: 2025, month: transformToValid(0), day: 1}, expected: 1},
    ]
      for (let testCase of testCases){
        expect(calendar.getCW(testCase.input.year, testCase.input.month, testCase.input.day)).toBe(testCase.expected)
      }
  });
  it('should return correct first day of CW', ()=>{
    let calendar = new CalendarObjectProviderService();
    let dateToString = function(date: any){
      return `${date.year}, ${date.month}, ${date.day}`
    }
    let testCases = [
      {input: {year: 2021, cw: 5}, expected: '2021, 1, 1'},
      {input: {year: 2021, cw: 30}, expected: '2021, 6, 26'},
      {input: {year: 2021, cw: 52}, expected: '2021, 11, 27'},
      {input: {year: 2022, cw: 52}, expected: '2022, 11, 26'},
      {input: {year: 2022, cw: 1}, expected: '2022, 0, 3'},
      {input: {year: 2025, cw: 1}, expected: '2024, 11, 30'},
      {input: {year: 2026, cw: 53}, expected: '2026, 11, 28'},
      {input: {year: 2027, cw: 53}, expected: '2027, undefined, -1'},
      {input: {year: 2027, cw: 52}, expected: '2027, 11, 27'},
      {input: {year: 2028, cw: 52}, expected: '2028, 11, 25'},
    ]
    for (let testCase of testCases){
      let calculatedResult = calendar.getDateOfFirstCWDay(testCase.input.year, testCase.input.cw)
      expect(dateToString(calculatedResult)).toBe(testCase.expected)
    }
  });
});

