import { Component, OnInit } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent implements OnInit {
  listOfTabs: string[] = ['newTab']
  addButtonId: string = "addButtonId"
  constructor() { }

  ngOnInit(): void {
  }
}
