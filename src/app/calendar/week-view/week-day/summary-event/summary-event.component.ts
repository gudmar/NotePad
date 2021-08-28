import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'summary-event',
  templateUrl: './summary-event.component.html',
  styleUrls: ['./summary-event.component.css']
})
export class SummaryEventComponent implements OnInit {
  @Input() event: any;
  get time(){
    return `${this.add0prefix(this.event.hours)}:${this.add0prefix(this.event.minutes)}`
  }
  get duration(){return this.event.duration}
  get summary() {return this.event.summary}
  get description() {return this.event.description}
  constructor() { }

  ngOnInit(): void {
  }

  add0prefix(val: number | string){
    let toConvert = parseInt(val.toString());
    return toConvert < 10?`0${val}`:`${val}`
  }

}
