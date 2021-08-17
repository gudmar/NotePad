import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'

@Component({
  selector: 'tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabMenuComponent implements OnInit {
  listOfTabs: string[] = ['newTab']
  addButtonId: string = "addButtonId"
  uuidProvider: UniqueIdProviderService;
  constructor(uuidProvider: UniqueIdProviderService) { 
    this.uuidProvider = uuidProvider;
  }

  get newId(){return this.uuidProvider.getUniqueId()}

  ngOnInit(): void {
  }
}
