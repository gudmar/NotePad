import { Component, OnInit, Input} from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent implements OnInit {
  timeout:null|number=null;
  type: 'warning'|'error'|'info' = 'info';
  uniqueId='userInformatorId'
  shouldBeDisplayed: boolean = false;
  message: string = ''
  title: string = '';
  constructor(private communicator: CommunicationService) { }

  ngOnInit(): void {
    this.communicator.subscribe(this.uniqueId,this.handleMessages.bind(this), ['userInfo', 'informUser'])
  }

  ngOnDestroy(){
    this.communicator.unsubscribe(this.uniqueId);
  }

  handleMessages(eventType: string, data: any){
    if(eventType=="userInfo" || eventType == "informUser"){
      this.shouldBeDisplayed = true;
      this.message = data.message;
      if (data.type != undefined) this.type = data.type;
      if (data.title != undefined) this.title = data.title;
      if (data.timeout != undefined) this.timeout = data.timeout;
      this.selfTurnOff();
    }
  }


  selfTurnOff(){
    if (this.timeout != null) {
      let to = setTimeout(()=>{this.shouldBeDisplayed = false; clearTimeout(to);}, this.timeout);
      
      this.timeout = null;
    }
  }

  getBgColor(){
    if(this.type=="warning") return 'rgba(253, 255, 163, 1)';
    if (this.type == "error") return 'rgba(238, 114, 114, 1)';
    return 'rgba(182, 255, 163, 1)'
  }

  close(){this.shouldBeDisplayed = false;}

}
/* <div class="shutter">
<div class="message-window">
    <div class="title-bar">
        <div class="title">{{title}}</div><div *ngIf="timeout==null" class="close">&times;</div>
    </div>
    <div class="message-container">{{message}}</div>
</div>
</div> */
