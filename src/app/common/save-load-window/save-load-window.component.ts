import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  private _shouldBeDisplayed = false;
  set currentlySelectedItem(val: string){
    this._currentlySelectedItem = val;

  }
  get currentlySelectedItem() {return this._currentlySelectedItem}
  keys: any[] = [];
  @Input() set shouldBeDisplayed(val: boolean) {
    this._shouldBeDisplayed = val;
    this.currentlySelectedItem = '';
    this.isInputFieldEmpty = true;
    this.setShouldLoadRemoveButtonBeLockedVariable();
  }
  get shouldBeDisplayed() {return this._shouldBeDisplayed}
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

  @ViewChild('inputField') inputFiled: any;

  isThisActive(key: string){
    return {
      active: key == this._currentlySelectedItem
    }    
  }

  isInputFieldEmpty: boolean = true;
  // get isInputFieldEmpty() {
  //   if (this.inputFiled == undefined) return true;
  //   return this.inputFiled.nativeElement.innerText.trim() == '' ? true : false;
  // }

  keyChosen(data: any, key:string){
    this.currentlySelectedItem = key;
    this.setShouldLoadRemoveButtonBeLockedVariable();
    this.unlockKeysIfNotEmpty({target:{innerText:key}});
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

  shouldLoadRemoveButtonBeLocked:boolean = true;

  setShouldLoadRemoveButtonBeLockedVariable(){
    let indexOfItemInList = this.keys.findIndex((element: string)=>{return element == this.currentlySelectedItem})
    this.shouldLoadRemoveButtonBeLocked = indexOfItemInList == -1 ? true : false;
    return indexOfItemInList == -1 ? true : false;
  }

  getAllKesyFromStorage(){

    return this.storageManager.getAllItemsFromStorage()
  }

  setCurrentlySelectedItem(value: string){
    this.currentlySelectedItem = value;
  }

  save(){
    // if (this.currentlySelectedItem == '') this.currentlySelectedItem = "Default"
    if (!this.isInputFieldEmpty){
      this.communicator.inform('saveDocument', this.currentlySelectedItem);
      this.refresh();
      this.shouldBeDisplayed = false;
    }
  }

  removeCurrent(){
    this.storageManager.deleteSingleKey(this.currentlySelectedItem);
    this.inputFiled.nativeElement.innerText = '';
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
    if (!this.shouldLoadRemoveButtonBeLocked){
      if (this.storageManager.hasKey(this.currentlySelectedItem)){
        this.communicator.inform('loadDocument', this.currentlySelectedItem)
      }
      this.refresh();
      this.shouldBeDisplayed = false;
    }
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
  unlockKeysIfNotEmpty(data:any){
    this.setShouldLoadRemoveButtonBeLockedVariable();
    if (data.target.innerText.trim().length > 0) {
      this.isInputFieldEmpty = false;
    } else {
      this.isInputFieldEmpty = true;
    }
    
  }

  ngOnInit(): void {
    this.refresh();
  }

}
