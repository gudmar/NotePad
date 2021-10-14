import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { CommunicationService } from '../../services/communication.service'
// import { ConcatSource } from 'webpack-sources';
import { SetColorsDirective } from '../../directives/set-colors.directive'
// import { Z_PARTIAL_FLUSH } from 'zlib';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabComponent implements OnInit {
  private idProviderInstance = new UniqueIdProviderService();
  inTitleEditMode: boolean = false;
  private nrOfOwnChildren: number = 0;
  private _isActive: boolean = false;
  private _isActiveBehind: boolean = false;
  tabShapeClasses: any = {
    'active': false,
    'active-behind': false
  }
  @Input() bgColor: string = 'white'
  @Input() isRectangleTab: boolean = false;
  @Input() tabTitle: string = "newTab";
  @Input() uniqueId: string = this.idProviderInstance.getUniqueId();
  @Input() set setBehind(val:boolean) {
    this._isActiveBehind = val;
    this.tabShapeClasses['active-behind'] = val;
  }
  @Input() set isActive(val: boolean) {
    this.tabShapeClasses.active = val;
    this._isActive = val;
  };
  get isActive() {return this._isActive}
  get setBehind() {return this._isActiveBehind}
  @Output() tabChosen: EventEmitter<string> = new EventEmitter();

  constructor(private messenger: CommunicationService) { }
  // constructor(private colorDirective: SetColorsDirective) { }

  @HostListener('click')
  onThisTabSelect(){
    this.tabChosen.emit(this.uniqueId)
  }
  @HostListener('dblclick', ['$event'])
  enterChangeTitleMode(event: any){
    event.stopPropagation();
    this.inTitleEditMode = true;
    event.target.contentEditable = true;
    event.target.focus();
  }
  @HostListener('focusout', ['$event'])
    exitChangeTitleMode(event: any){
    this.inTitleEditMode = false;
    let textValue = event.target.innerText;
    if (textValue != this.tabTitle) this.tabTitle = textValue;
    this.messenger.inform('changeCurrentPageTitle', {
      title: textValue,
      pageId: this.uniqueId
    })
  }

  killRelatedPage(data: any){
    // nrOfChidren uniqueId)
    this.messenger.inform('howManyChildrenDoIHave_page', this.uniqueId)
    this.messenger.inform('killMe_page', {uniqueId: this.uniqueId, nrOfChidren: this.nrOfOwnChildren})
    data.stopPropagation();
  }
  handleMessages(eventType: string, data:any){
    if (data.uniqueId == this.uniqueId) this.nrOfOwnChildren = data.nrOfOwnChildren
  }

  ngOnInit(): void {
    this.messenger.subscribe(this.uniqueId, this.handleMessages.bind(this), ['nrOfChidrenYouHave'])
  }
  // preventEnter(event:any){
  //   if (event.keyCode === 13) event.preventDefault();
  // }
  // preventPaste(event:any){
  //   event.preventDefault();
  // }
}
//   if (eventType === 'changeCurrentPageTitle'){
//     if (this.currentPageId == data.pageId) {
//       this.getCurrentPageDescriptor().title = data.title;
// }
