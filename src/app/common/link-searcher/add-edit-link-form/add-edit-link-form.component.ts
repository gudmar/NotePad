import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'add-edit-link-form',
  templateUrl: './add-edit-link-form.component.html',
  styleUrls: ['./add-edit-link-form.component.css']
})
export class AddEditLinkFormComponent implements OnInit {
  

  constructor(private communicator: CommunicationService) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['openAddLinkForm', 'openEditLinkFrom'])
  }
  type = 'Add'
  get boxTitle() { return this.type == 'Add'?'Add link component':"Edit link component"}
  uniqueId = 'addEditLinkFromId';
  data: any;
  shouldBeDisplayed: boolean = false;
  topic: string = '';
  description: string = '';
  link: string = '';
  handleMessages(eventType:string, data:any){
    if (eventType == 'openAddLinkFrom'){
      this.data = data;
      this.shouldBeDisplayed = true;
      this.type = 'Add';
    }
    if (eventType == 'openEditLinkFrom'){
      this.data = data;
      this.shouldBeDisplayed = true;
      this.type = 'Edit';
    }

  }
  updateTopic(event:any){this.topic = event.target.innerText}
  updateDescription(event:any){this.description = event.target.innerText}
  updateLink(event:any){this.link = event.target.innerText}
  onSubmit() {
    if (this.type == 'Add'){
      let newLinkObject = {
        topic: this.topic,
        description: this.description,
        link: this.link
      }
      this.data.push(newLinkObject);  
    }
    if (this.type == 'Edit'){
      this.data.topic = this.topic;
      this.data.description = this.description;
      this.data.link = this.link;
    }
  }
  close(){this.shouldBeDisplayed = false;}
  ngOnInit(): void {
  }

}
