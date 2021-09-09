import { Injectable } from '@angular/core';
import { filter } from 'minimatch';

@Injectable({
  providedIn: 'root'
})
export class SearchListService {

  constructor() { }

  sortList(list: any[], key: string){
    return list.sort((a:any, b:any)=>{
      if(a[key] < b[key]) return -1;
      if(a[key] > b[key]) return 1;
      return 0;
    })
  }

  filterList(list:any[], key:string, filterValue:string){
    let singleMatch = function(element:any){
      return element[key].toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()) == -1 ? false : true;
    }
    return list.filter(singleMatch)
  }

  getFilteredSortedList(list:any[], key: string, filterValue:string){
    let filtered = this.filterList(list, key, filterValue);
    return this.sortList(filtered, key);
  }
  

}
