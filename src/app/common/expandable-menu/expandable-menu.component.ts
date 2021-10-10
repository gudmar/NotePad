import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { AppMenuOperationsService } from '../../services/app-menu-operations.service';

@Component({
  selector: 'expandable-menu',
  templateUrl: './expandable-menu.component.html',
  styleUrls: ['./expandable-menu.component.css']
})
export class ExpandableMenuComponent implements OnInit {
  menu: AppMenuOperationsService = new AppMenuOperationsService(this.messenger);
  constructor(private messenger: CommunicationService, menu: AppMenuOperationsService) { }
  @Input() whatAppAmIIn = '';
  @ViewChild('loadFromFileId') loadFromFile: any;
  ngOnInit(): void {
  }

  display(content:string){
    this.messenger.inform('displayMessageAndDoNotDisturb', {message: content});
  }

  readDataFromFile(event:any){
    console.log('Reading file ')
    let file = event.target.files[0];
    let reader = new FileReader();
    let content: any;
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
      content = readerEvent.target;
      content = JSON.parse(content.result);
      this.messenger.inform('LoadFromFile', content);      
    }

  }
  openLinker(){
    this.messenger.inform('openLinkSearcher', null);
  }

  clickLoadFromFile(){

  }

}
