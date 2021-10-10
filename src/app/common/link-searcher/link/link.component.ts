import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommunicationService } from '../../../services/communication.service';

@Component({
  selector: 'custom-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  @Input() linkDescriptor: any;
  // @Input() uniqueId: string = '';
  constructor(private communicator: CommunicationService) { }

  // openModificationWindow(){
  //   this.communicator.inform('openEditLinkFrom', this.linkDescriptor);
  // }

  ngOnInit(): void {
  }
  @Output() pleaseDisplayEditWindow: EventEmitter<any> = new EventEmitter();

  displayEditWindow(){
    // console.log(this.linkDescriptor)
    this.pleaseDisplayEditWindow.emit(this.linkDescriptor)
    // this.communicator.inform('openEditLinkFrom', this.linkDescriptor);
  }

}
