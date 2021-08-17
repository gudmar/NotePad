import { TestBed } from '@angular/core/testing';

import { UniqueIdProviderService } from './unique-id-provider.service';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';

describe('UniqueIdProviderService', () => {
  let service: UniqueIdProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniqueIdProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create 1 000 000 unique ids', ()=>{
    let idGeneratorInstance = new UniqueIdProviderService();
    let uniqueIds:string[] = [];
    let generateSingleId = function(){
      return (idGeneratorInstance.getUniqueId())
    }
    let checkIfGeneratedIdIsUnique = function(id: string){
      return uniqueIds.find((element) => {return element == id}) ? false : true
    }
    for (let iteration = 0; iteration++; iteration < 1000000){
      let tempId = generateSingleId();
      let isUnique = checkIfGeneratedIdIsUnique(tempId);
      if (isUnique) uniqueIds.push(tempId)
      expect(isUnique).toBe(true)
    }
  })
});
