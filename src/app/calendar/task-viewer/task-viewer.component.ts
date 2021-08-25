import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service'

@Component({
  selector: 'task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.css']
})
export class TaskViewerComponent implements OnInit {
  uniqueId: string = 'taskViewerId'
  @Input() day: number = 0;
  @Input() month: number = 0;
  @Input() year: number = 0;
  @Input() cw: number = 0;
  @Input() events: any[] = [];
  @Input() shouldBeDisplayed: boolean = true;
  get entries() {return this.events}
  get currentDate() {
    return `${this.day}/${this.month}/${this.year} CW: ${this.cw}`
  }
  constructor(private communicator: CommunicationService) { 
    communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['eventViewerShouldBeDisplayed'])
  }

  handleMessages(eventType: string, data: any){
    this.day = data.day;
    this.month = data.month;
    this.year = data.year;
    this.cw = data.cw;
    this.events = data.events;
    this.shouldBeDisplayed = true;
  }

  ngOnInit(): void {
  }

  close(){
    this.shouldBeDisplayed = false;
  }

}
