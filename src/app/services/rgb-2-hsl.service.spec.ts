import { TestBed } from '@angular/core/testing';

import { Rgb2HslService } from './rgb-2-hsl.service';

describe('Rgb2HslService', () => {
  let service: Rgb2HslService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rgb2HslService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert colors properly', () => {
    let testedServiceInstance = new Rgb2HslService();
    let testCases = [
        {input: {r: 255, g: 0  , b: 0  }, output: 'hsl(0, 100%, 50%)'},
        {input: {r:   0, g: 128, b: 0  }, output: 'hsl(120, 100%, 25%)'},
        {input: {r:   0, g: 0  , b: 255}, output: 'hsl(240, 100%, 50%)'},
        {input: {r:   0, g: 0  , b: 0  }, output: 'hsl(0, 0%, 0%)'},
        {input: {r:   255, g: 255  , b: 0  }, output: 'hsl(60, 100%, 50%)'},
        {input: {r:   255, g: 255  , b: 255  }, output: 'hsl(0, 0%, 100%)'},
        {input: {r:   255, g:   0  , b: 255  }, output: 'hsl(300, 100%, 50%)'},
        {input: {r:   123, g: 123  , b: 123  }, output: 'hsl(0, 0%, 48%)'},
        {input: {r:   123, g: 23  , b: 223  }, output: 'hsl(270, 81%, 48%)'},
        {input: {r:   123, g: 23  , b: 22  }, output: 'hsl(1, 70%, 28%)'},
        {input: {r:   146, g: 201  , b: 127  }, output: 'hsl(105, 41%, 64%)'},
        {input: {r:    40, g: 120  , b: 120  }, output: 'hsl(180, 50%, 31%)'},
      ]
    let runSingleTestCase = function(testCase: {input: any, output: string}){
      let transformedColor = testedServiceInstance.convertToString(testCase.input.r, testCase.input.g, testCase.input.b);
      expect(transformedColor).toEqual(testCase.output)
    }
    testCases.forEach(runSingleTestCase)
  })
});

