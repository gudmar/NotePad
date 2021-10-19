import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

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
  get dayName() {return this.dayDescriptor.dayName}
  get date() {
    let day = this.dayDescriptor.dayMonthIndex
    let month = this.dayDescriptor.month + 1;
    let year = this.dayDescriptor.year;
    return `${day}/${month}/${year}`
  }
  get duration() {return this.dayDescriptor.duration}
  constructor(private communicator: CommunicationService) { }

  ngOnInit(): void {
    console.log(this.dayDescriptor)
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
