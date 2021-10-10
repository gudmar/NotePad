import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'add-edit-link-form',
  templateUrl: './add-edit-link-form.component.html',
  styleUrls: ['./add-edit-link-form.component.css']
})
export class AddEditLinkFormComponent implements OnInit {
  

  constructor(private communicator: CommunicationService) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['openAddLinkForm', 'openEditLinkForm'])
  }
  
  type = 'Add'
  get boxTitle() { return this.type == 'Add'?'Add link component':"Edit link component"}
  uniqueId = 'addEditLinkFromId';
  private _data: any[]=[];
  @Input() set data(val:any[]){
    this._data=val;
    // this.topic = val.topic;
    // this.description = val.description;
    // this.link = val.link;
  }
  get data() {return this._data}
  @ViewChild('topicBox') 
  topicBox: any;
  @ViewChild('descriptionBox')
  descriptionBox: any;
  @ViewChild('linkBox')
  linkBox: any;
  shouldBeDisplayed: boolean = false;
  topic: string = '';
  description: string = '';
  link: string = '';
  handleMessages(eventType:string, data:any){
    if (eventType == 'openAddLinkForm'){
      this.type = 'Add';
      this.data = data;
      this.shouldBeDisplayed = true;
    }
    if (eventType == 'openEditLinkForm'){
      this.type = 'Edit';
      this.data = data.links;
      this.topic  = data.linkDescriptor.topic;
      this.description = data.linkDescriptor.description;
      this.link = data.linkDescriptor.link;
      this.shouldBeDisplayed = true;
    }

  }
  // getUpdatedTopic(event:any){this.topic = event.target.innerText}
  // getUpdatedDescription(event:any){this.description = event.target.innerText}
  // getUpdatedLink(event:any){this.link = event.target.innerText;}
  getCorrectLink(linkValue:string){
    return linkValue.toString().startsWith('http')||linkValue.toString().startsWith('file')?linkValue:'//'+linkValue
  }
  onSubmit() {
    if (this.type == 'Add'){
      let linkValue = this.linkBox.nativeElement.innerText;
      let newLinkObject = {
        topic: this.topicBox.nativeElement.innerText,
        description: this.descriptionBox.nativeElement.innerText,
        link: this.getCorrectLink(linkValue)
      }
      // debugger
      this.data.push(newLinkObject);  
    }
    if (this.type == 'Edit'){
      let linkValue = this.linkBox.nativeElement.innerText;
      let linkTopic = this.topicBox.nativeElement.innerText;
      let linkDescription = this.descriptionBox.nativeElement.innerText;
      let indexOfElementToChange = this.findLinkIndex(this.topic, this.description,this.link);
      if (indexOfElementToChange > -1){
        this.data[indexOfElementToChange] = {
          topic: linkTopic,
          description: linkDescription,
          link: this.getCorrectLink(linkValue)
        }
      } else {
        this.communicator.inform('userInfo', 'Link cannot be found')
      }
    }
  }
  close(){this.shouldBeDisplayed = false;}
  ngOnInit(): void {
    // this.topic = this.data.topic;
    // this.description = this.data.description;
    // this.link = this.data.link;
  }

  findLinkIndex(topic: string, description: string, link: string){
    function concat(arr: string[]){
      let output = '';
      for (let item of arr){
        output = output + item;
      }
      return output
    }
    let pattern = concat([topic, description, link]);
    let foundElementIndex = this.data.findIndex((value: any, index: number)=>{
      let currentItem = concat([value.topic, value.description, value.link]);
      return pattern == currentItem
    })
    return foundElementIndex;
  }

}
