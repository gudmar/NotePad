import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { AnimateQueueService } from '../../services/animate-queue.service';

@Component({
  selector: 'inform-user-not-disturb',
  templateUrl: './inform-user-not-disturb.component.html',
  styleUrls: ['./inform-user-not-disturb.component.css']
})
export class InformUserNotDisturbComponent implements OnInit {
  shouldDisplay: boolean = false;
  beforeAnimation: boolean = true;
  uniqueId: string = 'displayMessageDoNotDisturbId'
  message: string = '';

  constructor(
    private communicator: CommunicationService,
    private animator: AnimateQueueService
  ) { 
    communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['displayMessageAndDoNotDisturb'])
  }

  ngOnDestroy(){
    this.communicator.unsubscribe(this.uniqueId);
  }

  handleMessages(eventType: string, data: any){
    if (eventType == 'displayMessageAndDoNotDisturb'){
      this.shouldDisplay = true;
      this.message = data.message;
      this.animateMessage();
    }
  }
  animateMessage(){
    this.animator.animate(
      {fn: this.displayMessage.bind(this), delay: 0},
      {fn: this.animateBorder.bind(this), delay:10},
      {fn: this.stopComponent.bind(this), delay: 2000},
      {fn: this.clearAfterAnimation.bind(this), delay: 2100}
    )
  }
  displayMessage(){this.shouldDisplay = true;}
  animateBorder(){this.beforeAnimation = false;}
  stopComponent(){this.shouldDisplay = false;}
  clearAfterAnimation(){this.beforeAnimation = true; this.message = '';this.shouldDisplay = false;}

  ngOnInit(): void {
  }

}
