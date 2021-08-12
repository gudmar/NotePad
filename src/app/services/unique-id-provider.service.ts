import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniqueIdProviderService {

  constructor() { }

  getUniqueId(): string{
    return Math.random() + '';
  }
}
