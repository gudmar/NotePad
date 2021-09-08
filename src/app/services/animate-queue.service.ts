import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimateQueueService {

  constructor() { }

  async animate(...items:{fn:Function, delay:number}[]){
    for (let item of items){
      await this.wait(item.delay);
      item.fn();
    }
  }

  async wait(delay:number){
    return new Promise((resolve, reject)=>{
      let timeout = setTimeout(()=>{resolve(true);clearTimeout(timeout);},delay)
    })
  }

}
