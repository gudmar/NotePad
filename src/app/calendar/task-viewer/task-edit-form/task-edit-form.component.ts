import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'task-edit-form',
  templateUrl: './task-edit-form.component.html',
  styleUrls: ['./task-edit-form.component.css']
})
export class TaskEditFormComponent implements OnInit {
  @Input() task: any;
  @Input() day: number = 1;
  @Input() month: number = 0;
  @Input() year: number = 1000;
  constructor(private communicator: CommunicationService, private validator: ValidatorService,) { 
  }
  closeTaskEditFrom(){
    this.communicator.inform('taskEditFormShouldBeClosed', '');
  }
  ngOnInit(): void {
  }

  setTaskMinutes(event:any){
    let isValid = this.validator.isMinutesValid(event.target.innerText);
    if (isValid) this.task.minutes = parseInt(event.target.innerText);
  }
  setTaskHours(event:any){
    let isValid = this.validator.isHoursValid(event.target.innerText);
    if (isValid) this.task.hours = parseInt(event.target.innerText)
  }
  setTaskDuration(event:any){
    let isValid = this.validator.isDurationValid(event.target.innerText);
    if (isValid) this.task.duration = parseInt(event.target.innerText);
  }
  setTaskSummary(event:any){
    let isValid = this.validator.isSummaryValid(event.target.innerText);
    if (isValid) this.task.summary = event.target.innerText;
  }

  add0prefix(value: number){
    return value < 10 ? `0${value}`:`${value}`
  }

}
