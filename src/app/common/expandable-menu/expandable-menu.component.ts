import { Component, OnInit, Input } from '@angular/core';
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
  ngOnInit(): void {
  }

  display(content:string){
    this.messenger.inform('displayMessageAndDoNotDisturb', {message: content});
  }

}
