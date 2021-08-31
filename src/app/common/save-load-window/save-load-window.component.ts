import { Component, OnInit, Input } from '@angular/core';
import { StorageManagerService } from '../../services/storage-manager.service';
import { CommunicationService } from '../../services/communication.service'
import { UniqueIdProviderService } from '../../services/unique-id-provider.service'
import { ConcatSource } from 'webpack-sources';

@Component({
  selector: 'save-load-window',
  templateUrl: './save-load-window.component.html',
  styleUrls: ['./save-load-window.component.css']
})
export class SaveLoadWindowComponent implements OnInit {

  itemsFromStorage: any[] = [];
  private _currentlySelectedItem: string = '';
  set currentlySelectedItem(val: string){
    this._currentlySelectedItem = val;

  }
  get currentlySelectedItem() {return this._currentlySelectedItem}
  keys: any[] = [];
  @Input() shouldBeDisplayed: boolean = false;
  @Input() saveLoadMode: 'save' | 'load' = 'save';
  uniqueId: string = 'saveLoadId';
  constructor(
    private storageManager: StorageManagerService,
    private communicator: CommunicationService,
    private uuidProvider: UniqueIdProviderService
  ) { 
    communicator.subscribe(
      this.uniqueId, 
      this.handleMessages.bind(this), 
      ['displaySaveWindow', 'displayLoadWindow']
    )
  }
  isThisActive(key: string){
    return {
      active: key == this._currentlySelectedItem
    }    
  }

  keyChosen(data: any){
    this.currentlySelectedItem = data;

  }

  handleMessages(eventType: string, data: any){
    if (eventType === 'displaySaveWindow') {
      this.saveLoadMode = "save";
      this.shouldBeDisplayed = true;
    }
    if (eventType === 'displayLoadWindow') {
      this.saveLoadMode = 'load';
      this.shouldBeDisplayed = true;
    }
  }

  getAllKesyFromStorage(){

    return this.storageManager.getAllItemsFromStorage()
  }

  setCurrentlySelectedItem(value: string){
    this.currentlySelectedItem = value;
  }

  save(){
    if (this.currentlySelectedItem == '') this.currentlySelectedItem = "Default"
    this.communicator.inform('saveDocument', this.currentlySelectedItem);
    this.refresh();
    this.shouldBeDisplayed = false;
  }

  removeCurrent(){
    this.storageManager.deleteSingleKey(this.currentlySelectedItem);
    this.refresh();
  }

  negation(){}

  shutSaveLoadWindow(){
    this.shouldBeDisplayed = false;
  }

  clearAllContent(){
    this.storageManager.clearStorage();
    this.refresh();
  }

  generateMocks(){
      for (let i = 0; i < 40; i++){
        localStorage.setItem(`test ${i}`, '')
    }
    this.refresh();
  }

  loadKey(){
    if (this.storageManager.hasKey(this.currentlySelectedItem)){
      this.communicator.inform('loadDocument', this.currentlySelectedItem)
      console.log('load key send')
    }
    this.refresh();
  }
  reloadAllComponents(){
    this.communicator.inform('refreshAllComponents', '')
  }

  refresh(){
    this.keys = this.getAllKesyFromStorage().sort((a, b) => a.localeCompare(b));
  }

  onChange(data: any){
    this.currentlySelectedItem = data.target.innerText;
  }

  ngOnInit(): void {
    this.refresh();
  }

}
