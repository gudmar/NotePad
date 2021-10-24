import { Component, OnInit, Input } from '@angular/core';
import { SearchListService } from '../../services/search-list.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  _temp:any[]=[];
  uniqueId: any = 'helpId'
  @Input() entries: any[] = [];
  // currentEntries: any[] = this.entries;
  set currentEntries(val:any[]) {
    this._temp = val;
  }
  get currentEntries(){return this._temp}
  shouldDisplay: boolean = false;
  constructor(
    private seracher: SearchListService,
    private communicator: CommunicationService
  ) { 
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['displayHelp'])
  }
  
  handleMessages(eventType: string, data: any){
    if (eventType == 'displayHelp') this.shouldDisplay = true;
  }

  ngOnInit(): void {
    this.currentEntries = this.entries;
  }

  close(){
    this.shouldDisplay = false;
    this.currentEntries = this.entries;
  }

  onSearchBoxChange(event:any){
    let filter = event.target.innerText;
    if (filter == '') {
      this.currentEntries = this.seracher.sortList(this.entries, 'title');
    } else {
      this.currentEntries = this.seracher.getFilteredSortedList(this.entries, 'title', filter);
    }

  }

  // getFilteredSortedList

}
