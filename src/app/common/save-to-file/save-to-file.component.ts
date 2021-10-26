import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { StorageManagerService } from '../../services/storage-manager.service';
import { FileOperationsService } from '../../services/file-operations.service';

@Component({
  selector: 'save-to-file',
  templateUrl: './save-to-file.component.html',
  styleUrls: ['./save-to-file.component.css']
})
export class SaveToFileComponent implements OnInit {
  fileName: string = this.getProposedFileName();
  title: string = 'Save to file:'
  uniqueId: string = 'saveToFileWindowId'
  shouldDisplay: boolean = false;
  document: any = {};
  constructor(
    private communicator: CommunicationService, 
    private storageManager: StorageManagerService,
    private fileOperations: FileOperationsService
  ) { }
  handleMessages(eventType:string, data:any){
    if (eventType == 'displaySaveToFileWindow'){
      this.shouldDisplay = true;
      this.fileName = this.getProposedFileName();
      this.document = data;
    }
  }
  ngOnInit(): void {
    this.communicator.subscribe(this.uniqueId, this.handleMessages.bind(this), ['displaySaveToFileWindow'])
  }

  ngOnDestroy(){
    this.communicator.unsubscribe(this.uniqueId);
  }

  confirm(){
    this.fileOperations.writeToFile(this.fileName, this.document)
    this.shouldDisplay = false;
  };
  cancel(){this.shouldDisplay = false;}

  getProposedFileName(){
    let lastUsedKey = this.storageManager.getLastUsedNoteDocument();
    if (lastUsedKey == null) lastUsedKey = this.storageManager.getDefaultKey();
    return lastUsedKey;
  }

  updateProposedFileName(event: any){
    this.fileName = event.target.innerText;
  }

}
