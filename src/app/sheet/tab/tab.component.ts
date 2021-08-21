import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
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
  private _isActive: boolean = false;
  private _isActiveBehind: boolean = false;
  tabShapeClasses: any = {
    'active': false,
    'active-behind': false
  }
  @Input() bgColor: string = 'white'
  // private _bgColor:string = 'white';
  // fgColor: string = "black";
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

  constructor() { }
  // constructor(private colorDirective: SetColorsDirective) { }

  @HostListener('click')
  onThisTabSelect(){
    this.tabChosen.emit(this.uniqueId)
  }

  ngOnInit(): void {
  }
}
