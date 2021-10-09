import { Component, OnInit, Input, HostListener } from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service';
import { CommunicationService } from '../../services/communication.service';
import { link } from 'fs';

@Component({
  selector: 'link-searcher',
  templateUrl: './link-searcher.component.html',
  styleUrls: ['./link-searcher.component.css'],
  providers: [UniqueIdProviderService]
})
export class LinkSearcherComponent implements OnInit {
  @Input() linkDescriptorArray: any[] = [];
  filter: string = '';
  shouldBeDisplayed: boolean = true;
  currentlyVisibleLinks: any[] = [];
  searchFilter: string = '';
  constructor(
    private uuidProvider: UniqueIdProviderService, 
    private communicator: CommunicationService
  ) { }

  ngOnInit(): void {
  }


  openAddLinkForm(){
    this.communicator.inform('openAddLinkFrom', this.linkDescriptorArray);
  }
  getFilter(event:any){
    this.filter = event.target.innerText;
  }
  close(){
    this.shouldBeDisplayed = false;
  }

  strCompare(strA: string, strB: string){
    return strA.localeCompare(strB);
  }

  shouldLinkBeDisplayed(linkDescriptor:any){
    let stringToFindIn = linkDescriptor.title + ' ' + linkDescriptor.description;
    let valueToFind = this.filter;
    return this.doesStringContain(stringToFindIn, valueToFind)
  }

  doesStringContain(stringToFindIn:string, pattern: string){
    return stringToFindIn.toLocaleLowerCase().indexOf(pattern.toLocaleLowerCase()) == -1 ? false : true;
  }


}
