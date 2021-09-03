import { TestBed } from '@angular/core/testing';

import { DocumentValidatorService } from './document-validator.service';

describe('DocumentValidatorService', () => {
  let service: DocumentValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute [objectShouldContainKeys] properly',()=>{
    let service = new DocumentValidatorService();
    let testCases = [
      {
        object: {key1: 'value', key2: 'value 2', key3: 'value 3'}, 
        keyList: ['key1', 'key2', 'key3'],
        expectedResult: true
      },
      {
        object: {key1: 'value', key2: 'value 2', key3: 'value 3'}, 
        keyList: ['key1', 'key2'],
        expectedResult: true
      },
      {
        object: {key1: 'value', key2: 'value 2', key3: 'value 3'}, 
        keyList: [],
        expectedResult: true
      },
      {
        object: {key1: 'value', key2: 'value 2'}, 
        keyList: ['key1', 'key2', 'key3'],
        expectedResult: false
      },
      {
        object: {key1: 'value', key2: 'value 2', key3: 'value 3'}, 
        keyList: ['key1', 'key4', 'key3'],
        expectedResult: false
      },
      {
        object: {key1: 'value', key2: 'value 2', key3: 'value 3'}, 
        keyList: ['key2', 'key1', 'key3'],
        expectedResult: true
      },
    ]
    for (let tc of testCases){
      let calculated = service.objectShouldContainKeys(tc.object, tc.keyList);
      expect(calculated).toBe(tc.expectedResult);
    }
  })

  it('should execute [keyValueShouldBeTypeOf] correctly', ()=>{
    let service = new DocumentValidatorService();
    let testCases = [
      {
        input: {
          object: { k1: 'string', k2: [], k3: {}, k4: () => { }, k5: 5 },
          key: 'k1',
          desiredValue: 'string',
        },
        output: true
      },
      {
        input: {
          object: { k1: 'string', k2: [], k3: {}, k4: () => { }, k5: 5 },
          key: 'k2',
          desiredValue: 'object',
        },
        output: true
      },
      {
        input: {
          object: { k1: 'string', k2: [], k3: {}, k4: () => { }, k5: 5 },
          key: 'k4',
          desiredValue: 'function',
        },
        output: true
      },
      {
        input: {
          object: { k1: 'string', k2: [], k3: {}, k4: () => { }, k5: 5 },
          key: 'k1',
          desiredValue: 'undefined',
        },
        output: false
      },
    ]
    for (let tc of testCases){
      let calculated = service.keyValueShouldBeTypeOf(tc.input.object, tc.input.key, tc.input.desiredValue)
      expect(calculated).toBe(tc.output)
    }
  })

  it('should execute [eachArrayElementShouldContainKeys] correctly', ()=>{
    let service = new DocumentValidatorService();
    let testCases = [
      {
        input: {
            arr: [{k1:4, k2: 3, k4: 5}, {k1:4, k2: 3, k4: 5}, {k1:4, k2: 3, k4: 5}],
            keys: ['k1', 'k2', 'k4']
          },
        expectedOutput: true  
      },
      {
        input: {
            arr: [{k1:4, k2: 3, k4: 5}, {k1:4, k2: 3, k4: 5, k6: 5, k7: 6, k8: 3}, {k1:4, k2: 3, k4: 5}],
            keys: ['k1', 'k2', 'k4']
          },
        expectedOutput: true  
      },
      {
        input: {
            arr: [{k1:4, k2: 3, k4: 5}, {k1:4, k2: 3, k5: 5}, {k1:4, k2: 3, k4: 5}],
            keys: ['k1', 'k2', 'k4']
          },
        expectedOutput: false
      }
    ]
    for (let tc of testCases){
      let calculated = service.eachArrayElementShouldContainKeys(tc.input.arr, tc.input.keys)
      expect(calculated).toBe(tc.expectedOutput)
    }
  })

  it('should execute [objectShouldNotContainKeysOtherThen] correctly', ()=>{
    let service = new DocumentValidatorService();
    let testCases = [
      {
        input: {
          obj: {k1: 1, k2: 2, k3: 3},
          keys: ['k1', 'k3', 'k2']
        },
        expectedOutput: true
      },
      {
        input: {
          obj: {k1: 1, k2: 2, k3: 3, k4: 4},
          keys: ['k1', 'k3', 'k2']
        },
        expectedOutput: false
      },
      {
        input: {
          obj: {k1: 1, k2: 2, k3: 3, k4: 4},
          keys: ['k1', 'k3', 'k2', 'k4', 'k5', 'k6', 'k7', 'k8']
        },
        expectedOutput: true
      },
    ]
    for (let tc of testCases){
      let calculated = service.objectShouldNotContainKeysOtherThen(tc.input.obj, tc.input.keys)
      expect(calculated).toBe(tc.expectedOutput)
    }
  })

  it('shuld validate day entry correctly', () => {
    let service = new DocumentValidatorService();
    let testCases:any = [
      {
       input: 
        [{hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'}],
       output: true
      },
      {
        input: 
         [
           {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
           {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'}
          ],
        output: true
       },
      {
        input: 
         [
           {hours: 10, minutes: 12, duration: '120', summary:'short text', description:'long text', uniqueId:'1'},
           {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'}
          ],
        output: false
       },
       {
         input: 
          [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, type: 'note', summary:'short text', description:'long text', uniqueId:'2'}
           ],
         output: false
        },
        {
          input: 
           [
             {hours: 10, minutes: 12, summary:'short text', description:'long text', uniqueId:'1'},
             {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'}
            ],
          output: false
         }
 
    ]
    for (let tc of testCases){
      let calculated = service.validateCalendarDayEntries(tc.input)
      expect(calculated).toBe(tc.output)
    }

  })

  it('should validate month correctly', ()=>{
    let service = new DocumentValidatorService();
    let tcObject1 = {
      calendarInputs: [
        {
          day: 1,
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ] 
        },
        {
          day: 2,
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ]                     
        }
      ]       
    }
    let tcObject2 = {
      calendarInputs: [
        {
          day: 1,
          weather: 'sunny',
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ] 
        },
        {
          day: 2,
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ]                     
        }
      ]       
    };
    let tcObject3 = {
      calendarInputs: [
        {
          day: 1,
        },
        {
          day: 2,
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ]                     
        }
      ]       
    }
    let tcObject4 = {
      calendarInputs: [
        {
        },
        {
          day: 2,
          entries: [
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
            {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
          ]                     
        }
      ]       
    }
    let testCases = [
      {input: tcObject1, expectedOutput: true},
      {input: tcObject2, expectedOutput: false},
      {input: tcObject3, expectedOutput: true},
      {input: tcObject4, expectedOutput: false},
    ]
    for (let tc of testCases){
      let calculated = service.validateCalendarMonthEntry(tc.input.calendarInputs)
      expect(calculated).toBe(tc.expectedOutput)
    }
  })

  it('should validate calendar correctly', ()=>{
    let service = new DocumentValidatorService();
    let tcObject1 = {
      calendarInputs: [
        {
          year: 2021,
          entries: [
            [
              {
                month:  0, 
                entries: [
                  {
                    day: 1,
                    entries: [
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
                   ] 
                  },
                  {
                    day: 2,
                    entries: [
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'3'},
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'4'},
                   ]                     
                  }
                ]
              },
            ]
          ]
        },
        {
          year: 2022
        }
      ]
    }

    let tcObject2 = {
      calendarInputs: [
        {
          year: 2021,
          entries: [
            [
              {
                month:  0, 
                entries: [
                  {
                    day: 1,
                    entries: [
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'1'},
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
                   ] 
                  },
                  {
                    day: 2,
                    entries: [
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'2'},
                      {hours: 10, minutes: 12, duration: 120, summary:'short text', description:'long text', uniqueId:'4'},
                   ]                     
                  }
                ]
              },
            ]
          ]
        },
        {
          year: 2022
        }
      ]
    }


    let testCases = [
      {input: tcObject1, expectedOutput: true},
      {input: {calendarInputs:[]}, expectedOutput: true},
      {input: tcObject2, expectedOutput: false},
    ]
    for (let tc of testCases){
      let calculated = service.isCalendarValid(tc.input.calendarInputs)
      expect(calculated).toBe(tc.expectedOutput)
    }
  })

  it('Should [getArrayOfAllPropertyOccurenceInGetericObject_nested] get all nested properties from object', ()=>{
    let service = new DocumentValidatorService();
    let testCases = [
      {
        input: {
          obj: {
            a: 'sd', b: 'we', id: 'ee', 
            s: [
              {a: 'ss', b: 'ww', d: 'ww', id: '3e'},
              {a: '2s', b: '6w', d: '3w', id: '33'},
              {a: '3s', b: '5w', d: '4w', id: '34'},
              {a: '4s', b: '4w', d: '5w', id: '35'},
              [
                {d: 'e', id: 'eee'},
                {d: 'se', id: 'ede'},
                3, 3, 4, {}, []
              ]
            ],
            fs: {a: '4s', b: '4w', d: '5w', id: 'y5'}
          },
          queriedKey: 'id'
        },
        expectedOutput: ['ee', '3e', '33', '34', '35', 'eee', 'ede', 'y5']},
      
    ]
    for (let tc of testCases){
      let calculated = service.getArrayOfAllPropertyOccurenceInGetericObject_nested(tc.input.obj, tc.input.queriedKey)
      expect(calculated).toEqual(tc.expectedOutput)
    }
  })

  it('Should [hasStringArrayRepetingValues] detect repeting values in array', () => {
    let service = new DocumentValidatorService();
    let testCases = [
      {inputArr: ['1', '2', '3', '4'], output: false},
      {inputArr: ['1', '2', '4', '4'], output: true}
    ]
    for (let tc of testCases){
      let calculated = service.hasStringArrayRepetingValues(tc.inputArr);
      expect(calculated).toBe(tc.output)
    }
  } )

});




