import { Component, OnInit, Input } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
    console.log(this.dayDescriptor)
  }

}
