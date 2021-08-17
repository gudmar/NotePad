import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'

@Component({
  selector: 'tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabMenuComponent implements OnInit {
  @Input() pages: any[] = [];
  @Input() currentId: string = '';
  @Output() tabChosen: EventEmitter<string> = new EventEmitter()
  listOfTabs: string[] = ['newTab']
  addButtonId: string = "addButtonId"

  constructor(private uuidProvider: UniqueIdProviderService, private descriptorParser: DescriptorToDataService) { 
  }

  get newId(){return this.uuidProvider.getUniqueId()}

  ngOnInit(): void {
  }

  getPageId(descriptorItem: {uniqueId: any}){
    return this.descriptorParser.getDescriptorsId(descriptorItem)
  }

  getPageConfigurationData(descriptorItem: {uniqueId: any}){
    return this.descriptorParser.getDescriptorValues(descriptorItem)
  }

  isThisPageActive(pageDescriptor: {uniqueId: any}){
    return this.getPageId(pageDescriptor) === this.currentId
  }

  tabWantsToBeActive(data:any){
    this.currentId = data;
    this.tabChosen.emit(data);
  }
}
