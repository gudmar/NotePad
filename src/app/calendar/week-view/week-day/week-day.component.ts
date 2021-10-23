import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { UniqueIdProviderService } from '../../../services/unique-id-provider.service';

@Component({
  selector: 'week-day',
  templateUrl: './week-day.component.html',
  styleUrls: ['./week-day.component.css']
})
export class WeekDayComponent implements OnInit {
  @Input() dayDescriptor: any;
  get events() {
    if (typeof(this.dayDescriptor.events.entries) == "function") return []
    return this.dayDescriptor.events.entries;
  }
  refreshedEvents:any[] = [];

  get dayName() {return this.dayDescriptor.dayName}
  get date() {
    let day = this.dayDescriptor.dayMonthIndex
    let month = this.dayDescriptor.month + 1;
    let year = this.dayDescriptor.year;
    return `${day}/${month}/${year}`
  }
  uniqueId:string = this.idProvider.getGoodEnoughId();
  get duration() {return this.dayDescriptor.duration}
  constructor(
    private communicator: CommunicationService,
    private idProvider: UniqueIdProviderService,
  ) { 
  }

  isAFunction(val:any){return typeof(val) == 'function'}

  ngOnInit(): void {
  }
  ngOnDestroy():void{
    this.communicator.unsubscribe(this.uniqueId);
  }

  openDayEditWindow(event:any){
    let dataToSend = {
      day: this.dayDescriptor.dayMonthIndex,
      month: this.dayDescriptor.month,
      year: this.dayDescriptor.year,
      cw: 0,
      dayWeekIndex: this.dayDescriptor.dayWeekIndex,
      events: this.events
    }
    this.communicator.inform('eventViewerShouldBeDisplayed', dataToSend);
  }

}
