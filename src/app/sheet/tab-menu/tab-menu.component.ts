import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { DescriptorToDataService } from '../../services/descriptor-to-data.service'
import { CommunicationService } from '../../services/communication.service'
import { ConcatSource } from 'webpack-sources';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabMenuComponent implements OnInit {
  private _pages: any[] = [];
  @Input() set pages(val: any[]) {
    this._pages = val;
    this.pagesForFirstMenu = val;
    this.pagesForSecondMenu = [];
    let timer = setTimeout(()=>{this.devideMenu(); clearTimeout(timer)}, 10);
    let timer1 = setTimeout(()=>{this.devideMenu(); clearTimeout(timer1)}, 20);
    let timer2 = setTimeout(()=>{this.devideMenu(); clearTimeout(timer2)}, 30);
  }
  get pages() {return this._pages}
  @Input() currentId: string = '';
  @Output() tabChosen: EventEmitter<string> = new EventEmitter();
  @Output() addNewPage: EventEmitter<any> = new EventEmitter();
  @HostListener('window:resize')
  onResize(){
    this.devideMenu();
  }
  devideMenu(){
    let that = this;
    let nrOfElementsForFirstMenu = this.getNrOfPagesForFirstMenu();
    let nrOfElementsForSecondMenu = this.pages.length - nrOfElementsForFirstMenu;
    let putSingleElementToOneOfLists = function(element: any, index: number){
      if (index < nrOfElementsForFirstMenu) that.pagesForFirstMenu.push(element)
      else that.pagesForSecondMenu.push(element)
    }
    if (
      nrOfElementsForFirstMenu != this.pagesForFirstMenu.length || 
      nrOfElementsForSecondMenu != this.pagesForSecondMenu.length
    ){
      this.pagesForFirstMenu = [];
      this.pagesForSecondMenu = []
      this.pages.forEach(putSingleElementToOneOfLists);
    }    
  }

  ngAfterViewInit(){
    // setTimeout(()=>{this.devideMenu();});
  }

  pagesForFirstMenu: any[] = this.pages;
  pagesForSecondMenu: any[] = [];

  constructor(
    private messenger: CommunicationService,
    private uuidProvider: UniqueIdProviderService, 
    private descriptorParser: DescriptorToDataService,
    private elRef: ElementRef
  ) { 
  }

  getNrOfPagesForFirstMenu(){
    let getLastMatchingIndex = function(){
      let sumOfWidths = 0;
      
      let singleMatch = function(element: any, index: number, array: any[]){ 
        sumOfWidths += element;
        return sumOfWidths > widthLimit
      }
      let firstNotMatchingIndex = tabWidths.findIndex(singleMatch);
      if (firstNotMatchingIndex == -1) return tabWidths.length
      return firstNotMatchingIndex - 1; // if even one width causes tab menu to be too big, -1
    }
    
    let tabWidths = this.getWidthsOfTabElements();
    let aggregationButtonWidth = 50;
    let freeSpaceForTabs = this.elRef.nativeElement.querySelector('.tab-menu').getBoundingClientRect().width;
    console.log(freeSpaceForTabs)
    let widthLimit = freeSpaceForTabs - aggregationButtonWidth;
    let a = getLastMatchingIndex();
    return getLastMatchingIndex();
  }


  

  getWidthsOfTabElements(){
    let allChildren = this.elRef.nativeElement.querySelectorAll('tab');
    let widths:number[] = []
    for(let child of allChildren){
      widths.push(child.getBoundingClientRect().width);
    }
    return widths;
  }

  get newId(){return this.uuidProvider.getUniqueId()}

  ngOnInit(): void {
    this.messenger.subscribe('pageMenuId', this.handleMessages.bind(this), ['pageWasDeleted', 'newPageWasAdded']);
    // let timer = setTimeout(()=>{this.devideMenu();clearTimeout(timer)},10);
    
  }

  handleMessages(eventType: string, data:any){
    this.devideMenu()
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

  addNewTabToView(data: any){
    this.addNewPage.emit(data);
  }
}
