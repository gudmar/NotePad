import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { CommunicationService } from '../../services/communication.service'
import { ConcatSource } from 'webpack-sources';
import { SetColorsDirective } from '../../directives/set-colors.directive'
import { Z_PARTIAL_FLUSH } from 'zlib';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabComponent implements OnInit {
  idProviderInstance = new UniqueIdProviderService();
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
  // @Input() set bgColor (val: string) { 
  //   this._bgColor  = val;
  //   this.fgColor = this.colorManager.getFgColor(val);
  //   console.log(this.fgColor)
  // }
  // get bgColor() {return this._bgColor}
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
}
