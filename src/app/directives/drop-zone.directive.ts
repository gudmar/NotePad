import { Directive, HostListener } from '@angular/core';
import { CommunicationService} from '../services/communication.service'

@Directive({
  selector: '[dropZone]'
})
export class DropZoneDirective {
  // isDraggedOver: boolean = false;
  constructor(private communicator: CommunicationService) { }

  @HostListener('dragover', ['$event'])
  onDragOver(event: any){
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.gropEffect = 'copy'
    // this.isDraggedOver = true;
    // let timeOut = setTimeout(()=>{this.isDraggedOver = false; clearTimeout(timeOut)}, 100)
  }
  
  @HostListener('drop', ['$event'])
  async onDrop(event: any){
    // event.stopPropagation();
    event.preventDefault();
    let data = event.dataTransfer;
    if (data.files.length > 1) {
      this.communicator.inform('informUser', 'Only one file at a time is supported at the moment.')
      console.log('Only one file at a time supported')
      return null;
    } 
    let dataItem = data.items[0];
    if (dataItem.kind=='file') {
      let fileContent = await this.getFileContent(dataItem.getAsFile());
      let decodedFileContent = this.decodeFileContent(fileContent)
      this.communicator.inform('gotFileWithDataToLoad', decodedFileContent)
      console.log(decodedFileContent);
    }
    console.log(data)
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
