import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileOperationsService {

  constructor() { }

  writeToFile(name: string, objectToSave: any){
    let content = JSON.stringify(objectToSave);
    let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    let dummyLink = document.createElement('a');
    dummyLink.href = window.URL.createObjectURL(blob);
    dummyLink.download = name;
    dummyLink.click();
  }

}
