import { TestBed } from '@angular/core/testing';

import { FindNoteByIdService } from './find-note-by-id.service';

describe('FindNoteByIdService', () => {
  let service: FindNoteByIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FindNoteByIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should fetch note reference by Id', ()=>{
    let service = new FindNoteByIdService();
    let testCase1 = 
      {
          input: {
            activeSheetId:'1',calendarInputs:[],
            sheets:[
              {'s1':{
                bgColor:'white',originalColor:'white',startPageId:'p2',title:'something',
                pages: [
                  {p1:{bgColor:'white', originalColor:'yellow',title:'t1',
                  notes:[
                    {uniqueId: 'n0', content:'someContent'},{uniqueId: 'n1', content:'someContent'},{uniqueId: 'n2', content:'someContent'},
                    {uniqueId: 'n3', content:'someContent'}, {uniqueId: 'n4', content:'someContent'}
                  ]
                }},
                {p1a:{bgColor:'white', originalColor:'yellow',title:'t1a',
                notes:[
                  {uniqueId: 'n0a', content:'someContent'},{uniqueId: 'n1a', content:'someContent'},{uniqueId: 'n2a', content:'someContent'},
                  {uniqueId: 'n3a', content:'someContent'}, {uniqueId: 'n4a', content:'someContent'}
                ]
              }}
                ]
              }},
              {'s2':{
                bgColor:'white',originalColor:'white',startPageId:'p2',title:'something',
                pages: [
                  {p1:{bgColor:'white', originalColor:'yellow',title:'t1',
                  notes:[
                    {uniqueId: 'n20b', content:'someContent'},{uniqueId: 'n21b', content:'someContent'},{uniqueId: 'n22b', content:'someContent'},
                    {uniqueId: 'n23b', content:'someContent'}, {uniqueId: 'n24b', content:'someContent'}
                  ]
                }},
                {p1b:{bgColor:'white', originalColor:'yellow',title:'t1',
                notes:[
                  {uniqueId: 'n20b', content:'someContent'},{uniqueId: 'n2b1', content:'someContent'},{uniqueId: 'n22b', content:'someContent'},
                  {uniqueId: 'n23b', content:'someContent'}, {uniqueId: 'n24b', content:'someContent'}
                ]
              }}
                ]
              }}
            ]
          },

          expectedOutput: {
            activeSheetId:'1',calendarInputs:[],
            sheets:[
              {'s1':{
                bgColor:'white',originalColor:'white',startPageId:'p2',title:'something',
                pages: [
                  {p1:{bgColor:'white', originalColor:'yellow',title:'t1',
                  notes:[
                    {uniqueId: 'n0', content:'someContent'},{uniqueId: 'n1', content:'someContent'},{uniqueId: 'n2', content:'someContent'},
                    {uniqueId: 'n3', content:'someContent'}, {uniqueId: 'n4', content:'someContent'}
                  ]
                }},
                {p1a:{bgColor:'white', originalColor:'yellow',title:'t1a',
                notes:[
                  {uniqueId: 'n0a', content:'someContent'},{uniqueId: 'n1a', content:'someContent'},{uniqueId: 'n2a', content:'someContent'},
                  {uniqueId: 'n3a', content:'someContent'}, {uniqueId: 'n4a', content:'someContent'}
                ]
              }}
                ]
              }},
              {'s2':{
                bgColor:'white',originalColor:'white',startPageId:'p2',title:'something',
                pages: [
                  {p1:{bgColor:'white', originalColor:'yellow',title:'t1',
                  notes:[
                    {uniqueId: 'n20b', content:'someContent'},{uniqueId: 'n21b', content:'someContent'},{uniqueId: 'n22b', content:'someContent'},
                    {uniqueId: 'n23b', content:'someContent'}, {uniqueId: 'n24b', content:'someContent'}
                  ]
                }},
                {p1b:{bgColor:'white', originalColor:'yellow',title:'t1',
                notes:[
                  {uniqueId: 'n20b', content:'someContent'},{uniqueId: 'n2b1', content:'none'},{uniqueId: 'n22b', content:'someContent'},
                  {uniqueId: 'n23b', content:'someContent'}, {uniqueId: 'n24b', content:'someContent'}
                ]
              }}
                ]
              }}
            ]
          }
        }

      let foundObj:any = service.fetchNoteReferenceById('n2b1', testCase1.input); foundObj!.content='none';
      expect(testCase1.input).toEqual(testCase1.expectedOutput)

      let foundObj2: any = service.fetchNoteReferenceById('notExistingId', testCase1.input); 
      expect(foundObj2).toBe(null)
    
  })


});
