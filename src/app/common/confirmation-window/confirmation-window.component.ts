import { Component, OnInit, Input } from '@angular/core';
import { CommunicationService } from '../../services/communication.service'

@Component({
  selector: 'confirmation-window',
  templateUrl: './confirmation-window.component.html',
  styleUrls: ['./confirmation-window.component.css']
})
export class ConfirmationWindowComponent implements OnInit {
  confirmationWindowIsVisible: boolean = false;
  @Input() uniqueId: string = '';
  @Input() message: string  = '';
  @Input() listenToMessages: string[] = [];
  incommingMessageData: any = null;
  constructor(private messenger: CommunicationService) { }

  ngOnInit(): void {
    this.messenger.subscribe(this.uniqueId, this.handleMessages.bind(this), ['confirmationMessage']);
  }
  handleMessages(eventType: string, data: any){
      this.incommingMessageData = data;
      this.confirmationWindowIsVisible = true;
      this.message = data.message;
  }
  confirmation(){
    this.messenger.inform('obliteratePage', this.incommingMessageData.uniqueId);
    this.confirmationWindowIsVisible = false;
  }
  negation(){
    this.messenger.inform('iWantToBeClosed', this.incommingMessageData.uniqueId);
    this.confirmationWindowIsVisible = false;
  }

}
