import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service'

@Component({
  selector: 'waiting-spinner',
  templateUrl: './waiting-spinner.component.html',
  styleUrls: ['./waiting-spinner.component.css']
})
export class WaitingSpinnerComponent implements OnInit {
  uniqueId = "spinnerId"
  shouldBeDisplayed: boolean = false;
  constructor(
    private communicator: CommunicationService,
  ) { }

  ngOnInit(): void {
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['show/hideSpinner'])
  }

  handleMessages(eventType: String, data: any){
    this.shouldBeDisplayed = data;
  }

}
