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


});




