import { Component, OnInit, Input, Output, EventEmitter, HostListener} from '@angular/core';
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  providers: [UniqueIdProviderService]
})
export class TabComponent implements OnInit {
  idProviderInstance = new UniqueIdProviderService();
  private _isActive: boolean = false;
  tabShapeClasses: any = {
    'active': false
  }
  
  @Input() tabTitle: string = "newTab";
  @Input() uniqueId: string = this.idProviderInstance.getUniqueId();
  @Input() bgColor: string = 'white'
  @Input() set isActive(val: boolean) {
    this.tabShapeClasses.active = val;
    this._isActive = val;
  };
  get isActive() {return this._isActive}
  @Output() tabChosen: EventEmitter<string> = new EventEmitter();

  constructor(private idProvider: UniqueIdProviderService,) { }

  @HostListener('click')
  onThisTabSelect(){
    this.tabChosen.emit(this.uniqueId)
    
  }

  ngOnInit(): void {
  }
}
