import { Component, OnInit, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';
import { ValidatorService } from '../../../calendar/services/validator.service';

@Component({
  selector: 'add-edit-link-form',
  templateUrl: './add-edit-link-form.component.html',
  styleUrls: ['./add-edit-link-form.component.css']
})
export class AddEditLinkFormComponent implements OnInit {
  

  constructor(private communicator: CommunicationService,private validator: ValidatorService) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['openAddLinkForm', 'openEditLinkForm'])
  }
  
  type = 'Add'
  get boxTitle() { return this.type == 'Add'?'Add link component':"Edit link component"}
  uniqueId = 'addEditLinkFromId';
  private _data: any[]=[];
  topicLength: number = 20;
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
  private _shouldBeDisplayed: boolean = false;
  set shouldBeDisplayed(val: boolean){
    this._shouldBeDisplayed = val;
    if (val == false) {
      this.description = '';
      this.topic = '';
      this.link = '';
    }
  }
  get shouldBeDisplayed() {return this._shouldBeDisplayed}
  topic: string = '';
  lastTopic: string = this.topic;
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
  @HostListener('keyup', ['$event'])
    setContentIfValid(event:any){
      let currentContent
    }
  // getUpdatedTopic(event:any){this.topic = event.target.innerText}
  // getUpdatedDescription(event:any){this.description = event.target.innerText}
  // getUpdatedLink(event:any){this.link = event.target.innerText;}
  getCorrectLink(linkValue:string){
    return linkValue.toString().startsWith('http')||linkValue.toString().startsWith('file')?linkValue:'//'+linkValue
  }

  updateLastValidTopic(event:any){
    let isValid = this.validator.isSummaryValid(event.target.innerText, this.topicLength);
    if (isValid) this.lastTopic = event.target.innerText;
  }


  resetFormFields(){
    this.topicBox.nativeElement.innerText = '';
    this.descriptionBox.nativeElement.innerText = '';
    this.linkBox.nativeElement.innerText = '';
  }


  onSubmit() {
    if (this.type == 'Add'){
      let linkValue = this.linkBox.nativeElement.innerText;
      let descriptionValue = this.descriptionBox.nativeElement.innerText;
      let topicValue = this.topicBox.nativeElement.innerText;
      if (topicValue.trim() != '' && linkValue.trim() != ''){
        let newLinkObject = {
          topic: topicValue,
          description: descriptionValue,
          link: this.getCorrectLink(linkValue)
        }
        this.data.push(newLinkObject);
        this.resetFormFields();
        this.communicator.inform('displayMessageAndDoNotDisturb', {message:'Link added'})
        // this.communicator.inform('userInfo', {title:'Link added', timeout:1000})
      } else {
        this.communicator.inform('userInfo', 
          {title:'Link must have title and link fields not empty', type:'warning', timeout:3000})
      }
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
        this.communicator.inform('displayMessageDoNotDisturbId', {message: 'Link edited'})
      } else {
        this.communicator.inform('userInfo', {title:'Link cannot be found', type:'error', timeout:5000})
      }
    }
  }
  remove(){
    let indexOfElementToChange = this.findLinkIndex(this.topic, this.description,this.link);
    this.data.splice(indexOfElementToChange, 1);
    this.shouldBeDisplayed = false;
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
