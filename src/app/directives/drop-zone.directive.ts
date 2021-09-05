import { Directive, HostListener } from '@angular/core';
import { CommunicationService} from '../services/communication.service'
import { DocumentValidatorService } from '../services/document-validator.service';

@Directive({
  selector: '[dropZone]'
})
export class DropZoneDirective {
  // isDraggedOver: boolean = false;
  constructor(
    private communicator: CommunicationService,
    private validator: DocumentValidatorService
  ) { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: any){
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.gropEffect = 'copy'
    // this.isDraggedOver = true;
    // let timeOut = setTimeout(()=>{this.isDraggedOver = false; clearTimeout(timeOut)}, 100)
  }
  // timeout:null|number=null;
  // type: 'warning'|'error'|'info' = 'info';
  // uniqueId='userInformatorId'
  // shouldBeDisplayed: boolean = false;
  // message: string = ''
  // title: string = '';

  @HostListener('drop', ['$event'])
  async onDrop(event: any){
    // event.stopPropagation();
    event.preventDefault();
    let data = event.dataTransfer;
    if (data.files.length > 1) {
      this.communicator.inform('informUser', {
        message: 'Only one file at a time is supported at the moment.',
        timeout: 2500,
        type: 'warning',
      }
    )
      console.log('Only one file at a time supported')
      return null;
    } 
    let dataItem = data.items[0];
    if (dataItem.kind=='file') {
      let fileContent = await this.getFileContent(dataItem.getAsFile());
      console.log('File received')
      let decodedFileContent = this.decodeFileContent(fileContent)
      this.communicator.inform('gotFileWithDataToLoad', decodedFileContent);
      let isFileValid = this.validator.validateAsString(decodedFileContent);
      if (!isFileValid) this.communicator.inform('informUser', {
        message: `File corrupted`, timeout: 2000, type: 'error'}
      )
      if (isFileValid) this.communicator.inform('LoadFromFile', JSON.parse(decodedFileContent));

      console.log(`Document validation outcome: ${isFileValid}`)
      if (isFileValid)console.log(JSON.parse(decodedFileContent));
    }
    // console.log(data)
    return null;
  }

  decodeFileContent(utf8Coded: any){
    let decoder = new TextDecoder('utf-8')
    return decoder.decode(utf8Coded)
  }

  getFileContent(file: any) {
    var reader = new FileReader()
    var output = ''

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
    })
}

}
