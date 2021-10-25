import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'chose-tool-menu',
  templateUrl: './chose-tool-menu.component.html',
  styleUrls: ['./chose-tool-menu.component.css']
})
export class ChoseToolMenuComponent implements OnInit {
  private _radioActiveButton = 0;
  uniqueId="choseToolId"
  constructor(
    private communicator: CommunicationService
  ) { 
    this.communicator.subscribe(this.uniqueId, this.messageHandler.bind(this),['routeSwitched'])
  }
  messageHandler(eventType:string, data:any){
    if (eventType=='routeSwitched'){
        this._radioActiveButton = this.getToolIndex(data)
      }
  }

  getToolIndex(toolName:string){
    let singleMatch = function(item:any, index:number){return item.name == toolName ? true : false;}
    return this.tools.findIndex(singleMatch)
  }

  tools:any[] = [
    {name: 'notePad', link:'/notePad'},
    {name: 'linker', link:'/linker'},
    {name: 'calendar', link:'/calendar'}
  ]

  ngOnInit(): void {
  }
  isThisRadioActive(nr: number) {return nr === this._radioActiveButton}
  activateRadio(nr: number){this._radioActiveButton = nr;}
  displayHelp(){this.communicator.inform('displayHelp', null)}
}
