import { TestBed } from '@angular/core/testing';

import { ColorToRGBService } from './color-to-rgba.service';

describe('ColorToRGBService', () => {
  let service: ColorToRGBService;
  let testedService = new ColorToRGBService();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorToRGBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return porper color descriptors in r g b', () => {
    let testPalette = [
        {input: 'red', output: '255, 0, 0'},
        {input: 'green', output: '0, 128, 0'},
        {input: 'yellow', output: '255, 255, 0'},
        {input: '#ffff00', output: '255, 255, 0'},
        {input: '#faddaf', output: '250, 221, 175'},
        {input: 'hsl(123,22%,32%)', output: '64, 100, 65'},
        {input: 'rgb(123, 123, 231)', output: '123, 123, 231'},
      ]
    let runSingleTestCase = function(testCase: {input: string, output: string}){
      let transformedColor = testedService.transform(testCase.input).join(', ');
      expect(transformedColor).toEqual(testCase.output)
    }
    testPalette.forEach(runSingleTestCase)
  })
});
