import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { ConcatSource } from 'webpack-sources';
import { Z_PARTIAL_FLUSH } from 'zlib';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabComponent implements OnInit {
  idProviderInstance = new UniqueIdProviderService();
  private _isActive: boolean = false;
  private _isActiveBehind: boolean = false;
  tabShapeClasses: any = {
    'active': false,
    'active-behind': false
  }
  
  @Input() tabTitle: string = "newTab";
  @Input() uniqueId: string = this.idProviderInstance.getUniqueId();
  @Input() bgColor: string = 'white'
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

  constructor(private idProvider: UniqueIdProviderService,) { }

  @HostListener('click')
  onThisTabSelect(){
    this.tabChosen.emit(this.uniqueId)
  }

  ngOnInit(): void {
  }
}
