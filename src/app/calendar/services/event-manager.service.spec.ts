import { TestBed } from '@angular/core/testing';

import { EventManagerService } from './event-manager.service';

describe('EventManagerService', () => {
  let service: EventManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find element in entries', () => {
    let manager = new EventManagerService();
    let testData = {
          name: 'year',
          entries: [
            {month: 0, entries: [1, 2, 3, 4]},
            {month: 1, entries: [5, 6, 7, 8]},
            {month: 2, entries: ['a', 'b', 'c', 'd']},
            {month: 3, entries: ['e', 'f', 'g', 'h']},
            {month: 4, entries: ['i', 'j', 'k', 'l']},
          ]
        }

    let foundElement1 = manager.fetchFromCallendarArray('month',testData.entries,2);
    let foundElement2 = manager.fetchFromCallendarArray('month',testData.entries,0);
    let foundElement4 = manager.fetchFromCallendarArray('month',testData.entries,4);
    expect(foundElement1.entries).toEqual(['a', 'b', 'c', 'd'])
    expect(foundElement2.entries).toEqual([1, 2, 3, 4])
    expect(foundElement4.entries).toEqual(['i', 'j', 'k', 'l'])
  })
});

it('should find day events', () => {
  let manager = new EventManagerService();
  let calendarEvents = [
    {year: 2021, entries: [
      {month: 0, entries: [
        {day: 1, entries: [1, 2, 3, 4, 5]},
        {day: 2, entries: [6, 7, 8, 9, 0]},
        {day: 3, entries: ['a', 'b', 'c', 'd', 'e']},
        {day: 4, entries: ['f', 'g', 'h', 'i', 'j']},
        {day: 7, entries: ['k', 'l', 'h', 'i', 'm']},
      ]},
      {month: 2, entries: [
        {day: 3, entries: [1, 2, 2, 5, 5]},
        {day: 4, entries: [6, 6, 8, 9, 0]},
        {day: 5, entries:  ['z', 'x', 'c', 'v', 'b']},
        {day: 6, entries:  ['/', '.', ',', 'm', 'n']},
        {day: 10, entries: ['q', 'w', 'e', 'r', 't']},
      ]},
      {month: 3, entries: [
        {day: 4, entries: [4, 5, 3, 5, 5]},
        {day: 5, entries: [6, 2, 8, 2, 0]},
        {day: 6, entries:  ['p', 'o', 'i', 'u', 'y']},
        {day: 7, entries:  ['/', 'w', 'e', 'r', 't']},
        {day: 11, entries: ['@', '#', '$', 'r', 't']},
      ]}
    ]},
    {year: 2022, entries: [
      {month: 4, entries: [
        {day: 11, entries: [1, '2', '3', '4', '5']},
        {day: 12, entries: [6, '7', '8', '9', '0']},
        {day: 13, entries: ['g', 'b', 'z', 'd', 'e']},
        {day: 14, entries: ['g', 'g', 'z', 'i', 'j']},
        {day: 17, entries: ['g', 'l', 'z', 'i', 'm']},
      ]},
      {month: 5, entries: [
        {day: 13, entries:  ['1', '2', 2, 5, 5]},
        {day: 14, entries:  ['6', '6', 8, 9, 0]},
        {day: 15, entries:  ['z', '%', 'c', 'v', 'b']},
        {day: 16, entries:  ['/', '%', ',', 'm', 'n']},
        {day: 17, entries:  ['q', '%', 'e', 'r', 't']},
      ]},
      {month: 6, entries: [
        {day: 24, entries:  [1, 5, 3, 5, 0]},
        {day: 25, entries:  [1, 2, 3, 2, 0]},
        {day: 26, entries:  ['p', 'o', '8', '9', 'y']},
        {day: 27, entries:  ['/', 'w', '8', '9', 't']},
        {day: 28, entries:  ['@', '#', '8', '9', 't']},
      ]}
    ]},
    {year: 2023, entries: [
      {month: 7, entries: [
        {day: 10, entries: [1, '2', '23', '4', '5']},
        {day: 14, entries: [6, '7', '28', '9', '0']},
        {day: 15, entries: ['1g', '1b', 'z', 'd', 'e']},
        {day: 17, entries: ['1g', '1g', 'z', 'i', 'j']},
        {day: 18, entries: ['1g', '1l', 'z', 'i', 'm']},
      ]},
      {month: 8, entries: [
        {day: 23, entries:  ['1Z', '92', 2, 5, 5]},
        {day: 24, entries:  ['6Z', '96', 8, 9, 0]},
        {day: 25, entries:  ['zZ', '9%', 'c', 'v', 'b']},
        {day: 26, entries:  ['/Z', '9%', ',', 'm', 'n']},
        {day: 27, entries:  ['qZ', '9%', 'e', 'r', 't']},
      ]},
      {month: 9, entries: [
        {day: 14, entries:  ['SDF1', 5, 3, 5, 0]},
        {day: 15, entries:  ['SDF1', 2, 3, 2, 0]},
        {day: 16, entries:  ['SDFp', 'o', '8', '9', 'y']},
        {day: 17, entries:  ['SDF/', 'w', '8', '9', 't']},
        {day: 18, entries:  ['SDF@', '#', '8', '9', 't']},
      ]}
    ]}
  ]

  let foundElement1 = manager.fetchDayEvents(2023, 9, 17, calendarEvents);
  let foundElement2 = manager.fetchDayEvents(2021, 0, 1, calendarEvents);
  expect(foundElement1.entries).toEqual(['SDF/', 'w', '8', '9', 't']);
  expect(foundElement2.entries).toEqual([1, 2, 3, 4, 5]);
});
