import { Component, OnInit, Input } from '@angular/core';
import { SearchListService } from '../../services/search-list.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  _temp:any[]=[];
  @Input() entries: any[] = [];
  // currentEntries: any[] = this.entries;
  set currentEntries(val:any[]) {
    this._temp = val;
  }
  get currentEntries(){return this._temp}
  shouldDisplay: boolean = true;
  constructor(private seracher: SearchListService) { }

  ngOnInit(): void {
    this.currentEntries = this.entries;
  }

  close(){
    this.shouldDisplay = false;
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
