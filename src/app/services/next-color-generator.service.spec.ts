import { TestBed } from '@angular/core/testing';

import { NextColorGeneratorService } from './next-color-generator.service';

describe('NextColorGeneratorService', () => {
  let service: NextColorGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextColorGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate colors in a proper way', ()=>{
    let serviceInstance = new NextColorGeneratorService();
    let expectedOutputs = [
      `hsl(60, 100%, 80%)`,
      `hsl(120, 100%, 80%)`,
      `hsl(180, 100%, 80%)`,
      `hsl(240, 100%, 80%)`,
      `hsl(300, 100%, 80%)`,
      `hsl(0, 100%, 80%)`,
      `hsl(150, 100%, 80%)`,
      `hsl(30, 100%, 80%)`,
      `hsl(210, 100%, 80%)`,
      `hsl(270, 100%, 80%)`,
      `hsl(330, 100%, 80%)`,

      `hsl(60, 100%, 30%)`,
      `hsl(120, 100%, 30%)`,
      `hsl(180, 100%, 30%)`,
      `hsl(240, 100%, 30%)`,
      `hsl(300, 100%, 30%)`,
      `hsl(0, 100%, 30%)`,
      `hsl(150, 100%, 30%)`,
      `hsl(30, 100%, 30%)`,
      `hsl(210, 100%, 30%)`,
      `hsl(270, 100%, 30%)`,
      `hsl(330, 100%, 30%)`, 

      `hsl(60, 50%, 80%)`,
      `hsl(120, 50%, 80%)`,
      `hsl(180, 50%, 80%)`,
      `hsl(240, 50%, 80%)`,
      `hsl(300, 50%, 80%)`,
      `hsl(0, 50%, 80%)`,
      `hsl(150, 50%, 80%)`,
      `hsl(30, 50%, 80%)`,
      `hsl(210, 50%, 80%)`,
      `hsl(270, 50%, 80%)`,
      `hsl(330, 50%, 80%)`,     


      `hsl(60, 50%, 30%)`,
      `hsl(120, 50%, 30%)`,
      `hsl(180, 50%, 30%)`,
      `hsl(240, 50%, 30%)`,
      `hsl(300, 50%, 30%)`,
      `hsl(0, 50%, 30%)`,
      `hsl(150, 50%, 30%)`,
      `hsl(30, 50%, 30%)`,
      `hsl(210, 50%, 30%)`,
      `hsl(270, 50%, 30%)`,
      `hsl(330, 50%, 30%)`,

      'hsl(60, 0%, 100%)', 
      'hsl(60, 0%, 80%)',

      `hsl(60, 100%, 80%)`,
      `hsl(120, 100%, 80%)`,
      `hsl(180, 100%, 80%)`,
      `hsl(240, 100%, 80%)`,
      `hsl(300, 100%, 80%)`,
      `hsl(0, 100%, 80%)`,
      `hsl(150, 100%, 80%)`,
      `hsl(30, 100%, 80%)`,
      `hsl(210, 100%, 80%)`,
      `hsl(270, 100%, 80%)`,
      `hsl(330, 100%, 80%)`,      
    ]
    for(let expectedOutput of expectedOutputs){
      console.log(expectedOutput)
      expect(serviceInstance.getNextColor()).toBe(expectedOutput);
    }

  })
});
